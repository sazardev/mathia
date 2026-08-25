/**
 * Migraciones versionadas — FUENTE ÚNICA compartida por:
 * - Driver web (sql.js): las ejecuta en orden al inicializar.
 * - Backend Rust (rusqlite): las embebe con include_str! y las aplica al arrancar.
 * Convención: NNNN_desc.sql, orden lexicográfico = orden de aplicación.
 */
const rawMigrations = import.meta.glob<string>("./sql/*.sql", {
  query: "?raw",
  import: "default",
  eager: true,
});

export interface Migration {
  readonly version: number;
  readonly name: string;
  readonly sql: string;
}

export const MIGRATIONS: readonly Migration[] = Object.entries(rawMigrations)
  .map(([path, sql]) => {
    const file = path.split("/").pop() ?? "";
    const version = Number.parseInt(file.slice(0, 4), 10);
    return { version, name: file, sql };
  })
  .filter((m) => Number.isFinite(m.version))
  // Oxlint propone toSorted (ES2023); el target del proyecto aún es ES2020.
  .sort((a, b) => a.version - b.version);
