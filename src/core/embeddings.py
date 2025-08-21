"""Embeddings helper (to be completed in Phase 2)."""
from typing import List
from openai import OpenAI
from config.config import settings

class Embeddings:
    def __init__(self, model: str | None = None):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY or None)
        self.model = model or settings.MODEL_EMBEDDING

    def embed(self, texts: List[str]) -> List[List[float]]:
        """Return list of embedding vectors for the given texts."""
        res = self.client.embeddings.create(model=self.model, input=texts)
        return [d.embedding for d in res.data]