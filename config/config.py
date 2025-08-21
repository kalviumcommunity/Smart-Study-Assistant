from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    MODEL_CHAT: str = "gpt-4.1-mini"
    MODEL_EMBEDDING: str = "text-embedding-3-small"
    VECTOR_DB_DIR: str = "./chroma"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    model_config = SettingsConfigDict(env_file=('.env', 'config/.env'), env_file_encoding='utf-8', extra='ignore')

settings = Settings()