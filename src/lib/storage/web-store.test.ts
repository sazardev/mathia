import initSqlJs, { type SqlJsStatic } from "sql.js";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { WebStore, memoryPersistence } from "@/lib/storage/web-store";

let SQL: SqlJsStatic;

beforeAll(async () => {
  SQL = await initSqlJs();
});

afterAll(async () => {
  await Promise.resolve();
});

describe("WebStore (sql.js) — esquema y migraciones", () => {
  it("abre base nueva con esquema aplicado", async () => {
    const store = await WebStore.openInMemory(SQL);
    expect(await store.getSetting("nadie", "__nada__")).toBeNull();
  });

  it("reabrir sobre la misma persistencia es idempotente (F6/F7)", async () => {
    const persistence = memoryPersistence();
    await WebStore.open(persistence, SQL);
    const reopened = await WebStore.open(persistence, SQL);
    expect(await reopened.listProfiles()).toEqual([]);
  });
});

describe("WebStore — perfiles y progreso", () => {
  it("crea perfil y lo lista", async () => {
    const store = await WebStore.openInMemory(SQL);
    const created = await store.createProfile("Ana", 3);
    expect(created.name).toBe("Ana");
    expect(created.avatar).toBe(3);
    expect(created.id).toMatch(/^[0-9a-f]{32}$/);
    expect(await store.listProfiles()).toHaveLength(1);
  });

  it("saveProgress hace upsert por lección", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Beto", 1);
    await store.saveProgress(profile.id, {
      lessonId: "u1-l1",
      mastery: 10,
      state: "in_progress",
    });
    await store.saveProgress(profile.id, {
      lessonId: "u1-l1",
      mastery: 20,
      state: "completed",
    });
    const progress = await store.getProgress(profile.id);
    expect(progress).toHaveLength(1);
    expect(progress[0]?.mastery).toBe(20);
    expect(progress[0]?.state).toBe("completed");
  });

  it("renameProfile actualiza el nombre visible del perfil", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Temporal", 0);
    await store.renameProfile(profile.id, "Omar");
    const profiles = await store.listProfiles();
    expect(profiles[0]?.name).toBe("Omar");
  });

  it("deleteProfile elimina en cascada progreso y settings", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Carl", 2);
    await store.saveProgress(profile.id, {
      lessonId: "u2-l1",
      mastery: 50,
      state: "needs_review",
    });
    await store.setSetting(profile.id, "tema", "oscuro");
    await store.deleteProfile(profile.id);
    expect(await store.getProgress(profile.id)).toEqual([]);
    expect(await store.getSetting(profile.id, "tema")).toBeNull();
  });

  it("settings roundtrip aislado por perfil y clave", async () => {
    const store = await WebStore.openInMemory(SQL);
    const a = await store.createProfile("A", 0);
    const b = await store.createProfile("B", 1);
    await store.setSetting(a.id, "meta", "50");
    expect(await store.getSetting(b.id, "meta")).toBeNull();
    expect(await store.getSetting(a.id, "meta")).toBe("50");
  });
});

describe("WebStore — XP diario y logros (M7)", () => {
  it("addDailyXp acumula y recalcula goalMet", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Gamer", 0);
    const first = await store.addDailyXp(profile.id, "2026-08-25", 10, 20);
    expect(first).toEqual({ day: "2026-08-25", xp: 10, goalMet: false });
    const second = await store.addDailyXp(profile.id, "2026-08-25", 15, 20);
    expect(second).toEqual({ day: "2026-08-25", xp: 25, goalMet: true });
  });

  it("getDailyLog filtra por fecha y ordena", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Gamer2", 0);
    await store.addDailyXp(profile.id, "2026-08-01", 5, 20);
    await store.addDailyXp(profile.id, "2026-08-25", 30, 20);
    const log = await store.getDailyLog(profile.id, "2026-08-10");
    expect(log).toEqual([{ day: "2026-08-25", xp: 30, goalMet: true }]);
  });

  it("unlockAchievement es idempotente (BR-M7-16)", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Gamer3", 0);
    expect(await store.unlockAchievement(profile.id, "ACH-01")).toBe(true);
    expect(await store.unlockAchievement(profile.id, "ACH-01")).toBe(false);
    const achievements = await store.getAchievements(profile.id);
    expect(achievements).toHaveLength(1);
    expect(achievements[0]?.achievementId).toBe("ACH-01");
  });
});

describe("WebStore — cola SRS (M6)", () => {
  it("enqueueSrsItem hace upsert por ejercicio", async () => {
    const store = await WebStore.openInMemory(SQL);
    const profile = await store.createProfile("Srs", 0);
    await store.enqueueSrsItem(profile.id, "u1-l1-e1", 1, 1000);
    await store.enqueueSrsItem(profile.id, "u1-l1-e1", 2, 2000);
    const queue = await store.getSrsQueue(profile.id);
    expect(queue).toEqual([
      { exerciseId: "u1-l1-e1", intervalDays: 2, dueAt: 2000 },
    ]);
  });

  it("aísla la cola por perfil", async () => {
    const store = await WebStore.openInMemory(SQL);
    const a = await store.createProfile("A", 0);
    const b = await store.createProfile("B", 1);
    await store.enqueueSrsItem(a.id, "ex-a", 1, 1000);
    expect(await store.getSrsQueue(b.id)).toEqual([]);
    expect(await store.getSrsQueue(a.id)).toHaveLength(1);
  });
});

describe("WebStore — persistencia entre recargas (HU-05)", () => {
  it("los datos sobreviven a un reinicio completo del store", async () => {
    const persistence = memoryPersistence();

    const primera = await WebStore.open(persistence, SQL);
    const profile = await primera.createProfile("Persistente", 5);
    await primera.saveProgress(profile.id, {
      lessonId: "u2-l4",
      mastery: 80,
      state: "in_progress",
    });
    await primera.setSetting(profile.id, "metaDiaria", "100");
    await primera.flush();

    // Reinicio: instancia nueva desde los mismos bytes persistidos.
    const segunda = await WebStore.open(persistence, SQL);
    expect((await segunda.listProfiles()).map((p) => p.name)).toEqual([
      "Persistente",
    ]);
    const progress = await segunda.getProgress(profile.id);
    expect(progress[0]?.lessonId).toBe("u2-l4");
    expect(progress[0]?.mastery).toBe(80);
    expect(await segunda.getSetting(profile.id, "metaDiaria")).toBe("100");
  });

  it("el debounce de guardado vuelca sin flush explícito", async () => {
    vi.useFakeTimers();
    try {
      const persistence = memoryPersistence();
      const store = await WebStore.open(persistence, SQL);
      const profile = await store.createProfile("Timer", 0);
      await store.setSetting(profile.id, "k", "v");
      vi.advanceTimersByTime(500);

      const reabierta = await WebStore.open(persistence, SQL);
      expect(await reabierta.getSetting(profile.id, "k")).toBe("v");
    } finally {
      vi.useRealTimers();
    }
  });
});
