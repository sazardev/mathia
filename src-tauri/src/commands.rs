//! Comandos IPC delgados: validan → delegan en `db` → devuelven DTOs (§2.5).

use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use tauri::State;

use crate::db::Db;
use crate::errors::MathiaResult;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileDto {
    pub id: String,
    pub name: String,
    pub avatar: i64,
    pub created_at: i64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProgressDto {
    pub lesson_id: String,
    pub mastery: i64,
    pub state: String,
    pub updated_at: i64,
}

fn now_millis() -> MathiaResult<i64> {
    Ok(SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| crate::errors::MathiaError::InvalidInput(e.to_string()))?
        .as_millis() as i64)
}

#[tauri::command]
pub fn create_profile(db: State<'_, Db>, name: String, avatar: i64) -> MathiaResult<ProfileDto> {
    let name = name.trim();
    if name.chars().count() > 24 {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El nombre debe tener máximo 24 caracteres".into(),
        ));
    }
    if !(0..=11).contains(&avatar) {
        return Err(crate::errors::MathiaError::InvalidInput(
            "Avatar fuera de rango (0-11)".into(),
        ));
    }
    let conn = db
        .0
        .lock()
        .map_err(|_| crate::errors::MathiaError::InvalidInput("Base de datos ocupada".into()))?;
    let created_at = now_millis()?;
    conn.execute(
        "INSERT INTO profiles(id, name, avatar, created_at)
         VALUES (lower(hex(randomblob(16))), ?1, ?2, ?3)",
        rusqlite::params![name, avatar, created_at],
    )?;
    let id: String = conn.query_row(
        "SELECT id FROM profiles WHERE rowid = last_insert_rowid()",
        [],
        |row| row.get(0),
    )?;
    Ok(ProfileDto {
        id,
        name: name.to_owned(),
        avatar,
        created_at,
    })
}

#[tauri::command]
pub fn list_profiles(db: State<'_, Db>) -> MathiaResult<Vec<ProfileDto>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt =
        conn.prepare("SELECT id, name, avatar, created_at FROM profiles ORDER BY created_at")?;
    let rows = stmt
        .query_map([], |row| {
            Ok(ProfileDto {
                id: row.get(0)?,
                name: row.get(1)?,
                avatar: row.get(2)?,
                created_at: row.get(3)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

#[tauri::command]
pub fn delete_profile(db: State<'_, Db>, id: String) -> MathiaResult<()> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    conn.execute("DELETE FROM profiles WHERE id = ?1", rusqlite::params![id])?;
    Ok(())
}

#[tauri::command]
pub fn save_progress(
    db: State<'_, Db>,
    profile_id: String,
    lesson_id: String,
    mastery: i64,
    state: String,
) -> MathiaResult<()> {
    if !(0..=100).contains(&mastery) {
        return Err(crate::errors::MathiaError::InvalidInput(
            "Mastery fuera de rango (0-100)".into(),
        ));
    }
    let updated_at = now_millis()?;
    let conn = db.0.lock().map_err(lock_poisoned)?;
    conn.execute(
        "INSERT INTO progress(profile_id, lesson_id, mastery, state, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(profile_id, lesson_id)
         DO UPDATE SET mastery = excluded.mastery,
                       state = excluded.state,
                       updated_at = excluded.updated_at",
        rusqlite::params![profile_id, lesson_id, mastery, state, updated_at],
    )?;
    Ok(())
}

#[tauri::command]
pub fn get_progress(db: State<'_, Db>, profile_id: String) -> MathiaResult<Vec<ProgressDto>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt = conn.prepare(
        "SELECT lesson_id, mastery, state, updated_at
         FROM progress WHERE profile_id = ?1 ORDER BY lesson_id",
    )?;
    let rows = stmt
        .query_map(rusqlite::params![profile_id], |row| {
            Ok(ProgressDto {
                lesson_id: row.get(0)?,
                mastery: row.get(1)?,
                state: row.get(2)?,
                updated_at: row.get(3)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

#[tauri::command]
pub fn set_setting(
    db: State<'_, Db>,
    profile_id: String,
    key: String,
    value: String,
) -> MathiaResult<()> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    conn.execute(
        "INSERT INTO settings(profile_id, key, value) VALUES (?1, ?2, ?3)
         ON CONFLICT(profile_id, key) DO UPDATE SET value = excluded.value",
        rusqlite::params![profile_id, key, value],
    )?;
    Ok(())
}

#[tauri::command]
pub fn get_setting(
    db: State<'_, Db>,
    profile_id: String,
    key: String,
) -> MathiaResult<Option<String>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt = conn.prepare("SELECT value FROM settings WHERE profile_id = ?1 AND key = ?2")?;
    let mut rows = stmt.query_map(rusqlite::params![profile_id, key], |row| {
        row.get::<_, String>(0)
    })?;
    match rows.next() {
        Some(value) => Ok(Some(value?)),
        None => Ok(None),
    }
}

fn lock_poisoned<T>(_: T) -> crate::errors::MathiaError {
    crate::errors::MathiaError::InvalidInput("Base de datos ocupada".into())
}
