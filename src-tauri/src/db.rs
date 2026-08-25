use std::path::Path;
use std::sync::Mutex;

use rusqlite::Connection;

use crate::errors::MathiaResult;

/// Migraciones — FUENTE ÚNICA en `src/lib/storage/sql/` (misma que consume el driver web).
const MIGRATIONS: &[&str] = &[include_str!("../../src/lib/storage/sql/0001_init.sql")];

/// Estado gestionado por Tauri: conexión única protegida (§2.5: Mutex fino).
pub struct Db(pub Mutex<Connection>);

impl Db {
    pub fn new(conn: Connection) -> Self {
        Self(Mutex::new(conn))
    }
}

/// Abre la base, habilita claves foráneas y aplica migraciones pendientes.
pub fn open(path: &Path) -> MathiaResult<Connection> {
    let conn = Connection::open(path)?;
    conn.pragma_update(None, "foreign_keys", "ON")?;
    migrate(&conn)?;
    Ok(conn)
}

/// Aplica migraciones versionadas vía `PRAGMA user_version`. Idempotente (F6/F7).
pub fn migrate(conn: &Connection) -> MathiaResult<()> {
    let current: i64 = conn.query_row("PRAGMA user_version", [], |row| row.get(0))?;
    for (index, sql) in MIGRATIONS.iter().enumerate() {
        let version = (index + 1) as i64;
        if version <= current {
            continue;
        }
        conn.execute_batch(sql)?;
        conn.pragma_update(None, "user_version", version)?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn memory() -> Connection {
        let conn = Connection::open_in_memory().expect("conexión en memoria");
        conn.pragma_update(None, "foreign_keys", "ON")
            .expect("foreign keys");
        migrate(&conn).expect("migraciones");
        conn
    }

    #[test]
    fn migraciones_son_idempotentes() {
        let conn = memory();
        // Segunda pasada no debe fallar ni duplicar nada (F6 idempotente).
        migrate(&conn).expect("segunda migración");
        let version: i64 = conn
            .query_row("PRAGMA user_version", [], |row| row.get(0))
            .expect("user_version");
        assert_eq!(version, MIGRATIONS.len() as i64);
    }

    #[test]
    fn esquema_contiene_tablas_del_dominio() {
        let conn = memory();
        let count: i64 = conn
            .query_row(
                "SELECT count(*) FROM sqlite_master WHERE type='table' AND name IN
                 ('meta','profiles','progress','srs_queue','daily_log','achievements','settings')",
                [],
                |row| row.get(0),
            )
            .expect("conteo de tablas");
        assert_eq!(count, 7);
    }

    #[test]
    fn perfil_y_progreso_roundtrip_con_cascada() {
        let conn = memory();
        conn.execute(
            "INSERT INTO profiles(id, name, avatar, created_at) VALUES ('p1', 'Ana', 3, 1)",
            [],
        )
        .expect("insertar perfil");
        conn.execute(
            "INSERT INTO progress(profile_id, lesson_id, mastery, state, updated_at)
             VALUES ('p1', 'u1-l1', 42, 'in_progress', 2)",
            [],
        )
        .expect("insertar progreso");

        conn.execute("DELETE FROM profiles WHERE id = 'p1'", [])
            .expect("borrar perfil");
        let restantes: i64 = conn
            .query_row("SELECT count(*) FROM progress", [], |row| row.get(0))
            .expect("contar progreso");
        assert_eq!(restantes, 0, "ON DELETE CASCADE debe limpiar progreso");
    }

    #[test]
    fn mastery_fuera_de_rango_rechazada() {
        let conn = memory();
        conn.execute(
            "INSERT INTO profiles(id, name, avatar, created_at) VALUES ('p1', 'B', 0, 1)",
            [],
        )
        .expect("perfil");
        let result = conn.execute(
            "INSERT INTO progress(profile_id, lesson_id, mastery, state, updated_at)
             VALUES ('p1', 'u1-l1', 101, 'unlocked', 2)",
            [],
        );
        assert!(result.is_err(), "CHECK(mastery<=100) debe rechazar 101");
    }
}
