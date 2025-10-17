from pypdf import PdfReader
from typing import BinaryIO

def read_pdf(stream: BinaryIO) -> str:
    reader = PdfReader(stream)
    return "\n".join(page.extract_text() or "" for page in reader.pages).strip()