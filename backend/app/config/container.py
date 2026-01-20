"""Dependency container: chooses concrete evaluator implementations based on settings."""
from .settings import settings
from ..services.providers.openai_provider import OpenAILlmEvaluator
from ..services.providers.gemini_provider import GeminiLlmEvaluator
from ..services.providers.claude_provider import ClaudeLlmEvaluator
from ..services.providers.fusion_provider import FusionLlmEvaluator
from ..services.evaluator.evaluate_match import EvaluateMatchUseCase

def build_use_case(provider_override: str | None = None) -> EvaluateMatchUseCase:
    """Select concrete provider based on request or .env."""
    provider = (provider_override or settings.provider).lower()

    if provider in ("chatgpt", "openai"):
        evaluator = OpenAILlmEvaluator()
    elif provider == "gemini":
        evaluator = GeminiLlmEvaluator()
    elif provider == "claude":
        evaluator = ClaudeLlmEvaluator()
    elif provider == "fusion":
        # Query all, then let the judge reconcile.
        evaluator = FusionLlmEvaluator(
            evaluators=[
                ("ChatGPT", OpenAILlmEvaluator()),
                ("Gemini", GeminiLlmEvaluator()),
                ("Claude", ClaudeLlmEvaluator()),
            ]
        )
    else:
        evaluator = OpenAILlmEvaluator()
    return EvaluateMatchUseCase(evaluator=evaluator, provider=provider)
