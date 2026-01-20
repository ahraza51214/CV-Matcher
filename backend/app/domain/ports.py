"""Ports (interfaces) for external providers and tools."""
from typing import Protocol, List, Optional, Dict, Any


class LlmEvaluatorPort(Protocol):
    """
    Narrow interface (ISP) for any LLM provider (OpenAI, Gemini, Claude, etc.).
    The evaluator returns JSON given system+user prompts.
    """
    async def eval_json(self, system: str, user: str) -> dict: ...


class EmbeddingsPort(Protocol):
    """
    Optional embeddings interface for future vector features.
    Implementations return one embedding vector per input text.
    """
    async def embed(self, texts: List[str]) -> List[List[float]]: ...


class ToolPort(Protocol):
    """
    Abstraction for context tools (e.g., Notion, ATS).
    Keeps SRP: list tools, list options, fetch content.
    """
    def list_tools(self) -> List[Dict[str, Any]]: ...
    def list_options(self, tool_id: str) -> List[Dict[str, Any]]: ...
    def get_content(self, tool_id: str, option_id: str) -> Optional[Dict[str, Any]]: ...
