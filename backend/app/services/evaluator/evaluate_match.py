from ...domain.models import EvaluationRequest, EvaluationResult
from ...domain.ports import LlmEvaluatorPort
from ...services.prompts.fallback_eval import SIMPLE_SYS, simple_user
from ...services.prompts.chatgpt_eval import CHATGPT_SYS, chatgpt_user
from ...services.prompts.gemini_eval import GEMINI_SYS, gemini_user
from ...services.prompts.claude_eval import CLAUDE_SYS, claude_user

class EvaluateMatchUseCase:
    """
    Application service (use-case) that:
    - builds prompts,
    - calls the LLM evaluator,
    - maps provider JSON to our domain model.
    SRP: no HTTP, no provider details here.
    """

    def __init__(self, evaluator: LlmEvaluatorPort, provider: str = "chatgpt"):
        self._evaluator = evaluator
        self._provider = (provider or "chatgpt").lower()

    async def __call__(self, req: EvaluationRequest) -> EvaluationResult:
        system, user_fn = self._prompt_for_provider()
        data = await self._evaluator.eval_json(
            system=system,
            user=user_fn(req.cv_text, req.jd_text),
        )
        # trust-but-verify mapping; be tolerant to missing fields
        return EvaluationResult(
            matchScore = self._safe_int(data.get("matchScore"), default=0),
            band       = str(data.get("band", "Poor")),
            pros       = list(data.get("pros", []) or []),
            cons       = list(data.get("cons", []) or []),
            reasoning  = data.get("reasoning"),
            meta       = {},  # place for future numeric breakdown
        )

    @staticmethod
    def _safe_int(value, default: int = 0) -> int:
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return default

    def _prompt_for_provider(self):
        if self._provider in ("chatgpt", "openai"):
            return CHATGPT_SYS, chatgpt_user
        if self._provider == "gemini":
            return GEMINI_SYS, gemini_user
        if self._provider == "claude":
            return CLAUDE_SYS, claude_user
        # Fusion/unknown defaults to simple ChatGPT-style prompt
        return SIMPLE_SYS, simple_user
