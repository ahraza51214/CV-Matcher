from .settings import settings
from ..services.providers.openai_provider import OpenAILlmEvaluator
from ..services.providers.gemini_provider import GeminiLlmEvaluator
from ..use_cases.evaluate_match import EvaluateMatchUseCase

def build_use_case() -> EvaluateMatchUseCase:
    """Select concrete provider based on .env (DIP)."""
    if settings.provider.lower() == "gemini":
        evaluator = GeminiLlmEvaluator()
    else:
        evaluator = OpenAILlmEvaluator()
    return EvaluateMatchUseCase(evaluator=evaluator)
