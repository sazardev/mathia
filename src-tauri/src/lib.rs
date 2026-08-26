pub mod commands;
pub mod db;
pub mod errors;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // El updater solo existe en desktop; en móvil la app se actualiza por tienda/APK.
    #[cfg(desktop)]
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init());

    #[cfg(mobile)]
    let builder = tauri::Builder::default();

    builder
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let data_dir = app
                .path()
                .app_data_dir()
                .map_err(|e| std::io::Error::other(e.to_string()))?;
            std::fs::create_dir_all(&data_dir)?;
            let conn = db::open(&data_dir.join("mathia.sqlite"))?;
            app.manage(db::Db::new(conn));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::create_profile,
            commands::list_profiles,
            commands::rename_profile,
            commands::delete_profile,
            commands::save_progress,
            commands::get_progress,
            commands::set_setting,
            commands::get_setting,
            commands::add_daily_xp,
            commands::get_daily_log,
            commands::unlock_achievement,
            commands::get_achievements,
            commands::enqueue_srs_item,
            commands::get_srs_queue,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
