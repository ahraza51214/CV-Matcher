from typing import BinaryIO
from docx import Document
import io
from .base import DocumentReader

class DocxTextReader(DocumentReader):
    def read(self, stream: BinaryIO) -> str:
        data = stream.read()
        stream.seek(0)
        doc = Document(io.BytesIO(data))
        lines = [p.text.strip() for p in doc.paragraphs if (p.text or "").strip()]
        return "\n".join(lines).strip()
