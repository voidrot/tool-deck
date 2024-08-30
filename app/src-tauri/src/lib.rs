mod setup;
mod commands;

use tauri::{async_runtime, App};
use std::sync::Mutex;
use tauri::tray::TrayIconBuilder;
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_autostart::ManagerExt;
use tauri_plugin_cli::CliExt;
use tauri_plugin_log::{fern::colors::ColoredLevelConfig, Target, TargetKind};
use crate::setup::set_complete;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize the app with global plugins
    let _ = tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new()
            .clear_targets()
            .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
            .targets([
                Target::new(TargetKind::Stdout),
                Target::new(TargetKind::Stderr),
                Target::new(TargetKind::Webview)
            ])
            .with_colors(ColoredLevelConfig::default())
            .level(log::LevelFilter::Warn)
            .level_for("tool-deck", log::LevelFilter::Debug)
            .level_for("neli", log::LevelFilter::Debug)
            .build()
        )
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]), /* arbitrary number of args to pass to your app */
        ))
        .plugin(tauri_plugin_cli::init())
        // .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {}))
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            // This is the callback that will be called when a second instance is invoked
            // You can decide what to do here, like focusing the window or just quitting
            // In this case, we just quit
            app.exit(0);
        }))
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_system_info::init())
        .manage(Mutex::new(setup::SetupState {
            frontend_task: false,
            backend_task: false,
        }))
        .setup(|app| {

            // Get the tray icon manager
            manage_tray_icon(app);

            // Get the autostart manager
            manage_autostart(app);

            match app.cli().matches() {
                // `matches` here is a Struct with { args, subcommand }.
                // `args` is `HashMap<String, ArgData>` where `ArgData` is a struct with { value, occurrences }.
                // `subcommand` is `Option<Box<SubcommandMatches>>` where `SubcommandMatches` is a struct with { name, matches }.
                Ok(matches) => {
                    println!("{:?}", matches)
                }
                Err(_) => {}
            }

            async_runtime::spawn(setup::setup(app.handle().clone()));


            Ok(())
        })
        .invoke_handler(tauri::generate_handler![set_complete])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn manage_autostart(app: &mut App) {
    let autostart_manager = app.autolaunch();
    let _ = autostart_manager.enable();
    log::debug!(
        "registered for autostart? {}",
        autostart_manager.is_enabled().unwrap()
    );
    #[cfg(debug_assertions)]
    let _ = autostart_manager.disable();
}

fn manage_tray_icon(app: &mut App) {
    TrayIconBuilder::new()
        .on_tray_icon_event(|tray_handle, event| {
            tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
        })
        .build(app).expect("Failed to create tray icon");
}
