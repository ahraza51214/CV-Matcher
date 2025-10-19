import json, httpx, numpy as np
from typing import List
from ..config.settings import settings

JSON_HEADERS = {"Content-Type": "application/json"}

def _cosine(a, b):
    a, b = np.array(a, dtype=np.float32), np.array(b, dtype=np.float32)
    na, nb = np.linalg.norm(a), np.linalg.norm(b)
    return 0.0 if na == 0 or nb == 0 else float(a @ b / (na * nb))

async def _embed(texts: List[str]) -> List[List[float]]:
    try:
        async with httpx.AsyncClient(timeout=60) as c:
            r = await c.post(
                "https://api.openai.com/v1/embeddings",
                headers={**JSON_HEADERS, "Authorization": f"Bearer {settings.openai_api_key}"},
                json={"model": settings.embeddings_model, "input": texts},
            )
            r.raise_for_status()
            return [d["embedding"] for d in r.json()["data"]]
    except httpx.HTTPStatusError as e:
        # include provider message for debugging
        body = e.response.text
        raise RuntimeError(f"Embeddings API error {e.response.status_code}: {body}") from e

async def embed_pair_cosine(a: str, b: str) -> float:
    v1, v2 = await _embed([a, b])
    return _cosine(v1, v2)

async def chat_json(system: str, user: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=120) as c:
            r = await c.post(
                "https://api.openai.com/v1/chat/completions",
                headers={**JSON_HEADERS, "Authorization": f"Bearer {settings.openai_api_key}"},
                json={
                    "model": settings.chat_model,
                    "response_format": {"type": "json_object"},
                    # ⬇️ added for consistency & cost control
                    "max_tokens": 500,     # cap output size (enough for our JSON)
                    "temperature": 0.4,    # a touch of nuance (0.2 if you want stricter)
                    "seed": 7,             # improves repeatability for same inputs
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user}
                    ]
                }
            )
            r.raise_for_status()
            return json.loads(r.json()["choices"][0]["message"]["content"])
    except httpx.HTTPStatusError as e:
        body = e.response.text
        raise RuntimeError(f"Chat API error {e.response.status_code}: {body}") from e
    except json.JSONDecodeError as e:
        # if model didn't return valid JSON, surface content for diagnosis
        raise RuntimeError("Chat API returned non-JSON content (check prompts/response_format).") from e
