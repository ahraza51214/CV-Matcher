import json, httpx
from ...config.settings import settings
# NOTE: we rely on structural typing for the port; no need to inherit from a Protocol.

JSON_HEADERS = {"Content-Type": "application/json"}

class OpenAILlmEvaluator:
    """Concrete ChatGPT (OpenAI) adapter. Exposes eval_json(system, user) -> dict."""

    async def eval_json(self, system: str, user: str) -> dict:
        if not settings.openai_api_key:
            raise RuntimeError("OpenAI API key is not configured. Set OPENAI_API_KEY or openai_api_key in .env.")
        try:
            async with httpx.AsyncClient(timeout=120) as c:
                r = await c.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        **JSON_HEADERS,
                        "Authorization": f"Bearer {settings.openai_api_key}",
                    },
                    json={
                        "model": settings.chat_model,                 # e.g., gpt-4o-mini
                        "response_format": {"type": "json_object"},  # force JSON mode
                        "max_tokens": settings.max_tokens,           # from .env (default 500)
                        "temperature": settings.temperature,         # from .env (default 0.4)
                        "seed": settings.seed,                       # from .env (default 7)
                        "messages": [
                            {"role": "system", "content": system},
                            {"role": "user",   "content": user},
                        ],
                    },
                )
                r.raise_for_status()
                content = r.json()["choices"][0]["message"]["content"]
                return json.loads(content)
        except httpx.HTTPStatusError as e:
            # Surface provider message to caller
            raise RuntimeError(
                f"ChatGPT (OpenAI) error {e.response.status_code}: {e.response.text}"
            ) from e
        except json.JSONDecodeError as e:
            raise RuntimeError("ChatGPT (OpenAI) returned non-JSON content.") from e
