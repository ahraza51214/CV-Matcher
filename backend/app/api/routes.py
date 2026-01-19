"""HTTP endpoints for match scoring and context explorer."""
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from ..services.readers.factory import read_any
from ..domain.models import EvaluationRequest
from ..config.container import build_use_case
from ..config.settings import settings
from .schemas import ToolSchema, ToolOptionSchema, ToolContentSchema
from ..services.context.data import list_tools, list_options, get_content

router = APIRouter()

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

    # Temporarily switch provider if query param is present
    original = settings.provider
    if provider:
        aliases = {
            "chatgpt": "ChatGPT",
            "openai": "ChatGPT",
            "gemini": "Gemini",
            "claude": "Claude",
            "fusion": "Fusion",
        }
        normalized = aliases.get(provider.lower())
        if normalized:
            settings.provider = normalized  # override for this request only

    try:
        use_case = build_use_case()
        result = await use_case(EvaluationRequest(cv_text=cv_text, jd_text=jd_text))
        return result.model_dump()
    finally:
        settings.provider = original  # restore


@router.get("/tools", response_model=list[ToolSchema])
async def get_tools():
    """
    List available context tools. Currently returns static/dummy data; replace with live integrations as needed.
    """
    return list_tools()


@router.get("/tools/{tool_id}/options", response_model=list[ToolOptionSchema])
async def get_tool_options(tool_id: str):
    """
    List options/data slices for a tool. Static demo data; wire to real tools when available.
    """
    opts = list_options(tool_id)
    if not opts:
        raise HTTPException(404, detail="Tool not found")
    return [{"id": opt["id"], "label": opt["label"], "description": opt.get("content")} for opt in opts]


@router.get("/tools/{tool_id}/options/{option_id}", response_model=ToolContentSchema)
async def get_tool_option_content(tool_id: str, option_id: str):
    """
    Get content for a specific tool option. Returns aiRendered text from demo data.
    """
    content = get_content(tool_id, option_id)
    if not content:
        raise HTTPException(404, detail="Option not found")
    return {
        "toolId": tool_id,
        "optionId": option_id,
        "label": content["label"],
        "aiRendered": content.get("content"),
        "raw": content,
    }
