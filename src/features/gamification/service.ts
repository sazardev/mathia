import { getDefaultProfile, getStore } from "@/lib/storage";
import type { DailyLogRow, MathiaStore } from "@/lib/storage/types";
import { ACHIEVEMENTS, type AchievementDefinition } from "./achievements";
import {
  computeStreak,
  evaluateAchievements,
  generateLeague,
  isoWeekKey,
  isoWeekday,
  leagueSeed,
  levelFromXp,
  LESSON_COMPLETION_BONUS_XP,
  localDayKey,
  nextLeagueTier,
} from "./engine";
import type { Achievement, LeagueEntry, StreakData, XpProgress } from "./types";

const HISTORY_DAYS = 400;
/** BR-M7-10: XP de la meta activa. "Seria" (100) no existe aún como opción en Settings. */
const DAILY_GOAL_XP: Record<string, number> = {
  casual: 20,
  regular: 50,
  intensa: 200,
};
const DEFAULT_GOAL_XP = DAILY_GOAL_XP["regular"] ?? 50;

function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

function mondayOf(date: Date): Date {
  return addDays(date, 1 - isoWeekday(date));
}

function readNumber(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return value !== null && Number.isFinite(parsed) ? parsed : fallback;
}

async function readGoalActive(
  store: MathiaStore,
  profileId: string,
): Promise<number> {
  const raw = await store.getSetting(profileId, "daily_goal");
  return raw !== null
    ? (DAILY_GOAL_XP[raw] ?? DEFAULT_GOAL_XP)
    : DEFAULT_GOAL_XP;
}

async function readStreakInputs(store: MathiaStore, profileId: string) {
  const [freezesRaw, freezeAwardsRaw, bestDaysRaw] = await Promise.all([
    store.getSetting(profileId, "streakFreezeCount"),
    store.getSetting(profileId, "freezeAwardsGranted"),
    store.getSetting(profileId, "bestStreakDays"),
  ]);
  return {
    freezesAvailable: readNumber(freezesRaw, 0),
    freezeAwardsGranted: readNumber(freezeAwardsRaw, 0),
    persistedBestDays: readNumber(bestDaysRaw, 0),
  };
}

function sumXpInRange(
  dailyLog: readonly DailyLogRow[],
  fromDay: string,
  toDay: string,
): number {
  return dailyLog
    .filter((row) => row.day >= fromDay && row.day <= toDay)
    .reduce((total, row) => total + row.xp, 0);
}

function toAchievement(
  definition: AchievementDefinition,
  unlockedIds: ReadonlySet<string>,
): Achievement {
  return {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    unlocked: unlockedIds.has(definition.id),
  };
}

/**
 * Corre en cada lectura de logros/liga: si cruzamos a una semana ISO nueva,
 * reconstruye la liga de la semana recién cerrada (determinista, mismo seed
 * que se usó toda esa semana) para decidir ascenso/descenso (BR-M7-6/15).
 * Un salto de varias semanas sin abrir la app solo aplica UN paso de
 * ascenso/descenso (simplificación documentada; no hay job de rollover F6).
 */
async function rolloverLeagueIfNeeded(
  store: MathiaStore,
  profileId: string,
  dailyLog: readonly DailyLogRow[],
  today: Date,
  dailyGoalActive: number,
  userName: string,
): Promise<string> {
  const currentWeekStart = localDayKey(mondayOf(today));
  const [storedWeekStart, storedTierRaw] = await Promise.all([
    store.getSetting(profileId, "leagueWeekStart"),
    store.getSetting(profileId, "leagueTier"),
  ]);
  let tier = storedTierRaw ?? "bronce";

  if (storedWeekStart === currentWeekStart) return tier;

  if (storedWeekStart !== null) {
    const prevWeekEnd = localDayKey(addDays(new Date(storedWeekStart), 6));
    const prevWeekXp = sumXpInRange(dailyLog, storedWeekStart, prevWeekEnd);
    const seed = leagueSeed(profileId, isoWeekKey(new Date(storedWeekStart)));
    const prevLeague = generateLeague(
      seed,
      dailyGoalActive,
      prevWeekXp,
      userName,
      7,
    );
    const rank = prevLeague.findIndex((entry) => entry.isUser);
    const promoted = rank >= 0 && rank < 3;
    const demoted = rank >= prevLeague.length - 4;
    tier = nextLeagueTier(tier, promoted, demoted);
  }

  await Promise.all([
    store.setSetting(profileId, "leagueTier", tier),
    store.setSetting(profileId, "leagueWeekStart", currentWeekStart),
  ]);
  return tier;
}

/**
 * BR-M7-17: cuenta al INICIAR sesión si el SO reporta sin conexión. Si `navigator`
 * no reporta estado, no incrementa (honestidad antes que premio). El desbloqueo de
 * ACH-04 se evalúa después, en `recordSessionCompletion` (fin de sesión, BR-M7-16).
 */
export async function recordOfflineSessionStart(
  profileId: string,
): Promise<void> {
  if (typeof navigator === "undefined" || navigator.onLine !== false) return;
  const store = await getStore();
  const current = readNumber(
    await store.getSetting(profileId, "offlineSessionCount"),
    0,
  );
  await store.setSetting(profileId, "offlineSessionCount", String(current + 1));
  await store.flush();
}

export type SessionCompletionInput = {
  /** Suma de `xpForAnswer` de todos los ejercicios de la sesión (sin el bonus de lección). */
  earnedXp: number;
  allCorrectNoHints: boolean;
};

export type SessionCompletionResult = {
  xpProgress: XpProgress;
  streak: StreakData;
  newlyUnlocked: Achievement[];
};

/** BR-M7-16: fin de sesión — persiste XP/racha y evalúa los logros alcanzables hoy. */
export async function recordSessionCompletion(
  profileId: string,
  input: SessionCompletionInput,
): Promise<SessionCompletionResult> {
  const store = await getStore();
  const now = new Date();
  const today = localDayKey(now);
  const totalDelta = input.earnedXp + LESSON_COMPLETION_BONUS_XP;

  const goalActive = await readGoalActive(store, profileId);
  await store.addDailyXp(profileId, today, totalDelta, goalActive);

  const since = localDayKey(addDays(now, -HISTORY_DAYS));
  const [
    dailyLog,
    totalXpRaw,
    offlineCountRaw,
    progress,
    { freezesAvailable, freezeAwardsGranted, persistedBestDays },
  ] = await Promise.all([
    store.getDailyLog(profileId, since),
    store.getSetting(profileId, "totalXp"),
    store.getSetting(profileId, "offlineSessionCount"),
    store.getProgress(profileId),
    readStreakInputs(store, profileId),
  ]);

  const totalXp = readNumber(totalXpRaw, 0) + totalDelta;
  const xpProgress = levelFromXp(totalXp);
  const streak = computeStreak(
    dailyLog,
    today,
    freezesAvailable,
    persistedBestDays,
    freezeAwardsGranted,
  );
  const nextFreezesAvailable = Math.max(
    0,
    Math.min(
      2,
      freezesAvailable - streak.freezesConsumed + streak.newFreezesToGrant,
    ),
  );

  const lessonsCompletedCount = progress.filter(
    (row) => row.state === "completed",
  ).length;
  const offlineSessionCount = readNumber(offlineCountRaw, 0);

  const unlockIds = evaluateAchievements({
    lessonsCompletedCount,
    currentStreakDays: streak.currentDays,
    offlineSessionCount,
    allCorrectNoHints: input.allCorrectNoHints,
    level: xpProgress.level,
  });

  const [unlockedResults] = await Promise.all([
    Promise.all(
      unlockIds.map(async (id) => ({
        id,
        justUnlocked: await store.unlockAchievement(profileId, id),
      })),
    ),
    store.setSetting(profileId, "totalXp", String(totalXp)),
    store.setSetting(
      profileId,
      "streakFreezeCount",
      String(nextFreezesAvailable),
    ),
    store.setSetting(
      profileId,
      "freezeAwardsGranted",
      String(freezeAwardsGranted + streak.newFreezesToGrant),
    ),
    store.setSetting(profileId, "bestStreakDays", String(streak.bestDays)),
  ]);
  await store.flush();

  const newlyUnlocked: Achievement[] = unlockedResults
    .filter((entry) => entry.justUnlocked)
    .map((entry): Achievement | null => {
      const definition = ACHIEVEMENTS.find((a) => a.id === entry.id);
      if (definition === undefined) return null;
      return {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        unlocked: true,
      };
    })
    .filter((achievement): achievement is Achievement => achievement !== null);

  return {
    xpProgress,
    streak: {
      currentDays: streak.currentDays,
      bestDays: streak.bestDays,
      activeToday: streak.activeToday,
      lastSevenDays: streak.lastSevenDays,
    },
    newlyUnlocked,
  };
}

/** Solo lectura — para Home. No muta nada. */
export async function loadHomeSummary(
  profileId: string,
): Promise<{ xpProgress: XpProgress; streak: StreakData }> {
  const store = await getStore();
  const now = new Date();
  const today = localDayKey(now);
  const since = localDayKey(addDays(now, -HISTORY_DAYS));

  const [
    dailyLog,
    totalXpRaw,
    { freezesAvailable, freezeAwardsGranted, persistedBestDays },
  ] = await Promise.all([
    store.getDailyLog(profileId, since),
    store.getSetting(profileId, "totalXp"),
    readStreakInputs(store, profileId),
  ]);

  const xpProgress = levelFromXp(readNumber(totalXpRaw, 0));
  const streak = computeStreak(
    dailyLog,
    today,
    freezesAvailable,
    persistedBestDays,
    freezeAwardsGranted,
  );
  return {
    xpProgress,
    streak: {
      currentDays: streak.currentDays,
      bestDays: streak.bestDays,
      activeToday: streak.activeToday,
      lastSevenDays: streak.lastSevenDays,
    },
  };
}

/** Para la pantalla de logros/liga. Puede escribir el rollover semanal de liga (BR-M7-15). */
export async function loadAchievementsView(profileId: string): Promise<{
  achievements: Achievement[];
  league: LeagueEntry[];
  leagueTier: string;
}> {
  const store = await getStore();
  const [profile, unlockedRows] = await Promise.all([
    getDefaultProfile(),
    store.getAchievements(profileId),
  ]);
  const unlockedIds = new Set(unlockedRows.map((row) => row.achievementId));
  const achievements = ACHIEVEMENTS.map((definition) =>
    toAchievement(definition, unlockedIds),
  );

  const now = new Date();
  const since = localDayKey(addDays(now, -HISTORY_DAYS));
  const dailyLog = await store.getDailyLog(profileId, since);
  const goalActive = await readGoalActive(store, profileId);
  const tier = await rolloverLeagueIfNeeded(
    store,
    profileId,
    dailyLog,
    now,
    goalActive,
    profile.name,
  );

  const weekStart = localDayKey(mondayOf(now));
  const today = localDayKey(now);
  const weeklyXp = sumXpInRange(dailyLog, weekStart, today);
  const seed = leagueSeed(profileId, isoWeekKey(now));
  const league = generateLeague(
    seed,
    goalActive,
    weeklyXp,
    profile.name,
    isoWeekday(now),
  );

  return { achievements, league, leagueTier: tier };
}
