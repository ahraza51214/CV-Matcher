from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.pdf_reader import read_pdf
from ..services.llm_client import chat_json
from ..services.prompting import SIMPLE_SYS as SINGLE_EVAL_SYS, SIMPLE_USER as SINGLE_EVAL_USER
from .schemas import MatchResponse, Explanations

router = APIRouter()

@router.post("/match", response_model=MatchResponse)
async def match(cv: UploadFile = File(...), jd: UploadFile = File(...)):
    cv_text = read_pdf(cv.file)
    jd_text = read_pdf(jd.file)
    if not cv_text.strip():
        raise HTTPException(400, detail="CV appears empty after parsing (scanned PDF?).")
    if not jd_text.strip():
        raise HTTPException(400, detail="Job description appears empty after parsing (scanned PDF?).")

    try:
        data = await chat_json(SINGLE_EVAL_SYS, SINGLE_EVAL_USER(cv_text, jd_text))
    except Exception as e:
        raise HTTPException(502, detail=f"AI evaluation failed: {e}")

    # Defensive reads with defaults
    expl = data.get("explanations", {}) or {}
    explanations = Explanations(
        reasoning=expl.get("reasoning"),
        mustHaveCoverage=_num(expl.get("mustHaveCoverage")),
        niceToHaveCoverage=_num(expl.get("niceToHaveCoverage")),
        overallFit=_num(expl.get("overallFit")),
        embeddingsSim=_num(expl.get("embeddingsSim")),
    )

    return MatchResponse(
        matchScore=int(data.get("matchScore", 0)),
        band=str(data.get("band", "Poor")),
        pros=list(data.get("pros", []) or []),
        cons=list(data.get("cons", []) or []),
        missingSkills=list(data.get("missingSkills", []) or []),
        explanations=explanations,
    )

def _num(x):
    """Coerce values like '0.85' -> 0.85, None -> None."""
    if x is None:
        return None
    try:
        return float(x)
    except (TypeError, ValueError):
        return None
