"""Core OpenAI client wrapper.

Phase 1.1: skeleton only. Wire up API key and simple chat method.
Later phases add: tool calling, structured outputs, stop sequences, logging, etc.
"""
from typing import List, Optional, Dict, Any
from openai import OpenAI
from config.config import settings

class AIClient:
    def __init__(self, model: Optional[str] = None, temperature: float = 0.2, top_p: float = 1.0, max_output_tokens: int = 512, stop: Optional[List[str]] = None):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY or None)
        self.model = model or settings.MODEL_CHAT
        self.temperature = temperature
        self.top_p = top_p
        self.max_output_tokens = max_output_tokens
        self.stop = stop

    def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """Basic chat call (no tools yet).

        messages: list like [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}]
        Returns: assistant message string
        """
        params = dict(
            model=self.model,
            messages=messages,
            temperature=kwargs.get("temperature", self.temperature),
            top_p=kwargs.get("top_p", self.top_p),
            max_tokens=kwargs.get("max_tokens", self.max_output_tokens),
        )
        if self.stop:
            params["stop"] = self.stop

        resp = self.client.chat.completions.create(**params)
        return resp.choices[0].message.content or ""