"""
Document processing utilities for PDF, DOCX, and text files
"""
import os
from typing import List, Dict, Any, Optional
from pathlib import Path
import PyPDF2
import docx
from loguru import logger
from config.config import get_settings

settings = get_settings()


class DocumentProcessor:
    """
    Handles document loading, parsing, and chunking
    """
    
    def __init__(self):
        """Initialize document processor"""
        self.supported_formats = ['.pdf', '.docx', '.txt', '.md']
        logger.info("📄 Document processor initialized")
    
    def load_document(self, file_path: str) -> Dict[str, Any]:
        """
        Load and parse a document
        
        Args:
            file_path: Path to the document file
            
        Returns:
            Dictionary containing document content and metadata
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_extension = file_path.suffix.lower()
        
        if file_extension not in self.supported_formats:
            raise ValueError(f"Unsupported file format: {file_extension}")
        
        logger.info(f"📖 Loading document: {file_path.name}")
        
        try:
            if file_extension == '.pdf':
                content = self._load_pdf(file_path)
            elif file_extension == '.docx':
                content = self._load_docx(file_path)
            elif file_extension in ['.txt', '.md']:
                content = self._load_text(file_path)
            else:
                raise ValueError(f"Unsupported format: {file_extension}")
            
            document = {
                "content": content,
                "metadata": {
                    "filename": file_path.name,
                    "file_path": str(file_path),
                    "file_size": file_path.stat().st_size,
                    "format": file_extension,
                    "character_count": len(content),
                    "word_count": len(content.split())
                }
            }
            
            logger.info(
                f"✅ Document loaded successfully - "
                f"{document['metadata']['word_count']} words, "
                f"{document['metadata']['character_count']} characters"
            )
            
            return document
            
        except Exception as e:
            logger.error(f"❌ Error loading document: {str(e)}")
            raise
    
    def _load_pdf(self, file_path: Path) -> str:
        """Load content from PDF file"""
        content = ""
        
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            for page_num, page in enumerate(pdf_reader.pages):
                try:
                    page_text = page.extract_text()
                    content += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
                except Exception as e:
                    logger.warning(f"⚠️ Error extracting page {page_num + 1}: {str(e)}")
                    continue
        
        return content.strip()
    
    def _load_docx(self, file_path: Path) -> str:
        """Load content from DOCX file"""
        doc = docx.Document(file_path)
        content = ""
        
        for paragraph in doc.paragraphs:
            content += paragraph.text + "\n"
        
        return content.strip()
    
    def _load_text(self, file_path: Path) -> str:
        """Load content from text file"""
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    
    def chunk_document(
        self,
        content: str,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None,
        preserve_paragraphs: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Split document content into chunks
        
        Args:
            content: Document content to chunk
            chunk_size: Maximum size of each chunk (in characters)
            chunk_overlap: Overlap between chunks
            preserve_paragraphs: Try to preserve paragraph boundaries
            
        Returns:
            List of chunk dictionaries
        """
        chunk_size = chunk_size or settings.chunk_size
        chunk_overlap = chunk_overlap or settings.chunk_overlap
        
        if not content:
            return []
        
        logger.info(f"✂️ Chunking document - Size: {chunk_size}, Overlap: {chunk_overlap}")
        
        if preserve_paragraphs:
            chunks = self._chunk_by_paragraphs(content, chunk_size, chunk_overlap)
        else:
            chunks = self._chunk_by_size(content, chunk_size, chunk_overlap)
        
        # Add metadata to chunks
        processed_chunks = []
        for i, chunk_text in enumerate(chunks):
            chunk = {
                "content": chunk_text,
                "metadata": {
                    "chunk_id": i,
                    "chunk_size": len(chunk_text),
                    "word_count": len(chunk_text.split())
                }
            }
            processed_chunks.append(chunk)
        
        logger.info(f"✅ Document chunked into {len(processed_chunks)} pieces")
        return processed_chunks
    
    def _chunk_by_paragraphs(self, content: str, chunk_size: int, chunk_overlap: int) -> List[str]:
        """Chunk content while preserving paragraph boundaries"""
        paragraphs = content.split('\n\n')
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            # If adding this paragraph would exceed chunk size
            if len(current_chunk) + len(paragraph) > chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                
                # Start new chunk with overlap
                if chunk_overlap > 0:
                    overlap_text = current_chunk[-chunk_overlap:]
                    current_chunk = overlap_text + "\n\n" + paragraph
                else:
                    current_chunk = paragraph
            else:
                if current_chunk:
                    current_chunk += "\n\n" + paragraph
                else:
                    current_chunk = paragraph
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def _chunk_by_size(self, content: str, chunk_size: int, chunk_overlap: int) -> List[str]:
        """Chunk content by fixed size"""
        chunks = []
        start = 0
        
        while start < len(content):
            end = start + chunk_size
            chunk = content[start:end]
            chunks.append(chunk)
            
            # Move start position with overlap
            start = end - chunk_overlap
            
            if start >= len(content):
                break
        
        return chunks
    
    def get_document_stats(self, file_path: str) -> Dict[str, Any]:
        """Get basic statistics about a document"""
        document = self.load_document(file_path)
        chunks = self.chunk_document(document["content"])
        
        return {
            "filename": document["metadata"]["filename"],
            "format": document["metadata"]["format"],
            "file_size_bytes": document["metadata"]["file_size"],
            "character_count": document["metadata"]["character_count"],
            "word_count": document["metadata"]["word_count"],
            "estimated_tokens": document["metadata"]["word_count"] * 1.3,  # Rough estimate
            "chunk_count": len(chunks),
            "average_chunk_size": sum(len(chunk["content"]) for chunk in chunks) / len(chunks) if chunks else 0
        }


# Global document processor instance
document_processor = DocumentProcessor()


def get_document_processor() -> DocumentProcessor:
    """Get the global document processor instance"""
    return document_processor
