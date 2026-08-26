import {
  createRng,
  hashSeed,
  randomInt,
  shuffled,
  type Rng,
} from "@/lib/math/random";
import type { DailyLogRow } from "@/lib/storage/types";
import type { AchievementId } from "./achievements";
import type { LeagueEntry, StreakData, XpProgress } from "./types";

/**
 * BR-M7-8: XP fijo por ejercicio según cómo se respondió.
 * Los tramos "tras fallo" (3 XP, repaso SRS) y "examen perfecto" (bonus 50)
 * no son alcanzables hasta que existan SRS/exámenes de unidad.
 */
export function xpForAnswer(hintsUsed: boolean, isCorrect: boolean): number {
  if (!isCorrect) return 0;
  return hintsUsed ? 6 : 10;
}

/** BR-M7-8: bonus fijo al completar una lección, además del XP por ejercicio. */
export const LESSON_COMPLETION_BONUS_XP = 20;

/** "YYYY-MM-DD" en hora LOCAL (BR-M7-1: fecha local del SO, nunca UTC). */
export function localDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDay(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

/** Lunes=1 .. Domingo=7 (ISO), de la fecha local dada. */
export function isoWeekday(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

/** "YYYY-Www" ISO de la semana que contiene `date` (para la semilla de liga). */
export function isoWeekKey(date: Date): string {
  const target = new Date(date);
  target.setDate(target.getDate() + 4 - isoWeekday(target));
  const yearStart = new Date(target.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

/** BR-M7-12: XP total acumulado necesario para alcanzar el nivel n. */
function levelThreshold(level: number): number {
  return (100 * level * (level + 1)) / 2;
}

/** BR-M7-12. `xp`/`nextLevelXp` son progreso DENTRO del nivel actual (no acumulado total). */
export function levelFromXp(totalXp: number): XpProgress {
  let level = 0;
  while (levelThreshold(level + 1) <= totalXp) level += 1;
  const bandStart = levelThreshold(level);
  const bandEnd = levelThreshold(level + 1);
  return { level, xp: totalXp - bandStart, nextLevelXp: bandEnd - bandStart };
}

export type StreakResult = StreakData & {
  freezesConsumed: number;
  newFreezesToGrant: number;
};

function longestGoalMetRun(dailyLog: readonly DailyLogRow[]): number {
  const sorted = [...dailyLog].sort((a, b) => (a.day < b.day ? -1 : 1));
  let best = 0;
  let run = 0;
  let prevDay: string | null = null;
  for (const entry of sorted) {
    if (!entry.goalMet) {
      run = 0;
      prevDay = entry.day;
      continue;
    }
    const consecutive =
      prevDay !== null &&
      localDayKey(addDays(parseDay(prevDay), 1)) === entry.day;
    run = consecutive ? run + 1 : 1;
    best = Math.max(best, run);
    prevDay = entry.day;
  }
  return best;
}

/**
 * BR-M7-1/2/3/4/18: la racha se recalcula en cada lectura a partir de `daily_log`
 * (fuente de verdad inmutable) en vez de mantenerse como contador mutable — cubre
 * "varios días sin abrir la app" sin necesitar un job de rollover en segundo plano.
 */
export function computeStreak(
  dailyLog: readonly DailyLogRow[],
  todayLocal: string,
  freezesAvailable: number,
  persistedBestDays: number,
  freezeAwardsGranted: number,
): StreakResult {
  const byDay = new Map(dailyLog.map((row) => [row.day, row.goalMet]));
  const activeToday = byDay.get(todayLocal) ?? false;

  let cursor = activeToday
    ? parseDay(todayLocal)
    : addDays(parseDay(todayLocal), -1);
  let currentDays = 0;
  let freezesConsumed = 0;
  for (;;) {
    const key = localDayKey(cursor);
    if (byDay.get(key) === true) {
      currentDays += 1;
    } else if (freezesConsumed < freezesAvailable) {
      freezesConsumed += 1;
      currentDays += 1;
    } else {
      break;
    }
    cursor = addDays(cursor, -1);
  }

  const bestDays = Math.max(
    persistedBestDays,
    currentDays,
    longestGoalMetRun(dailyLog),
  );
  // BR-M7-2: +1 freeze automático por cada múltiplo de 30 días de racha alcanzado,
  // acumulable hasta 2 en total (histórico, `freezeAwardsGranted` nunca decrece).
  const freezesEarnedByMilestones = Math.min(2, Math.floor(currentDays / 30));
  const newFreezesToGrant = Math.max(
    0,
    freezesEarnedByMilestones - freezeAwardsGranted,
  );

  const lastSevenDays = weekdayFlags(dailyLog, todayLocal);

  return {
    currentDays,
    bestDays,
    activeToday,
    lastSevenDays,
    freezesConsumed,
    newFreezesToGrant,
  };
}

/** `lastSevenDays` L→D de la semana calendario actual (BR-M7 UI de racha). */
export function weekdayFlags(
  dailyLog: readonly DailyLogRow[],
  todayLocal: string,
): boolean[] {
  const byDay = new Map(dailyLog.map((row) => [row.day, row.goalMet]));
  const today = parseDay(todayLocal);
  const monday = addDays(today, 1 - isoWeekday(today));
  return Array.from(
    { length: 7 },
    (_, i) => byDay.get(localDayKey(addDays(monday, i))) ?? false,
  );
}

const LEAGUE_TIERS = [
  "bronce",
  "plata",
  "oro",
  "zafiro",
  "rubí",
  "diamante",
] as const;
export type LeagueTier = (typeof LEAGUE_TIERS)[number];

/** BR-M7-6/15: top 3 sube, bottom 4 baja, sin bajar de Bronce. */
export function nextLeagueTier(
  currentTier: string,
  promoted: boolean,
  demoted: boolean,
): LeagueTier {
  const index = LEAGUE_TIERS.indexOf(currentTier as LeagueTier);
  const base = index === -1 ? 0 : index;
  if (promoted)
    return LEAGUE_TIERS[
      Math.min(base + 1, LEAGUE_TIERS.length - 1)
    ] as LeagueTier;
  if (demoted) return LEAGUE_TIERS[Math.max(base - 1, 0)] as LeagueTier;
  return LEAGUE_TIERS[base] as LeagueTier;
}

const RIVAL_NAMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elena",
  "Fabio",
  "Gina",
  "Hugo",
  "Iris",
  "Joel",
  "Kira",
  "Luis",
  "Mara",
  "Nico",
  "Olga",
  "Paco",
  "Quique",
  "Rosa",
  "Saúl",
  "Tania",
  "Uxía",
  "Vico",
  "Wendy",
  "Xavi",
  "Yara",
  "Zoe",
  "Abel",
  "Bea",
  "Ciro",
  "Dana",
] as const;

export function leagueSeed(profileId: string, isoWeek: string): number {
  return hashSeed(`${profileId}::${isoWeek}`);
}

function uniform(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

function roundToMultipleOf5(value: number): number {
  return Math.round(value / 5) * 5;
}

/** BR-M7-14: 14 rivales deterministas + el usuario, ordenados por XP desc. */
export function generateLeague(
  seed: number,
  dailyGoalActive: number,
  userWeeklyXp: number,
  userName: string,
  todayWeekday: number,
): LeagueEntry[] {
  const rng = createRng(seed);
  const names = shuffled(rng, RIVAL_NAMES).slice(0, 14);
  const rivals: LeagueEntry[] = names.map((name, i) => {
    const restDay = randomInt(rng, 1, 7);
    const target = roundToMultipleOf5(uniform(rng, 0.6, 1.8) * dailyGoalActive);
    let xp = 0;
    for (let day = 1; day <= todayWeekday; day += 1) {
      xp += day === restDay ? 0 : Math.round(target * uniform(rng, 0.8, 1.2));
    }
    return { id: `rival-${i}`, name, xp };
  });
  const entries: LeagueEntry[] = [
    ...rivals,
    { id: "user", name: userName, xp: userWeeklyXp, isUser: true },
  ];
  return entries.sort((a, b) => b.xp - a.xp);
}

export type AchievementContext = {
  /** Lecciones con state==="completed" DESPUÉS de guardar la de esta sesión. */
  lessonsCompletedCount: number;
  currentStreakDays: number;
  offlineSessionCount: number;
  /** Toda la lección respondida correcta al primer intento, sin pistas, sin saltos. */
  allCorrectNoHints: boolean;
  level: number;
};

/**
 * BR-M7-16: disparadores alcanzables hoy (fin de sesión + subida de nivel).
 * ACH-06/ACH-07 dependen de SRS/exámenes, todavía inexistentes — nunca se evalúan aquí.
 */
export function evaluateAchievements(ctx: AchievementContext): AchievementId[] {
  const unlocked: AchievementId[] = [];
  if (ctx.lessonsCompletedCount === 1) unlocked.push("ACH-01");
  if (ctx.currentStreakDays >= 7) unlocked.push("ACH-02");
  if (ctx.currentStreakDays >= 30) unlocked.push("ACH-03");
  if (ctx.offlineSessionCount >= 10) unlocked.push("ACH-04");
  if (ctx.allCorrectNoHints) unlocked.push("ACH-05");
  if (ctx.level >= 10) unlocked.push("ACH-08");
  return unlocked;
}
