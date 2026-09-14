import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { MathiaStore, Profile } from "@/lib/storage/types";
import { WebStore } from "@/lib/storage/web-store";

let SQL: SqlJsStatic;
let store: MathiaStore;
let profile: Profile;

vi.mock("@/lib/storage", async () => {
  return {
    getStore: () => Promise.resolve(store),
    getDefaultProfile: () => Promise.resolve(profile),
  };
});

beforeAll(async () => {
  SQL = await initSqlJs();
});

beforeEach(async () => {
  store = await WebStore.openInMemory(SQL);
  profile = await store.createProfile("Ana", 0);
  await store.setSetting(profile.id, "daily_goal", "regular");
});

describe("recordSessionCompletion", () => {
  it("persiste XP diario y devuelve nivel/racha actualizados", async () => {
    const { recordSessionCompletion } = await import("./service");
    const result = await recordSessionCompletion(profile.id, {
      earnedXp: 30,
      allCorrectNoHints: false,
    });
    // 30 (ejercicios) + 20 (bonus lección, BR-M7-8) = 50 XP.
    expect(result.xpProgress.level).toBe(0);
    expect(result.xpProgress.xp).toBe(50);
    expect(result.streak.activeToday).toBe(true);
    expect(result.streak.currentDays).toBe(1);
  });

  it("desbloquea ACH-01 en la primera lección completada", async () => {
    const { recordSessionCompletion } = await import("./service");
    await store.saveProgress(profile.id, {
      lessonId: "u1-l1",
      mastery: 100,
      state: "completed",
    });
    const result = await recordSessionCompletion(profile.id, {
      earnedXp: 30,
      allCorrectNoHints: false,
    });
    expect(result.newlyUnlocked.map((a) => a.id)).toContain("ACH-01");

    // Segunda sesión: ACH-01 ya no debe repetirse (BR-M7-16, idempotente).
    const second = await recordSessionCompletion(profile.id, {
      earnedXp: 10,
      allCorrectNoHints: false,
    });
    expect(second.newlyUnlocked.map((a) => a.id)).not.toContain("ACH-01");
  });

  it("desbloquea ACH-05 cuando la lección fue perfecta sin pistas", async () => {
    const { recordSessionCompletion } = await import("./service");
    const result = await recordSessionCompletion(profile.id, {
      earnedXp: 30,
      allCorrectNoHints: true,
    });
    expect(result.newlyUnlocked.map((a) => a.id)).toContain("ACH-05");
  });
});

describe("loadHomeSummary / loadAchievementsView", () => {
  it("loadHomeSummary no muta el estado (solo lectura)", async () => {
    const { recordSessionCompletion, loadHomeSummary } =
      await import("./service");
    await recordSessionCompletion(profile.id, {
      earnedXp: 10,
      allCorrectNoHints: false,
    });
    const before = await loadHomeSummary(profile.id);
    const after = await loadHomeSummary(profile.id);
    expect(after).toEqual(before);
  });

  it("loadAchievementsView arranca en liga Bronce para un perfil nuevo", async () => {
    const { loadAchievementsView } = await import("./service");
    const view = await loadAchievementsView(profile.id);
    expect(view.leagueTier).toBe("bronce");
    expect(view.league.some((entry) => entry.isUser)).toBe(true);
    expect(view.achievements).toHaveLength(8);
  });
});
