import { describe, expect, it } from "vitest";
import type { DailyLogRow } from "@/lib/storage/types";
import {
  computeStreak,
  evaluateAchievements,
  generateLeague,
  isoWeekKey,
  levelFromXp,
  localDayKey,
  nextLeagueTier,
  xpForAnswer,
} from "./engine";

describe("xpForAnswer (BR-M7-8)", () => {
  it("10 XP correcto sin pista, 6 con pista, 0 si falla", () => {
    expect(xpForAnswer(false, true)).toBe(10);
    expect(xpForAnswer(true, true)).toBe(6);
    expect(xpForAnswer(false, false)).toBe(0);
    expect(xpForAnswer(true, false)).toBe(0);
  });
});

describe("levelFromXp (BR-M7-12, tabla exacta)", () => {
  it("reproduce la tabla de umbrales de BUSINESS-RULES.md", () => {
    const table: [number, number][] = [
      [100, 1],
      [300, 2],
      [600, 3],
      [1000, 4],
      [1500, 5],
      [2100, 6],
      [2800, 7],
      [3600, 8],
      [4500, 9],
      [5500, 10],
    ];
    for (const [threshold, level] of table) {
      expect(levelFromXp(threshold).level).toBe(level);
      expect(levelFromXp(threshold - 1).level).toBe(level - 1);
    }
  });

  it("nivel 0 con 0 XP y progreso dentro del nivel actual", () => {
    expect(levelFromXp(0)).toEqual({ level: 0, xp: 0, nextLevelXp: 100 });
    // A mitad de camino entre nivel 4 (1000) y nivel 5 (1500).
    expect(levelFromXp(1250)).toEqual({ level: 4, xp: 250, nextLevelXp: 500 });
  });
});

function log(day: string, xp: number, goalMet: boolean): DailyLogRow {
  return { day, xp, goalMet };
}

describe("computeStreak (BR-M7-1/2/3/4/18)", () => {
  it("racha de 3 días consecutivos terminando hoy", () => {
    const result = computeStreak(
      [
        log("2026-08-23", 50, true),
        log("2026-08-24", 50, true),
        log("2026-08-25", 50, true),
      ],
      "2026-08-25",
      0,
      0,
      0,
    );
    expect(result.currentDays).toBe(3);
    expect(result.activeToday).toBe(true);
  });

  it("un hueco sin freeze rompe la racha", () => {
    const result = computeStreak(
      [log("2026-08-24", 50, true), log("2026-08-22", 50, true)],
      "2026-08-25",
      0,
      0,
      0,
    );
    // Hoy (25) no tiene fila -> arranca en 24 (cuenta), 23 falta -> rompe.
    expect(result.currentDays).toBe(1);
  });

  it("un freeze disponible puentea un hueco sin romper la racha", () => {
    const result = computeStreak(
      [
        log("2026-08-24", 50, true),
        log("2026-08-22", 50, true),
        log("2026-08-21", 50, true),
      ],
      "2026-08-25",
      1,
      0,
      0,
    );
    // 24 cuenta, 23 falta pero hay 1 freeze -> puenteado, 22 cuenta, 21 cuenta.
    expect(result.currentDays).toBe(4);
    expect(result.freezesConsumed).toBe(1);
  });

  it("bestDays nunca decrece respecto al valor persistido", () => {
    const result = computeStreak([], "2026-08-25", 0, 42, 0);
    expect(result.bestDays).toBe(42);
  });

  it("otorga un nuevo freeze al cruzar 30 días de racha, capado a 2", () => {
    const thirtyDays = Array.from({ length: 30 }, (_, i) =>
      log(localDayKeyFromOffset(-i), 50, true),
    );
    const result = computeStreak(thirtyDays, "2026-08-25", 0, 0, 0);
    expect(result.currentDays).toBe(30);
    expect(result.newFreezesToGrant).toBe(1);

    const alreadyGranted = computeStreak(thirtyDays, "2026-08-25", 0, 0, 1);
    expect(alreadyGranted.newFreezesToGrant).toBe(0);
  });
});

function localDayKeyFromOffset(offsetDays: number): string {
  const date = new Date(2026, 7, 25);
  date.setDate(date.getDate() + offsetDays);
  return localDayKey(date);
}

describe("isoWeekKey", () => {
  it("es estable dentro de la misma semana ISO", () => {
    expect(isoWeekKey(new Date(2026, 7, 24))).toBe(
      isoWeekKey(new Date(2026, 7, 25)),
    );
  });
});

describe("generateLeague (BR-M7-14, determinismo)", () => {
  it("mismo seed produce la misma liga", () => {
    const a = generateLeague(12345, 50, 120, "Tú", 5);
    const b = generateLeague(12345, 50, 120, "Tú", 5);
    expect(a).toEqual(b);
  });

  it("incluye exactamente 14 rivales + el usuario, ordenados por XP desc", () => {
    const league = generateLeague(999, 50, 300, "Tú", 5);
    expect(league).toHaveLength(15);
    expect(league.filter((e) => e.isUser)).toHaveLength(1);
    for (let i = 1; i < league.length; i += 1) {
      const prevXp = league[i - 1]?.xp ?? 0;
      const curXp = league[i]?.xp ?? 0;
      expect(prevXp).toBeGreaterThanOrEqual(curXp);
    }
  });

  it("nombres sin repetir dentro de la misma cohorte", () => {
    const league = generateLeague(555, 50, 100, "Tú", 5);
    const rivalNames = league.filter((e) => !e.isUser).map((e) => e.name);
    expect(new Set(rivalNames).size).toBe(rivalNames.length);
  });
});

describe("nextLeagueTier (BR-M7-6/15)", () => {
  it("sube, baja y nunca cae debajo de bronce", () => {
    expect(nextLeagueTier("bronce", true, false)).toBe("plata");
    expect(nextLeagueTier("plata", false, true)).toBe("bronce");
    expect(nextLeagueTier("bronce", false, true)).toBe("bronce");
    expect(nextLeagueTier("diamante", true, false)).toBe("diamante");
  });
});

describe("evaluateAchievements (BR-M7-16)", () => {
  it("desbloquea solo lo que corresponde al contexto dado", () => {
    const unlocked = evaluateAchievements({
      lessonsCompletedCount: 1,
      currentStreakDays: 7,
      offlineSessionCount: 0,
      allCorrectNoHints: false,
      level: 3,
    });
    expect(unlocked).toEqual(["ACH-01", "ACH-02"]);
  });

  it("es determinista: mismo contexto, mismo resultado (idempotente en el llamador)", () => {
    const ctx = {
      lessonsCompletedCount: 2,
      currentStreakDays: 30,
      offlineSessionCount: 10,
      allCorrectNoHints: true,
      level: 10,
    };
    expect(evaluateAchievements(ctx)).toEqual(evaluateAchievements(ctx));
    expect(evaluateAchievements(ctx)).toEqual([
      "ACH-02",
      "ACH-03",
      "ACH-04",
      "ACH-05",
      "ACH-08",
    ]);
  });
});
