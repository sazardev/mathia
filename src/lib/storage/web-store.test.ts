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
