import json, httpx
from ...config.settings import settings

JSON_HEADERS = {"Content-Type": "application/json"}

class GeminiLlmEvaluator:
    """Concrete Gemini adapter. Exposes eval_json(system, user) -> dict."""

    async def eval_json(self, system: str, user: str) -> dict:
        # Keep model simple & configurable (e.g., "gemini-1.5-pro" or "gemini-1.5-flash")
        model = settings.gemini_chat_model
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.google_api_key}"

        # Let Gemini return JSON directly (no prose) via responseMimeType
        payload = {
            "systemInstruction": {  # Gemini supports a dedicated system field
                "role": "system",
                "parts": [{"text": system}]
            },
            "contents": [
                {"role": "user", "parts": [{"text": user}]}
            ],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": settings.temperature,
                "maxOutputTokens": settings.max_tokens,
                "responseMimeType": "application/json",
            },
        }

        try:
            async with httpx.AsyncClient(timeout=120) as c:
                r = await c.post(url, headers=JSON_HEADERS, json=payload)
                r.raise_for_status()
                data = r.json()

            # If Gemini blocked the prompt, surface a helpful error
            pf = data.get("promptFeedback") or data.get("prompt_feedback")
            if isinstance(pf, dict):
                block_reason = pf.get("blockReason") or pf.get("block_reason")
                if block_reason:
                    raise RuntimeError(f"Gemini blocked the prompt: {block_reason}")

            # Happy path: JSON string in first candidate/part
            try:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError, TypeError):
                snippet = json.dumps(data)[:500]
                raise RuntimeError(f"Gemini returned no text parts: {snippet}")

            # Parse JSON; also tolerate accidental code fences
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                cleaned = text.strip()
                if cleaned.startswith("```"):
                    cleaned = cleaned.strip("`").strip()
                    if cleaned.lower().startswith("json"):
                        cleaned = cleaned[4:].strip()
                return json.loads(cleaned)

        except httpx.HTTPStatusError as e:
            raise RuntimeError(
                f"Gemini error {e.response.status_code}: {e.response.text}"
            ) from e
        except json.JSONDecodeError as e:
            raise RuntimeError("Gemini returned non-JSON content.") from e
