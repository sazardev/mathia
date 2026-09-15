import type { Database, SqlJsStatic } from "sql.js";
import { MIGRATIONS } from "@/lib/storage/migrations";
import type {
  AchievementRow,
  DailyLogRow,
  MathiaStore,
  NotebookEntryInput,
  NotebookEntryRow,
  NotebookScopeType,
  Profile,
  ProgressRow,
  SrsItemRow,
} from "@/lib/storage/types";

const MAX_NOTEBOOK_CONTENT_BYTES = 300_000;
const MAX_NOTEBOOK_TITLE_CHARS = 120;

/** Espejo de `validate_notebook_entry` en `commands.rs` (BR-NOTE-1/2/4). */
function validateNotebookEntry(
  entry: Pick<
    NotebookEntryInput,
    "scopeType" | "scopeId" | "kind" | "title" | "content"
  >,
): void {
  if (entry.scopeType !== "global" && (entry.scopeId ?? "") === "") {
    throw new Error("scope_id es requerido cuando scopeType no es 'global'");
  }
  if (entry.scopeType === "global" && entry.scopeId !== null) {
    throw new Error("scope_id debe estar vacío cuando scopeType es 'global'");
  }
  if (
    new TextEncoder().encode(entry.content).length > MAX_NOTEBOOK_CONTENT_BYTES
  ) {
    throw new Error("El contenido de la nota excede el tamaño máximo");
  }
  if ([...entry.title].length > MAX_NOTEBOOK_TITLE_CHARS) {
    throw new Error("El título debe tener máximo 120 caracteres");
  }
}

/** Persistencia binaria intercambiable: IndexedDB en producción, memoria en tests. */
export interface BinaryPersistence {
  load(): Promise<Uint8Array | null>;
  save(data: Uint8Array): Promise<void>;
}

export function memoryPersistence(): BinaryPersistence & {
  dump(): Uint8Array | null;
} {
  let data: Uint8Array | null = null;
  return {
    async load() {
      return data;
    },
    async save(next) {
      data = next;
    },
    dump() {
      return data;
    },
  };
}

const SAVE_DEBOUNCE_MS = 250;

type SqlJsRow = Record<string, string | number | null>;

/** PRAGMA user_version sin depender de tablas (paridad con el driver Rust). */
function readUserVersion(db: Database): number {
  const result = db.exec("PRAGMA user_version");
  const value = result[0]?.values[0]?.[0];
  return typeof value === "number" ? value : Number(value ?? 0) || 0;
}

function rowsOf(
  db: Database,
  sql: string,
  params: readonly unknown[] = [],
): SqlJsRow[] {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params as never);
    const out: SqlJsRow[] = [];
    while (stmt.step()) {
      out.push(stmt.getAsObject() as SqlJsRow);
    }
    return out;
  } finally {
    stmt.free();
  }
}

function str(row: SqlJsRow, key: string): string {
  const value = row[key];
  return typeof value === "string" ? value : String(value ?? "");
}

function num(row: SqlJsRow, key: string): number {
  const value = row[key];
  return typeof value === "number" ? value : Number(value ?? 0);
}

function bool(row: SqlJsRow, key: string): boolean {
  return num(row, key) !== 0;
}

async function loadSqlJs(): Promise<SqlJsStatic> {
  const init = (await import("sql.js")).default;
  const wasmUrl = (await import("sql.js/dist/sql-wasm.wasm?url")).default;
  return init({ locateFile: () => wasmUrl });
}

export class WebStore implements MathiaStore {
  readonly kind = "web" as const;
  private readonly db: Database;
  private readonly persistence: BinaryPersistence | null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  private constructor(db: Database, persistence: BinaryPersistence | null) {
    this.db = db;
    this.persistence = persistence;
  }

  /** Abre (o crea) la base aplicando migraciones pendientes y restaurando desde persistencia. */
  static async open(
    persistence: BinaryPersistence,
    sqlOverride?: SqlJsStatic,
  ): Promise<WebStore> {
    const SQL = sqlOverride ?? (await loadSqlJs());
    const saved = await persistence.load();
    const db = saved ? new SQL.Database(saved) : new SQL.Database();
    const currentVersion = readUserVersion(db);
    for (const migration of MIGRATIONS) {
      if (migration.version <= currentVersion) continue;
      db.exec(migration.sql);
      // PRAGMA no acepta parámetros: el número viene de MIGRATIONS (confiable).
      db.run(`PRAGMA user_version = ${migration.version}`);
    }
    return new WebStore(db, persistence);
  }

  /** Para tests: base en memoria sin persistencia. Acepta SQL inyectado (Node). */
  static async openInMemory(sql?: SqlJsStatic): Promise<WebStore> {
    return WebStore.open(memoryPersistence(), sql);
  }

  private scheduleSave(): void {
    if (this.persistence === null || this.saveTimer !== null) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      void this.flush();
    }, SAVE_DEBOUNCE_MS);
  }

  async flush(): Promise<void> {
    if (this.persistence === null) return;
    if (this.saveTimer !== null) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
    }
    await this.persistence.save(this.db.export());
  }

  async createProfile(name: string, avatar: number): Promise<Profile> {
    const createdAt = Date.now();
    this.db.run(
      "INSERT INTO profiles(id, name, avatar, created_at) VALUES (lower(hex(randomblob(16))), ?1, ?2, ?3)",
      [name, avatar, createdAt],
    );
    this.scheduleSave();
    const rows = rowsOf(
      this.db,
      "SELECT id, name, avatar, created_at FROM profiles WHERE created_at = ?1 ORDER BY rowid DESC LIMIT 1",
      [createdAt],
    );
    const row = rows[0];
    if (!row) throw new Error("No se pudo crear el perfil");
    return {
      id: str(row, "id"),
      name: str(row, "name"),
      avatar: num(row, "avatar"),
      createdAt: num(row, "created_at"),
    };
  }

  async listProfiles(): Promise<Profile[]> {
    return rowsOf(
      this.db,
      "SELECT id, name, avatar, created_at FROM profiles ORDER BY created_at",
    ).map((row) => ({
      id: str(row, "id"),
      name: str(row, "name"),
      avatar: num(row, "avatar"),
      createdAt: num(row, "created_at"),
    }));
  }

  async renameProfile(id: string, name: string): Promise<void> {
    this.db.run("UPDATE profiles SET name = ?1 WHERE id = ?2", [name, id]);
    this.scheduleSave();
  }

  async deleteProfile(id: string): Promise<void> {
    this.db.run("PRAGMA foreign_keys = ON");
    this.db.run("DELETE FROM profiles WHERE id = ?1", [id]);
    this.scheduleSave();
  }

  async saveProgress(
    profileId: string,
    progress: Pick<ProgressRow, "lessonId" | "mastery" | "state">,
  ): Promise<void> {
    this.db.run(
      `INSERT INTO progress(profile_id, lesson_id, mastery, state, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5)
       ON CONFLICT(profile_id, lesson_id)
       DO UPDATE SET mastery = excluded.mastery, state = excluded.state, updated_at = excluded.updated_at`,
      [
        profileId,
        progress.lessonId,
        progress.mastery,
        progress.state,
        Date.now(),
      ],
    );
    this.scheduleSave();
  }

  async getProgress(profileId: string): Promise<ProgressRow[]> {
    return rowsOf(
      this.db,
      "SELECT lesson_id, mastery, state, updated_at FROM progress WHERE profile_id = ?1 ORDER BY lesson_id",
      [profileId],
    ).map((row) => ({
      lessonId: str(row, "lesson_id"),
      mastery: num(row, "mastery"),
      state: str(row, "state") as ProgressRow["state"],
      updatedAt: num(row, "updated_at"),
    }));
  }

  async setSetting(
    profileId: string,
    key: string,
    value: string,
  ): Promise<void> {
    this.db.run(
      `INSERT INTO settings(profile_id, key, value) VALUES (?1, ?2, ?3)
       ON CONFLICT(profile_id, key) DO UPDATE SET value = excluded.value`,
      [profileId, key, value],
    );
    this.scheduleSave();
  }

  async getSetting(profileId: string, key: string): Promise<string | null> {
    const rows = rowsOf(
      this.db,
      "SELECT value FROM settings WHERE profile_id = ?1 AND key = ?2",
      [profileId, key],
    );
    const row = rows[0];
    return row ? str(row, "value") : null;
  }

  async addDailyXp(
    profileId: string,
    day: string,
    xpDelta: number,
    goalActive: number,
  ): Promise<DailyLogRow> {
    this.db.run(
      `INSERT INTO daily_log(profile_id, day, xp, goal_met)
       VALUES (?1, ?2, ?3, 0)
       ON CONFLICT(profile_id, day) DO UPDATE SET xp = xp + excluded.xp`,
      [profileId, day, xpDelta],
    );
    this.db.run(
      `UPDATE daily_log SET goal_met = (xp >= ?3)
       WHERE profile_id = ?1 AND day = ?2`,
      [profileId, day, goalActive],
    );
    this.scheduleSave();
    const rows = rowsOf(
      this.db,
      "SELECT day, xp, goal_met FROM daily_log WHERE profile_id = ?1 AND day = ?2",
      [profileId, day],
    );
    const row = rows[0];
    if (!row) throw new Error("No se pudo registrar el XP diario");
    return {
      day: str(row, "day"),
      xp: num(row, "xp"),
      goalMet: bool(row, "goal_met"),
    };
  }

  async getDailyLog(
    profileId: string,
    sinceDay: string,
  ): Promise<DailyLogRow[]> {
    return rowsOf(
      this.db,
      "SELECT day, xp, goal_met FROM daily_log WHERE profile_id = ?1 AND day >= ?2 ORDER BY day",
      [profileId, sinceDay],
    ).map((row) => ({
      day: str(row, "day"),
      xp: num(row, "xp"),
      goalMet: bool(row, "goal_met"),
    }));
  }

  async unlockAchievement(
    profileId: string,
    achievementId: string,
  ): Promise<boolean> {
    this.db.run(
      `INSERT OR IGNORE INTO achievements(profile_id, achievement_id, unlocked_at)
       VALUES (?1, ?2, ?3)`,
      [profileId, achievementId, Date.now()],
    );
    const changed = this.db.getRowsModified();
    this.scheduleSave();
    return changed > 0;
  }

  async getAchievements(profileId: string): Promise<AchievementRow[]> {
    return rowsOf(
      this.db,
      "SELECT achievement_id, unlocked_at FROM achievements WHERE profile_id = ?1",
      [profileId],
    ).map((row) => ({
      achievementId: str(row, "achievement_id"),
      unlockedAt: num(row, "unlocked_at"),
    }));
  }

  async enqueueSrsItem(
    profileId: string,
    exerciseId: string,
    intervalDays: number,
    dueAt: number,
  ): Promise<void> {
    this.db.run(
      `INSERT INTO srs_queue(profile_id, exercise_id, interval_days, due_at)
       VALUES (?1, ?2, ?3, ?4)
       ON CONFLICT(profile_id, exercise_id)
       DO UPDATE SET interval_days = excluded.interval_days, due_at = excluded.due_at`,
      [profileId, exerciseId, intervalDays, dueAt],
    );
    this.scheduleSave();
  }

  async getSrsQueue(profileId: string): Promise<SrsItemRow[]> {
    return rowsOf(
      this.db,
      "SELECT exercise_id, interval_days, due_at FROM srs_queue WHERE profile_id = ?1",
      [profileId],
    ).map((row) => ({
      exerciseId: str(row, "exercise_id"),
      intervalDays: num(row, "interval_days"),
      dueAt: num(row, "due_at"),
    }));
  }

  async saveNotebookEntry(
    profileId: string,
    entry: NotebookEntryInput,
  ): Promise<NotebookEntryRow> {
    validateNotebookEntry(entry);
    const now = Date.now();
    const title = entry.title.trim();

    if (entry.id !== undefined && entry.id !== "") {
      this.db.run(
        `UPDATE notebook_entries SET title = ?1, content = ?2, updated_at = ?3
         WHERE id = ?4 AND profile_id = ?5`,
        [title, entry.content, now, entry.id, profileId],
      );
      this.scheduleSave();
      const row = rowsOf(
        this.db,
        "SELECT id, scope_type, scope_id, kind, title, content, created_at, updated_at FROM notebook_entries WHERE id = ?1",
        [entry.id],
      )[0];
      if (!row) throw new Error("Nota no encontrada");
      return toNotebookEntryRow(row);
    }

    this.db.run(
      `INSERT INTO notebook_entries
         (id, profile_id, scope_type, scope_id, kind, title, content, created_at, updated_at)
       VALUES (lower(hex(randomblob(16))), ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)`,
      [
        profileId,
        entry.scopeType,
        entry.scopeId,
        entry.kind,
        title,
        entry.content,
        now,
      ],
    );
    this.scheduleSave();
    const row = rowsOf(
      this.db,
      "SELECT id, scope_type, scope_id, kind, title, content, created_at, updated_at FROM notebook_entries WHERE rowid = last_insert_rowid()",
    )[0];
    if (!row) throw new Error("No se pudo crear la nota");
    return toNotebookEntryRow(row);
  }

  async listNotebookEntries(
    profileId: string,
    scopeType: NotebookScopeType,
    scopeId: string | null,
  ): Promise<NotebookEntryRow[]> {
    const sql =
      scopeId === null
        ? "SELECT id, scope_type, scope_id, kind, title, content, created_at, updated_at FROM notebook_entries WHERE profile_id = ?1 AND scope_type = ?2 AND scope_id IS NULL ORDER BY updated_at DESC"
        : "SELECT id, scope_type, scope_id, kind, title, content, created_at, updated_at FROM notebook_entries WHERE profile_id = ?1 AND scope_type = ?2 AND scope_id = ?3 ORDER BY updated_at DESC";
    const params =
      scopeId === null
        ? [profileId, scopeType]
        : [profileId, scopeType, scopeId];
    return rowsOf(this.db, sql, params).map(toNotebookEntryRow);
  }

  async deleteNotebookEntry(profileId: string, id: string): Promise<void> {
    this.db.run(
      "DELETE FROM notebook_entries WHERE id = ?1 AND profile_id = ?2",
      [id, profileId],
    );
    this.scheduleSave();
  }
}

function toNotebookEntryRow(row: SqlJsRow): NotebookEntryRow {
  const scopeId = row["scope_id"];
  return {
    id: str(row, "id"),
    scopeType: str(row, "scope_type") as NotebookScopeType,
    scopeId: scopeId === null || scopeId === undefined ? null : String(scopeId),
    kind: str(row, "kind") as NotebookEntryRow["kind"],
    title: str(row, "title"),
    content: str(row, "content"),
    createdAt: num(row, "created_at"),
    updatedAt: num(row, "updated_at"),
  };
}
