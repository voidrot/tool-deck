use local_ip_address::local_ip;

#[tauri::command]
pub async fn get_local_ip() -> String {
    let local_ip = local_ip().unwrap();
    local_ip.to_string().into()
}