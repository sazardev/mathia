import { getStore, type Profile } from "@/lib/storage";

let profilePromise: Promise<Profile> | null = null;

/**
 * Perfil único de la fase actual: se crea una vez y se reutiliza.
 * Cuando exista gestión multi-perfil (B-02), este punto es el único a cambiar.
 */
export function getDefaultProfile(): Promise<Profile> {
  profilePromise ??= (async () => {
    const store = await getStore();
    const existing = await store.listProfiles();
    const current = existing[0];
    if (current !== undefined) return current;
    return store.createProfile("Estudiante", 0);
  })();
  return profilePromise;
}
