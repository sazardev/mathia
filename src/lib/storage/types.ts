/**
 * Contrato del almacenamiento de Mathia (M9 BUSINESS-RULES).
 * Dos implementaciones, una interfaz:
 * - `tauri-store.ts` → rusqlite nativo (Windows/Linux/macOS/Android/iOS vía IPC).
 * - `web-store.ts`   → sql.js WASM + IndexedDB (modo navegador).
 * El resto de la app SOLO conoce `MathiaStore` — jamás elige driver.
 */

export type ProgressState =
  "locked" | "unlocked" | "in_progress" | "completed" | "needs_review";

export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly avatar: number;
  readonly createdAt: number;
}

export interface ProgressRow {
  readonly lessonId: string;
  readonly mastery: number;
  readonly state: ProgressState;
  readonly updatedAt: number;
}

export interface DailyLogRow {
  readonly day: string;
  readonly xp: number;
  readonly goalMet: boolean;
}

export interface AchievementRow {
  readonly achievementId: string;
  readonly unlockedAt: number;
}

export interface SrsItemRow {
  readonly exerciseId: string;
  readonly intervalDays: number;
  readonly dueAt: number;
}

export type NotebookScopeType = "global" | "unit" | "lesson";
export type NotebookEntryKind = "text" | "drawing";

export interface NotebookEntryRow {
  readonly id: string;
  readonly scopeType: NotebookScopeType;
  readonly scopeId: string | null;
  readonly kind: NotebookEntryKind;
  readonly title: string;
  readonly content: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface NotebookEntryInput {
  readonly id?: string;
  readonly scopeType: NotebookScopeType;
  readonly scopeId: string | null;
  readonly kind: NotebookEntryKind;
  readonly title: string;
  readonly content: string;
}

export interface MathiaStore {
  /** Identifica la implementación activa (diagnóstico/QA). */
  readonly kind: "tauri" | "web";

  createProfile(name: string, avatar: number): Promise<Profile>;
  listProfiles(): Promise<Profile[]>;
  renameProfile(id: string, name: string): Promise<void>;
  deleteProfile(id: string): Promise<void>;

  saveProgress(
    profileId: string,
    progress: Pick<ProgressRow, "lessonId" | "mastery" | "state">,
  ): Promise<void>;
  getProgress(profileId: string): Promise<ProgressRow[]>;

  setSetting(profileId: string, key: string, value: string): Promise<void>;
  getSetting(profileId: string, key: string): Promise<string | null>;

  /** Suma xp al día y recalcula goalMet (BR-M7-1/BR-M7-8). Devuelve la fila resultante. */
  addDailyXp(
    profileId: string,
    day: string,
    xpDelta: number,
    goalActive: number,
  ): Promise<DailyLogRow>;
  getDailyLog(profileId: string, sinceDay: string): Promise<DailyLogRow[]>;

  /** Idempotente (BR-M7-16): devuelve true solo si se desbloqueó ahora. */
  unlockAchievement(profileId: string, achievementId: string): Promise<boolean>;
  getAchievements(profileId: string): Promise<AchievementRow[]>;

  /** Encola/reprograma un ítem de repaso (BR-M4-7: el fallo alimenta SRS). */
  enqueueSrsItem(
    profileId: string,
    exerciseId: string,
    intervalDays: number,
    dueAt: number,
  ): Promise<void>;
  /** Todos los ítems de la cola, sin filtrar por vencimiento (el orden BR-M6-2 se aplica en `lib/srs`). */
  getSrsQueue(profileId: string): Promise<SrsItemRow[]>;

  /** Crea (sin id) o actualiza (con id) una nota del cuaderno. BR-NOTE-1/2/4 se validan en el backend. */
  saveNotebookEntry(
    profileId: string,
    entry: NotebookEntryInput,
  ): Promise<NotebookEntryRow>;
  listNotebookEntries(
    profileId: string,
    scopeType: NotebookScopeType,
    scopeId: string | null,
  ): Promise<NotebookEntryRow[]>;
  deleteNotebookEntry(profileId: string, id: string): Promise<void>;

  /** Solo driver web: fuerza volcado a IndexedDB. En Tauri es no-op. */
  flush(): Promise<void>;
}
