/**
 * Punto de acceso único al almacenamiento. Detecta el entorno una vez:
 * - Tauri (Windows/Linux/macOS/Android/iOS) → rusqlite vía IPC.
 * - Navegador web → sql.js WASM persistido en IndexedDB.
 * Uso: `const store = await getStore();`
 */
import { createTauriStore } from "@/lib/storage/tauri-store";
import type { MathiaStore } from "@/lib/storage/types";
import { WebStore, type BinaryPersistence } from "@/lib/storage/web-store";

export { getDefaultProfile } from "@/lib/storage/bootstrap";
export type {
  MathiaStore,
  Profile,
  ProgressRow,
  ProgressState,
} from "@/lib/storage/types";

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

/** Persistencia IndexedDB mínima (~30 líneas) sin dependencias externas. */
function idbPersistence(name: string): BinaryPersistence {
  const openDb = (): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onupgradeneeded = () => {
        if (request.result.objectStoreNames.contains("kv") === false) {
          request.result.createObjectStore("kv");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () =>
        reject(request.error ?? new Error("IndexedDB no disponible"));
    });

  return {
    async load() {
      const db = await openDb();
      return new Promise<Uint8Array | null>((resolve, reject) => {
        const tx = db.transaction("kv", "readonly");
        const req = tx.objectStore("kv").get("sqlite");
        req.onsuccess = () => {
          const value = req.result;
          resolve(value instanceof Uint8Array ? value : null);
        };
        req.onerror = () => reject(req.error ?? new Error("Lectura fallida"));
      });
    },
    async save(data) {
      const db = await openDb();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("kv", "readwrite");
        tx.objectStore("kv").put(data, "sqlite");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error ?? new Error("Escritura fallida"));
      });
    },
  };
}

let storePromise: Promise<MathiaStore> | null = null;

export function getStore(): Promise<MathiaStore> {
  storePromise ??= isTauri()
    ? Promise.resolve(createTauriStore())
    : WebStore.open(idbPersistence("mathia-storage"));
  return storePromise;
}

/** Expuesto para tests y diagnóstico QA. */
export const internals = { isTauri, idbPersistence };
