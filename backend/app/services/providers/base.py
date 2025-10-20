from typing import Protocol
from ...domain.models import EvaluationRequest, EvaluationResult

class LlmEvaluator(Protocol):
    """Narrow interface (ISP): only what the use-case needs."""
    async def eval_json(self, system: str, user: str) -> dict: ...
