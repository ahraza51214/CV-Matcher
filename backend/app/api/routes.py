"""HTTP endpoints for match scoring and context explorer."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pydantic import BaseModel
from ..services.readers.factory import read_any
from ..domain.models import EvaluationRequest
from ..config.container import build_use_case, build_tool_resonance_use_case, build_tool_adapter
from .schemas import ToolSchema, ToolOptionSchema, ToolContentSchema

router = APIRouter()
# Use a shared adapter instance for the demo tool data.
tool_adapter = build_tool_adapter()


class ResonanceRequest(BaseModel):
    jd_text: str
    match_score: int

@router.post("/match")
async def match(
    cv: UploadFile = File(...),
    jd: UploadFile = File(...),
    provider: str | None = Query(None, description="ChatGPT, Gemini, Claude, or Fusion"),
):
    cv_text = read_any(cv)
    jd_text = read_any(jd)
    if not cv_text.strip():
        raise HTTPException(400, detail="CV appears empty after parsing (scanned PDF?).")
    if not jd_text.strip():
        raise HTTPException(400, detail="Job description appears empty after parsing (scanned PDF?).")

    aliases = {
        "chatgpt": "ChatGPT",
        "openai": "ChatGPT",
        "gemini": "Gemini",
        "claude": "Claude",
        "fusion": "Fusion",
    }
    normalized_provider = aliases.get(provider.lower()) if provider else None

    # Build the evaluator with the chosen provider.
    use_case = build_use_case(provider_override=normalized_provider)
    result = await use_case(EvaluationRequest(cv_text=cv_text, jd_text=jd_text))
    return result.model_dump()


@router.get("/tools", response_model=list[ToolSchema])
async def get_tools():
    """
    List available context tools. Currently returns static/dummy data; replace with live integrations as needed.
    """
    return tool_adapter.list_tools()


@router.get("/tools/{tool_id}/options", response_model=list[ToolOptionSchema])
async def get_tool_options(tool_id: str):
    """
    List options/data slices for a tool. Static demo data; wire to real tools when available.
    """
    opts = tool_adapter.list_options(tool_id)
    if not opts:
        raise HTTPException(404, detail="Tool not found")
    return [{"id": opt["id"], "label": opt["label"], "description": opt.get("content")} for opt in opts]


@router.get("/tools/{tool_id}/options/{option_id}", response_model=ToolContentSchema)
async def get_tool_option_content(tool_id: str, option_id: str):
    """
    Get content for a specific tool option. Returns aiRendered text from demo data.
    """
    content = tool_adapter.get_content(tool_id, option_id)
    if not content:
        raise HTTPException(404, detail="Option not found")
    return {
        "toolId": tool_id,
        "optionId": option_id,
        "label": content["label"],
        "aiRendered": content.get("content"),
        "raw": content,
    }


@router.post("/tools/{tool_id}/options/{option_id}/resonance")
async def resonate_tool_option(
    tool_id: str,
    option_id: str,
    payload: ResonanceRequest,
    provider: str | None = Query(None, description="Provider to use for resonance summary"),
):
    """
    Produce a <=50 word summary relating tool content to the JD and existing match score.
    This does not alter the score; it only generates display text.
    """
    content = tool_adapter.get_content(tool_id, option_id)
    if not content:
        raise HTTPException(404, detail="Option not found")

    aliases = {
        "chatgpt": "ChatGPT",
        "openai": "ChatGPT",
        "gemini": "Gemini",
        "claude": "Claude",
        "fusion": "Fusion",
    }
    normalized_provider = aliases.get(provider.lower()) if provider else None

    use_case = build_tool_resonance_use_case(provider_override=normalized_provider)
    summary = await use_case(
        jd_text=payload.jd_text,
        match_score=payload.match_score,
        tool_label=content["label"],
        content=content.get("content") or "",
    )
    return {
        "toolId": tool_id,
        "optionId": option_id,
        "summary": summary,
    }
