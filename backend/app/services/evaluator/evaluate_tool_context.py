"""
Use-case: summarize tool-provided context (e.g., selected option content) for downstream use.
This keeps tool prompting separate from job-matching prompts.
"""
from ...domain.ports import LlmEvaluatorPort
from ...services.prompts.contextExplorerTool.context_prompt import CONTEXT_SYS, context_user


class EvaluateToolContextUseCase:
    """
    Summarize a tool option's content into concise recruiter-friendly bullet points.
    SRP: no HTTP concerns; only prompt building and LLM call.
    """

    def __init__(self, evaluator: LlmEvaluatorPort):
        self._evaluator = evaluator

    async def __call__(self, tool_label: str, content: str) -> str:
        # Build the summarization prompt specific to context explorer tools.
        data = await self._evaluator.eval_json(
            system=CONTEXT_SYS,
            user=context_user(tool_label, content),
        )
        # Expect either direct text or a JSON with 'summary'; tolerate both.
        if isinstance(data, dict) and "summary" in data:
            return str(data["summary"])
        if isinstance(data, str):
            return data
        # Last resort: coerce to string for robustness.
        return str(data)
