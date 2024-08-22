use log;
use std::path::PathBuf;
use tauri::tray::TrayIconBuilder;
use tauri::{App, Builder, Manager, Wry};
use tauri_plugin_autostart::{MacosLauncher, ManagerExt};
#[allow(unused_imports)]
use tauri_plugin_log::{Target, TargetKind};
use tauri_plugin_store::{with_store, StoreCollection};

pub fn get_builder() -> Builder<Wry> {
    #[cfg(debug_assertions)]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new()
            .clear_targets()
            .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
            .targets([
                Target::new(TargetKind::Stdout),
                Target::new(TargetKind::Stderr)
            ])
            .level(log::LevelFilter::Warn)
            .level_for("tool-deck", log::LevelFilter::Debug)
            .build());
    #[cfg(not(debug_assertions))]
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new()
            .level(log::LevelFilter::Debug)
            .build());

    builder = apply_base_plugins(builder);

    builder
}

fn apply_base_plugins(builder: Builder<Wry>) -> Builder<Wry> {
    builder
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, None))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_network::init())
        .plugin(tauri_plugin_system_info::init())
}

pub fn manage_autostart(app: &mut App) {
    let autostart_manager = app.autolaunch();
    let _ = autostart_manager.enable();
    log::debug!(
        "registered for autostart? {}",
        autostart_manager.is_enabled().unwrap()
    );
    #[cfg(debug_assertions)]
    let _ = autostart_manager.disable();
}

pub fn manage_tray_icon(app: &mut App) {
    TrayIconBuilder::new()
        .on_tray_icon_event(|tray_handle, event| {
            tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
        })
        .build(app).expect("Failed to create tray icon");
}

pub fn manage_store(app: &mut App) {
    let stores = app.handle().try_state::<StoreCollection<Wry>>().ok_or("Store not found").unwrap();
    let path = PathBuf::from("store.bin");

    let _ = with_store(app.handle().clone(), stores, path, |store| {
        log::debug!("store opened: {:?}", store);

        Ok(())
    });
}