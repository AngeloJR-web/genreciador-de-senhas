#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use magic_crypt::{new_magic_crypt, MagicCryptTrait};

// Salva e criptografa
#[tauri::command]
fn salvar_cofre(dados: String, senha_mestra: String) -> Result<String, String> {
    // Cria o motor AES-256 usando a senha que o usuário digitou
    let mc = new_magic_crypt!(senha_mestra, 256);
    
    // Transforma o texto legível em um código embaralhado (Base64)
    let dados_criptografados = mc.encrypt_str_to_base64(dados);

    match fs::write("cofre.dat", dados_criptografados) {
        Ok(_) => Ok("Salvo com segurança!".to_string()),
        Err(e) => Err(format!("Erro ao salvar: {}", e)),
    }
}

// Lê e descriptografa
#[tauri::command]
fn ler_cofre(senha_mestra: String) -> Result<String, String> {
    match fs::read_to_string("cofre.dat") {
        Ok(conteudo_criptografado) => {
            // Tenta abrir com a senha que o usuário digitou
            let mc = new_magic_crypt!(senha_mestra, 256);
            
            match mc.decrypt_base64_to_string(&conteudo_criptografado) {
                Ok(dados_originais) => Ok(dados_originais), // Senha certa!
                Err(_) => Err("Senha incorreta".to_string()), // Senha errada!
            }
        },
        Err(_) => Ok("[]".to_string()), // Arquivo ainda não existe (primeiro uso)
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![salvar_cofre, ler_cofre])
        .run(tauri::generate_context!())
        .expect("Erro ao iniciar o Tauri");
}