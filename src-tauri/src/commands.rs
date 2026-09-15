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

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotebookEntryDto {
    pub id: String,
    pub scope_type: String,
    pub scope_id: Option<String>,
    pub kind: String,
    pub title: String,
    pub content: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NotebookEntryInput {
    pub id: Option<String>,
    pub profile_id: String,
    pub scope_type: String,
    pub scope_id: Option<String>,
    pub kind: String,
    pub title: String,
    pub content: String,
}

/// BR-NOTE-2: el contenido de una nota no puede superar este tamaño.
const MAX_NOTEBOOK_CONTENT_BYTES: usize = 300_000;
/// BR-NOTE-4: el título de una nota no puede superar esta longitud.
const MAX_NOTEBOOK_TITLE_CHARS: usize = 120;
const VALID_SCOPE_TYPES: [&str; 3] = ["global", "unit", "lesson"];
const VALID_NOTEBOOK_KINDS: [&str; 2] = ["text", "drawing"];

/// BR-NOTE-1/2/4: valida forma de una entrada del cuaderno antes de tocar la base.
fn validate_notebook_entry(input: &NotebookEntryInput) -> MathiaResult<()> {
    if !VALID_SCOPE_TYPES.contains(&input.scope_type.as_str()) {
        return Err(crate::errors::MathiaError::InvalidInput(
            "scope_type inválido".into(),
        ));
    }
    if input.scope_type != "global" && input.scope_id.as_deref().unwrap_or("").is_empty() {
        return Err(crate::errors::MathiaError::InvalidInput(
            "scope_id es requerido cuando scope_type no es 'global'".into(),
        ));
    }
    if input.scope_type == "global" && input.scope_id.is_some() {
        return Err(crate::errors::MathiaError::InvalidInput(
            "scope_id debe estar vacío cuando scope_type es 'global'".into(),
        ));
    }
    if !VALID_NOTEBOOK_KINDS.contains(&input.kind.as_str()) {
        return Err(crate::errors::MathiaError::InvalidInput(
            "kind inválido".into(),
        ));
    }
    if input.content.len() > MAX_NOTEBOOK_CONTENT_BYTES {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El contenido de la nota excede el tamaño máximo".into(),
        ));
    }
    if input.title.chars().count() > MAX_NOTEBOOK_TITLE_CHARS {
        return Err(crate::errors::MathiaError::InvalidInput(
            "El título debe tener máximo 120 caracteres".into(),
        ));
    }
    Ok(())
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

#[tauri::command]
pub fn save_notebook_entry(
    db: State<'_, Db>,
    entry: NotebookEntryInput,
) -> MathiaResult<NotebookEntryDto> {
    validate_notebook_entry(&entry)?;
    let title = entry.title.trim().to_owned();
    let now = now_millis()?;
    let conn = db.0.lock().map_err(lock_poisoned)?;

    if let Some(id) = entry.id.filter(|id| !id.is_empty()) {
        let changed = conn.execute(
            "UPDATE notebook_entries SET title = ?1, content = ?2, updated_at = ?3
             WHERE id = ?4 AND profile_id = ?5",
            rusqlite::params![title, entry.content, now, id, entry.profile_id],
        )?;
        if changed == 0 {
            return Err(crate::errors::MathiaError::InvalidInput(
                "Nota no encontrada".into(),
            ));
        }
        let created_at: i64 = conn.query_row(
            "SELECT created_at FROM notebook_entries WHERE id = ?1",
            rusqlite::params![id],
            |row| row.get(0),
        )?;
        return Ok(NotebookEntryDto {
            id,
            scope_type: entry.scope_type,
            scope_id: entry.scope_id,
            kind: entry.kind,
            title,
            content: entry.content,
            created_at,
            updated_at: now,
        });
    }

    conn.execute(
        "INSERT INTO notebook_entries
            (id, profile_id, scope_type, scope_id, kind, title, content, created_at, updated_at)
         VALUES (lower(hex(randomblob(16))), ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)",
        rusqlite::params![
            entry.profile_id,
            entry.scope_type,
            entry.scope_id,
            entry.kind,
            title,
            entry.content,
            now,
        ],
    )?;
    let id: String = conn.query_row(
        "SELECT id FROM notebook_entries WHERE rowid = last_insert_rowid()",
        [],
        |row| row.get(0),
    )?;
    Ok(NotebookEntryDto {
        id,
        scope_type: entry.scope_type,
        scope_id: entry.scope_id,
        kind: entry.kind,
        title,
        content: entry.content,
        created_at: now,
        updated_at: now,
    })
}

#[tauri::command]
pub fn list_notebook_entries(
    db: State<'_, Db>,
    profile_id: String,
    scope_type: String,
    scope_id: Option<String>,
) -> MathiaResult<Vec<NotebookEntryDto>> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    let mut stmt = conn.prepare(
        "SELECT id, scope_type, scope_id, kind, title, content, created_at, updated_at
         FROM notebook_entries
         WHERE profile_id = ?1 AND scope_type = ?2 AND scope_id IS ?3
         ORDER BY updated_at DESC",
    )?;
    let rows = stmt
        .query_map(rusqlite::params![profile_id, scope_type, scope_id], |row| {
            Ok(NotebookEntryDto {
                id: row.get(0)?,
                scope_type: row.get(1)?,
                scope_id: row.get(2)?,
                kind: row.get(3)?,
                title: row.get(4)?,
                content: row.get(5)?,
                created_at: row.get(6)?,
                updated_at: row.get(7)?,
            })
        })?
        .collect::<Result<Vec<_>, _>>()?;
    Ok(rows)
}

#[tauri::command]
pub fn delete_notebook_entry(
    db: State<'_, Db>,
    id: String,
    profile_id: String,
) -> MathiaResult<()> {
    let conn = db.0.lock().map_err(lock_poisoned)?;
    conn.execute(
        "DELETE FROM notebook_entries WHERE id = ?1 AND profile_id = ?2",
        rusqlite::params![id, profile_id],
    )?;
    Ok(())
}

fn lock_poisoned<T>(_: T) -> crate::errors::MathiaError {
    crate::errors::MathiaError::InvalidInput("Base de datos ocupada".into())
}

#[cfg(test)]
mod notebook_tests {
    use super::*;

    fn base_input() -> NotebookEntryInput {
        NotebookEntryInput {
            id: None,
            profile_id: "p1".into(),
            scope_type: "lesson".into(),
            scope_id: Some("u1-l1".into()),
            kind: "text".into(),
            title: "Repaso".into(),
            content: "x + 2 = 5".into(),
        }
    }

    #[test]
    fn rechaza_scope_type_desconocido() {
        let mut input = base_input();
        input.scope_type = "materia".into();
        assert!(validate_notebook_entry(&input).is_err());
    }

    #[test]
    fn scope_no_global_requiere_scope_id() {
        let mut input = base_input();
        input.scope_id = None;
        assert!(
            validate_notebook_entry(&input).is_err(),
            "BR-NOTE-1: lesson/unit necesitan scope_id"
        );
    }

    #[test]
    fn scope_global_no_admite_scope_id() {
        let mut input = base_input();
        input.scope_type = "global".into();
        input.scope_id = Some("u1-l1".into());
        assert!(
            validate_notebook_entry(&input).is_err(),
            "BR-NOTE-1: global implica scope_id vacío"
        );
    }

    #[test]
    fn scope_global_sin_scope_id_es_valido() {
        let mut input = base_input();
        input.scope_type = "global".into();
        input.scope_id = None;
        assert!(validate_notebook_entry(&input).is_ok());
    }

    #[test]
    fn rechaza_kind_desconocido() {
        let mut input = base_input();
        input.kind = "audio".into();
        assert!(validate_notebook_entry(&input).is_err());
    }

    #[test]
    fn rechaza_contenido_demasiado_grande() {
        let mut input = base_input();
        input.content = "x".repeat(MAX_NOTEBOOK_CONTENT_BYTES + 1);
        assert!(
            validate_notebook_entry(&input).is_err(),
            "BR-NOTE-2: contenido no puede superar {MAX_NOTEBOOK_CONTENT_BYTES} bytes"
        );
    }

    #[test]
    fn rechaza_titulo_demasiado_largo() {
        let mut input = base_input();
        input.title = "a".repeat(MAX_NOTEBOOK_TITLE_CHARS + 1);
        assert!(
            validate_notebook_entry(&input).is_err(),
            "BR-NOTE-4: título no puede superar {MAX_NOTEBOOK_TITLE_CHARS} caracteres"
        );
    }
}
