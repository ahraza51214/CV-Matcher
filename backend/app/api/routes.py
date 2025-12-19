from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from ..services.readers.factory import read_any
from ..domain.models import EvaluationRequest
from ..config.container import build_use_case
from ..config.settings import settings

router = APIRouter()

@router.post("/match")
async def match(
    cv: UploadFile = File(...),
    jd: UploadFile = File(...),
    provider: str | None = Query(None, description="OpenAI, Gemini, Claude, or Fusion"),
):
    cv_text = read_any(cv)
    jd_text = read_any(jd)
    if not cv_text.strip():
        raise HTTPException(400, detail="CV appears empty after parsing (scanned PDF?).")
    if not jd_text.strip():
        raise HTTPException(400, detail="Job description appears empty after parsing (scanned PDF?).")

    # Temporarily switch provider if query param is present
    original = settings.provider
    if provider and provider.lower() in ("openai", "gemini", "claude", "fusion"):
        settings.provider = provider  # override for this request only

    try:
        use_case = build_use_case()
        result = await use_case(EvaluationRequest(cv_text=cv_text, jd_text=jd_text))
        return result.model_dump()
    finally:
        settings.provider = original  # restore
