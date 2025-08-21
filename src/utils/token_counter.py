"""Token counting utilities (wired later across API calls)."""
import tiktoken

def count_tokens(text: str, model: str = "gpt-4.1-mini") -> int:
    try:
        enc = tiktoken.encoding_for_model(model)
    except Exception:
        enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text or ""))