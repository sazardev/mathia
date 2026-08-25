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

export interface MathiaStore {
  /** Identifica la implementación activa (diagnóstico/QA). */
  readonly kind: "tauri" | "web";

  createProfile(name: string, avatar: number): Promise<Profile>;
  listProfiles(): Promise<Profile[]>;
  deleteProfile(id: string): Promise<void>;

  saveProgress(
    profileId: string,
    progress: Pick<ProgressRow, "lessonId" | "mastery" | "state">,
  ): Promise<void>;
  getProgress(profileId: string): Promise<ProgressRow[]>;

  setSetting(profileId: string, key: string, value: string): Promise<void>;
  getSetting(profileId: string, key: string): Promise<string | null>;

  /** Solo driver web: fuerza volcado a IndexedDB. En Tauri es no-op. */
  flush(): Promise<void>;
}
