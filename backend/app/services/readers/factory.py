from fastapi import HTTPException, UploadFile
from .pdf_reader import PdfTextReader
from .docx_reader import DocxTextReader

_pdf = PdfTextReader()
_docx = DocxTextReader()

def read_any(upload: UploadFile) -> str:
    name = (upload.filename or "").lower()
    ctype = (upload.content_type or "").lower()

    try:
        if name.endswith(".pdf") or "pdf" in ctype:
            return _pdf.read(upload.file)
        if name.endswith(".docx") or "officedocument.wordprocessingml.document" in ctype:
            return _docx.read(upload.file)
    except Exception:
        raise HTTPException(400, detail=f"Failed to read file '{upload.filename}'. Ensure it's a valid PDF/DOCX.")

    raise HTTPException(415, detail="Unsupported file type. Please upload PDF or DOCX.")
