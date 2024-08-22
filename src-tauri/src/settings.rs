use serde::{Deserialize, Serialize};
use tauri::utils::config::parse::ConfigError;

#[derive(Debug, Deserialize, Serialize)]
#[serde(default)]
#[allow(unused)]
pub struct Settings {

}

impl Default for Settings {
    fn default() -> Self {
        Self {

        }
    }
}

impl Settings {
    pub fn new() -> Result<Self, ConfigError> {
        Ok(Self::default())
    }
}