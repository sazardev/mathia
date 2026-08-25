use thiserror::Error;

/// Error canónico de Mathia (RULES.md C-06). Serializable para cruzar el IPC.
#[derive(Error, Debug)]
pub enum MathiaError {
    #[error("base de datos: {0}")]
    Db(#[from] rusqlite::Error),
    #[error("entrada inválida: {0}")]
    InvalidInput(String),
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
}

impl serde::Serialize for MathiaError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

pub type MathiaResult<T> = Result<T, MathiaError>;
