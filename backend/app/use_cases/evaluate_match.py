"""Use-case: evaluate a CV vs JD with a chosen LLM evaluator."""
from ..domain.models import EvaluationRequest, EvaluationResult
from ..domain.ports import LlmEvaluatorPort
from ..services.prompts.simple_eval import SIMPLE_SYS, simple_user

class EvaluateMatchUseCase:
    """
    Application service (use-case) that:
    - builds prompts,
    - calls the LLM evaluator,
    - maps provider JSON to our domain model.
    SRP: no HTTP, no provider details here.
    """

    def __init__(self, evaluator: LlmEvaluatorPort):
        self._evaluator = evaluator

    async def __call__(self, req: EvaluationRequest) -> EvaluationResult:
        data = await self._evaluator.eval_json(
            system=SIMPLE_SYS,
            user=simple_user(req.cv_text, req.jd_text),
        )
        # trust-but-verify mapping; be tolerant to missing fields
        return EvaluationResult(
            matchScore = int(data.get("matchScore", 0)),
            band       = str(data.get("band", "Poor")),
            pros       = list(data.get("pros", []) or []),
            cons       = list(data.get("cons", []) or []),
            reasoning  = data.get("reasoning"),
            meta       = {},  # place for future numeric breakdown
        )
