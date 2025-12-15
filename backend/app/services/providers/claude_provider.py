import json, httpx
from ...config.settings import settings

JSON_HEADERS = {"Content-Type": "application/json"}

class ClaudeLlmEvaluator:
    """Anthropic Claude adapter implementing eval_json(system, user) -> dict."""

    async def eval_json(self, system: str, user: str) -> dict:
        payload = {
            "model": settings.anthropic_model,
            "max_tokens": settings.max_tokens,
            "temperature": settings.temperature,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        }

        headers = {
            **JSON_HEADERS,
            "x-api-key": settings.anthropic_api_key or "",
            "anthropic-version": "2023-06-01",
        }

        try:
            async with httpx.AsyncClient(timeout=120) as c:
                r = await c.post(
                    "https://api.anthropic.com/v1/messages",
                    headers=headers,
                    json=payload,
                )
                r.raise_for_status()
                data = r.json()
        except httpx.HTTPStatusError as e:
            raise RuntimeError(
                f"Claude error {e.response.status_code}: {e.response.text}"
            ) from e

        try:
            # Claude returns blocks under content; we expect text in the first one.
            text = data["content"][0].get("text") if data.get("content") else None
            if not text:
                snippet = json.dumps(data)[:500]
                raise RuntimeError(f"Claude returned no text content: {snippet}")
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                cleaned = text.strip()
                if cleaned.startswith("```"):
                    cleaned = cleaned.strip("`").strip()
                    if cleaned.lower().startswith("json"):
                        cleaned = cleaned[4:].strip()
                return json.loads(cleaned)
        except Exception as e:
            if isinstance(e, RuntimeError):
                raise
            raise RuntimeError("Claude returned non-JSON content.") from e
