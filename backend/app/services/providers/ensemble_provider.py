import asyncio
from typing import Sequence, Tuple
from ...config.settings import settings
from ..prompts.ensemble_eval import ENSEMBLE_SYS, ensemble_user
from .openai_provider import OpenAILlmEvaluator
from .gemini_provider import GeminiLlmEvaluator
from .claude_provider import ClaudeLlmEvaluator

ProviderWithName = Tuple[str, object]

class EnsembleLlmEvaluator:
    """
    Meta evaluator: queries multiple providers, then asks a judge model
    to reconcile their JSON outputs into a single decision.
    """

    def __init__(self, evaluators: Sequence[ProviderWithName]):
        self._evaluators = list(evaluators)

    async def eval_json(self, system: str, user: str) -> dict:
        async def run(name: str, evaluator) -> tuple[str, dict]:
            try:
                result = await evaluator.eval_json(system, user)
                return name, result
            except Exception as e:
                return name, {"error": str(e)}

        pairs = await asyncio.gather(*(run(name, ev) for name, ev in self._evaluators))
        votes = {name: data for name, data in pairs}

        judge = self._judge_evaluator()
        judge_user = ensemble_user(user, votes)
        return await judge.eval_json(ENSEMBLE_SYS, judge_user)

    def _judge_evaluator(self):
        judge = (settings.ensemble_judge_provider or "OpenAI").lower()
        if judge == "gemini":
            return GeminiLlmEvaluator()
        if judge == "claude":
            return ClaudeLlmEvaluator()
        # default
        return OpenAILlmEvaluator()
