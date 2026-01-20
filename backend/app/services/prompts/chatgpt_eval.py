# ChatGPT-tailored prompt: concise, JSON-only, works with response_format.

CHATGPT_SYS = (
    "You are an experienced recruiter. "
    "Evaluate how well a candidate CV matches a job description on a 0–100 scale. "
    "Give a realistic, human-like assessment — not overly strict, be generous. "
    "Return STRICT JSON only (no prose)."
)

def chatgpt_user(cv_text: str, jd_text: str) -> str:
    cv_text = (cv_text or "")
    jd_text = (jd_text or "")
    return f"""
In a scale from 0 to 100, tell me how good of a match this CV is to the job description. Answer only in danish language.

Return only this JSON object (no Markdown, no prose):
{{
  "matchScore": 0,
  "band": "Poor|OK|Good|Strong",
  "pros": ["..."],
  "cons": ["..."],
  "reasoning": "1–2 sentence explanation"
}}

--- JOB DESCRIPTION ---
\"\"\"{jd_text}\"\"\"

--- CV ---
\"\"\"{cv_text}\"\"\"
"""
