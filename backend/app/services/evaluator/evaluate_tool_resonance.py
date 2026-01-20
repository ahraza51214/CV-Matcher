"""
Use-case: relate tool context to an existing match score + job description, without changing the score.
Returns a short (<=50 words) summary suitable for the context results card.
"""
from ...domain.ports import LlmEvaluatorPort
from ...services.prompts.contextExplorerTool.resonance_prompt import RESONANCE_SYS, resonance_user


class EvaluateToolResonanceUseCase:
    """Builds a resonance prompt and calls the LLM; does not modify scoring."""

    def __init__(self, evaluator: LlmEvaluatorPort):
        self._evaluator = evaluator

    async def __call__(self, jd_text: str, match_score: int, tool_label: str, content: str) -> str:
        # Ask the LLM to produce a concise resonance summary (no score changes).
        data = await self._evaluator.eval_json(
            system=RESONANCE_SYS,
            user=resonance_user(jd_text, match_score, tool_label, content),
        )
        # Accept either plain text or a JSON dict with 'summary'.
        if isinstance(data, dict) and "summary" in data:
            return str(data["summary"])
        if isinstance(data, str):
            return data
        return str(data)
