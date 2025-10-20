from pypdf import PdfReader
from typing import BinaryIO
from .base import DocumentReader

class PdfTextReader(DocumentReader):
    def read(self, stream: BinaryIO) -> str:
        reader = PdfReader(stream)
        return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
