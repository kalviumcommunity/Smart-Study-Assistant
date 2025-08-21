"""PDF/Text loader utilities (expanded in later phases)."""
from typing import List
import fitz  # PyMuPDF

def extract_text_from_pdf(path: str) -> str:
    text_parts: List[str] = []
    with fitz.open(path) as doc:
        for page in doc:
            text_parts.append(page.get_text("text"))
    return "\n".join(text_parts).strip()