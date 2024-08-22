// Prevents an additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
mod setup;
mod commands;
mod app;
mod api;
mod settings;

use crate::commands::get_local_ip;
use crate::setup::set_complete;
use std::sync::Mutex;
use tauri::async_runtime;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
fn main() {
    let _ = fix_path_env::fix();

    #[cfg(debug_assertions)]

    let builder = app::get_builder();

    builder
        .manage(Mutex::new(setup::SetupState {
            frontend_task: false,
            backend_task: false,
        }))
        .setup(|app| {
            // manage autostart
            app::manage_autostart(app);
            // tray icon
            app::manage_tray_icon(app);
            // spawn setup thread
            async_runtime::spawn(setup::setup(app.handle().clone()));
            // spawn api server
            async_runtime::spawn(api::start_api_server());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![set_complete, get_local_ip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
