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

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DailyLogDto {
    pub day: String,
    pub xp: i64,
    pub goal_met: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AchievementRowDto {
    pub achievement_id: String,
    pub unlocked_at: i64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SrsItemDto {
    pub exercise_id: String,
    pub interval_days: i64,
    pub due_at: i64,
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
pub fn rename_profile(db: State<'_, Db>, id: String, name: String) -> MathiaResult<()> {
    let name = name.trim();
    if name.is_empty() {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El nombre no puede estar vacío".into(),
        ));
    }
    if name.chars().count() > 24 {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El nombre debe tener máximo 24 caracteres".into(),
        ));
    }
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let changed = conn.execute(
        "UPDATE profiles SET name = ?1 WHERE id = ?2",
        rusqlite::params![name, id],
    )?;
    if changed == 0 {
        return Err(crate::errors::MathiaError::InvalidInput(
            "Perfil no encontrado".into(),
        ));
    }
    Ok(())
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

#[tauri::command]
pub fn add_daily_xp(
    db: State<'_, Db>,
    profile_id: String,
    day: String,
    xp_delta: i64,
    goal_active: i64,
) -> MathiaResult<DailyLogDto> {
    if xp_delta < 0 {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El XP a sumar no puede ser negativo".into(),
        ));
    }
    let conn = db.0.lock().map_err(lock_poisoned)?;
    conn.execute(
        "INSERT INTO daily_log(profile_id, day, xp, goal_met)
         VALUES (?1, ?2, ?3, 0)
         ON CONFLICT(profile_id, day)
         DO UPDATE SET xp = xp + excluded.xp",
        rusqlite::params![profile_id, day, xp_delta],
    )?;
    conn.execute(
        "UPDATE daily_log SET goal_met = (xp >= ?3)
         WHERE profile_id = ?1 AND day = ?2",
        rusqlite::params![profile_id, day, goal_active],
    )?;
    let (xp, goal_met): (i64, bool) = conn.query_row(
        "SELECT xp, goal_met FROM daily_log WHERE profile_id = ?1 AND day = ?2",
        rusqlite::params![profile_id, day],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )?;
    Ok(DailyLogDto { day, xp, goal_met })
}

#[tauri::command]
pub fn get_daily_log(
    db: State<'_, Db>,
    profile_id: String,
    since_day: String,
) -> MathiaResult<Vec<DailyLogDto>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt = conn.prepare(
        "SELECT day, xp, goal_met FROM daily_log
         WHERE profile_id = ?1 AND day >= ?2 ORDER BY day",
    )?;
    let rows = stmt
        .query_map(rusqlite::params![profile_id, since_day], |row| {
            Ok(DailyLogDto {
                day: row.get(0)?,
                xp: row.get(1)?,
                goal_met: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

#[tauri::command]
pub fn unlock_achievement(
    db: State<'_, Db>,
    profile_id: String,
    achievement_id: String,
) -> MathiaResult<bool> {
    let unlocked_at = now_millis()?;
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let inserted = conn.execute(
        "INSERT OR IGNORE INTO achievements(profile_id, achievement_id, unlocked_at)
         VALUES (?1, ?2, ?3)",
        rusqlite::params![profile_id, achievement_id, unlocked_at],
    )?;
    Ok(inserted > 0)
}

#[tauri::command]
pub fn get_achievements(
    db: State<'_, Db>,
    profile_id: String,
) -> MathiaResult<Vec<AchievementRowDto>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt =
        conn.prepare("SELECT achievement_id, unlocked_at FROM achievements WHERE profile_id = ?1")?;
    let rows = stmt
        .query_map(rusqlite::params![profile_id], |row| {
            Ok(AchievementRowDto {
                achievement_id: row.get(0)?,
                unlocked_at: row.get(1)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

#[tauri::command]
pub fn enqueue_srs_item(
    db: State<'_, Db>,
    profile_id: String,
    exercise_id: String,
    interval_days: i64,
    due_at: i64,
) -> MathiaResult<()> {
    if interval_days <= 0 {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El intervalo debe ser mayor a 0".into(),
        ));
    }
    let conn = db.0.lock().map_err(lock_poisoned)?;
    conn.execute(
        "INSERT INTO srs_queue(profile_id, exercise_id, interval_days, due_at)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(profile_id, exercise_id)
         DO UPDATE SET interval_days = excluded.interval_days, due_at = excluded.due_at",
        rusqlite::params![profile_id, exercise_id, interval_days, due_at],
    )?;
    Ok(())
}

#[tauri::command]
pub fn get_srs_queue(db: State<'_, Db>, profile_id: String) -> MathiaResult<Vec<SrsItemDto>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt = conn.prepare(
        "SELECT exercise_id, interval_days, due_at FROM srs_queue WHERE profile_id = ?1",
    )?;
    let rows = stmt
        .query_map(rusqlite::params![profile_id], |row| {
            Ok(SrsItemDto {
                exercise_id: row.get(0)?,
                interval_days: row.get(1)?,
                due_at: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

fn lock_poisoned<T>(_: T) -> crate::errors::MathiaError {
    crate::errors::MathiaError::InvalidInput("Base de datos ocupada".into())
}
