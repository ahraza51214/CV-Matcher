from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.pdf_reader import read_pdf
from ..services.llm_client import embed_pair_cosine, chat_json
from ..services.prompting import STRUCTURE_SYS, PROSCONS_SYS, STRUCTURE_USER, PROSCONS_USER
from ..domain.scoring import compute_score
from .schemas import MatchResponse

router = APIRouter()

from fastapi import APIRouter, UploadFile, File, HTTPException
# ... (other imports unchanged)

@router.post("/match", response_model=MatchResponse)
async def match(cv: UploadFile = File(...), jd: UploadFile = File(...)):
    try:
        cv_text = read_pdf(cv.file)
        jd_text = read_pdf(jd.file)
        if not cv_text.strip():
            raise HTTPException(400, detail="CV appears empty after parsing (scanned PDF?).")
        if not jd_text.strip():
            raise HTTPException(400, detail="Job description appears empty after parsing (scanned PDF?).")

        # structure
        try:
            cv_json = await chat_json(STRUCTURE_SYS, STRUCTURE_USER("CV", cv_text))
            jd_json = await chat_json(STRUCTURE_SYS, STRUCTURE_USER("JD", jd_text))
        except RuntimeError as e:
            # contains status code and provider message
            raise HTTPException(status_code=502, detail=str(e))

        # similarity
        try:
            sim = await embed_pair_cosine(cv_json.get("summary",""), jd_json.get("summary",""))
        except RuntimeError as e:
            raise HTTPException(status_code=502, detail=str(e))

        # score + pros/cons
        scored = compute_score(cv_json, jd_json, sim)

        try:
            pc = await chat_json(PROSCONS_SYS, PROSCONS_USER(cv_json, jd_json))
        except RuntimeError as e:
            # don’t fail whole request; return partial with reason
            pc = {"pros": [], "cons": [f"Pros/cons generation failed: {e}"], "missingSkills": []}

        return MatchResponse(
            matchScore=scored["matchScore"],
            band=scored["band"],
            pros=pc.get("pros", []),
            cons=pc.get("cons", []),
            missingSkills=pc.get("missingSkills", []),
            explanations=scored["explanations"]
        )

    except HTTPException:
        raise
    except Exception as e:
        # catch-all for anything else
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

@router.get("/diag")
async def diag():
    try:
        # tiny sanity calls
        _ = await chat_json("You must output STRICT JSON only.", '{"ping":"pong"}')
        _ = await embed_pair_cosine("hello", "hello")
        return {"ok": True}
    except Exception as e:
        # surface exact provider error
        raise HTTPException(status_code=502, detail=str(e))
