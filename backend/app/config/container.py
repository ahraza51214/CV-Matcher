from .settings import settings
from ..services.providers.openai_provider import OpenAILlmEvaluator
from ..services.providers.gemini_provider import GeminiLlmEvaluator
from ..services.providers.claude_provider import ClaudeLlmEvaluator
from ..services.providers.fusion_provider import FusionLlmEvaluator
from ..use_cases.evaluate_match import EvaluateMatchUseCase

def build_use_case() -> EvaluateMatchUseCase:
    """Select concrete provider based on .env (DIP)."""
    provider = settings.provider.lower()

    if provider == "gemini":
        evaluator = GeminiLlmEvaluator()
    elif provider == "claude":
        evaluator = ClaudeLlmEvaluator()
    elif provider == "fusion":
        # Query all, then let the judge reconcile.
        evaluator = FusionLlmEvaluator(
            evaluators=[
                ("OpenAI", OpenAILlmEvaluator()),
                ("Gemini", GeminiLlmEvaluator()),
                ("Claude", ClaudeLlmEvaluator()),
            ]
        )
    else:
        evaluator = OpenAILlmEvaluator()
    return EvaluateMatchUseCase(evaluator=evaluator)
