"""
Configuration settings for Smart Study Assistant
"""
import os
from typing import Optional
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings(BaseModel):
    """Application settings with environment variable support"""
    
    # OpenAI Configuration
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "your_openai_api_key_here")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "text-embedding-ada-002")
    
    # Model Parameters
    max_tokens: int = 2000
    temperature: float = 0.7
    top_p: float = 1.0
    top_k: int = 50

    # Vector Database Configuration
    vector_db_type: str = "chroma"
    vector_db_path: str = "./data/vector_db"

    # Document Processing
    chunk_size: int = 500
    chunk_overlap: int = 50

    # Logging Configuration
    log_level: str = "INFO"
    log_file: str = "./logs/app.log"

    # Feature Flags
    enable_function_calling: bool = True
    enable_structured_output: bool = True
    enable_token_logging: bool = True

    # RAG Configuration
    retrieval_top_k: int = 5
    similarity_threshold: float = 0.7


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings"""
    return settings


# Create necessary directories
def create_directories():
    """Create necessary directories for the application"""
    directories = [
        "data/sample_documents",
        "data/evaluation_data",
        "data/vector_db",
        "logs",
        "videos"
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)


if __name__ == "__main__":
    create_directories()
    print("✅ Configuration loaded successfully!")
    print(f"📁 Vector DB Path: {settings.vector_db_path}")
    print(f"🤖 OpenAI Model: {settings.openai_model}")
    print(f"📊 Log Level: {settings.log_level}")
