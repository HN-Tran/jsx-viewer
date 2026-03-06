use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Serialize)]
pub struct FileMetadata {
    name: String,
    size: u64,
    extension: String,
    path: String,
}

#[tauri::command]
pub fn read_file(path: &str) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
pub fn get_file_metadata(path: &str) -> Result<FileMetadata, String> {
    let p = Path::new(path);
    let metadata = fs::metadata(p).map_err(|e| format!("Failed to get metadata: {}", e))?;

    Ok(FileMetadata {
        name: p
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default(),
        size: metadata.len(),
        extension: p
            .extension()
            .map(|e| e.to_string_lossy().to_string())
            .unwrap_or_default(),
        path: path.to_string(),
    })
}
