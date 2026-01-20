"""Dependency container: chooses concrete evaluator implementations based on settings."""
from .settings import settings
from ..services.providers.openai_provider import OpenAILlmEvaluator
from ..services.providers.gemini_provider import GeminiLlmEvaluator
from ..services.providers.claude_provider import ClaudeLlmEvaluator
from ..services.providers.fusion_provider import FusionLlmEvaluator
from ..services.evaluator.evaluate_match import EvaluateMatchUseCase
from ..services.evaluator.evaluate_tool_context import EvaluateToolContextUseCase
from ..services.evaluator.evaluate_tool_resonance import EvaluateToolResonanceUseCase
from ..services.tools import DummyToolAdapter

def build_use_case(provider_override: str | None = None) -> EvaluateMatchUseCase:
    """Select concrete provider based on request or .env."""
    provider = (provider_override or settings.provider).lower()
    evaluator = _select_evaluator(provider)
    return EvaluateMatchUseCase(evaluator=evaluator, provider=provider)

def build_tool_context_use_case(provider_override: str | None = None) -> EvaluateToolContextUseCase:
    """Factory for summarizing tool context via LLM; defaults to env provider."""
    provider = (provider_override or settings.provider).lower()
    evaluator = _select_evaluator(provider)
    return EvaluateToolContextUseCase(evaluator=evaluator)

def build_tool_resonance_use_case(provider_override: str | None = None) -> EvaluateToolResonanceUseCase:
    """Factory for resonating tool context with JD+score without changing the score."""
    provider = (provider_override or settings.provider).lower()
    evaluator = _select_evaluator(provider)
    return EvaluateToolResonanceUseCase(evaluator=evaluator)


def build_tool_adapter():
    """Factory for the tool adapter; currently returns the demo adapter."""
    return DummyToolAdapter()


def _select_evaluator(provider: str):
    """Shared evaluator selector to avoid duplicating provider wiring."""
    if provider in ("chatgpt", "openai"):
        return OpenAILlmEvaluator()
    if provider == "gemini":
        return GeminiLlmEvaluator()
    if provider == "claude":
        return ClaudeLlmEvaluator()
    if provider == "fusion":
        # Query all, then let the judge reconcile.
        return FusionLlmEvaluator(
            evaluators=[
                ("ChatGPT", OpenAILlmEvaluator()),
                ("Gemini", GeminiLlmEvaluator()),
                ("Claude", ClaudeLlmEvaluator()),
            ]
        )
    # default fallback
    return OpenAILlmEvaluator()
