# Claude-tailored prompt: calibrated to be slightly generous and align with ChatGPT scores.

CLAUDE_SYS = (
    "You are an experienced recruiter. "
    "Evaluate how well a candidate CV matches a job description on a 0–100 scale. "
    "Be realistic and slightly generous: solid overlap in responsibilities should land around 70–85. "
    "Return STRICT JSON only (no prose)."
)

def claude_user(cv_text: str, jd_text: str) -> str:
    cv_text = (cv_text or "")
    jd_text = (jd_text or "")
    return f"""
In a scale from 0 to 100, tell me how good of a match this CV is to the job description. Answer only in danish language.
Calibrate generously using this rubric:
- Start from 75 when the CV covers most key duties and skills in the JD.
- Subtract ~10 for each major responsibility missing; subtract ~5 for each notable skill/tool gap.
- Only go below 60 if the role is clearly mismatched; only go above 90 if it is an exceptional, near-perfect fit.
- Align the band with the score (Poor <60, OK 60–69, Good 70–84, Strong 85+).

Return ONLY JSON (no Markdown, no prose). JSON schema:
{{
  "matchScore": 0,
  "band": "Poor|OK|Good|Strong",
  "pros": ["..."],
  "cons": ["..."],
  "reasoning": "1–2 sentence explanation"
}}
Do not add any explanation or text outside the JSON object.

--- JOB DESCRIPTION ---
\"\"\"{jd_text}\"\"\"

--- CV ---
\"\"\"{cv_text}\"\"\"
"""
