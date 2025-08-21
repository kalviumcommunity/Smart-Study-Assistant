"""Vector DB operations (to be completed in Phase 4)."""
from typing import Iterable, List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from config.config import settings

class VectorDB:
    def __init__(self, collection: str = "notes"):
        self.client = chromadb.PersistentClient(path=settings.VECTOR_DB_DIR, settings=ChromaSettings(allow_reset=True))
        self.collection = self.client.get_or_create_collection(collection_name=collection)

    def add(self, ids: List[str], embeddings: List[List[float]], metadatas: Optional[List[Dict[str, Any]]] = None, documents: Optional[List[str]] = None):
        self.collection.add(ids=ids, embeddings=embeddings, metadatas=metadatas, documents=documents)

    def query(self, embedding: List[float], top_k: int = 5) -> Dict[str, Any]:
        return self.collection.query(query_embeddings=[embedding], n_results=top_k)