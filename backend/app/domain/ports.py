# backend/app/domain/ports.py
from typing import Protocol, List

class LlmEvaluatorPort(Protocol):
    """
    Narrow interface (ISP) for any LLM provider (OpenAI, Gemini, etc.).
    The use-case only needs a JSON evaluation call with system+user prompts.
    """
    async def eval_json(self, system: str, user: str) -> dict: ...

class EmbeddingsPort(Protocol):
    """
    Optional: if/when you add vector features.
    Providers implementing this should return one embedding vector per input text.
    """
    async def embed(self, texts: List[str]) -> List[List[float]]: ...
