from fastapi import FastAPI
from config.config import settings

app = FastAPI(title="Smart Study Assistant API", version="0.1.0")

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_chat": settings.MODEL_CHAT,
        "model_embedding": settings.MODEL_EMBEDDING
    }