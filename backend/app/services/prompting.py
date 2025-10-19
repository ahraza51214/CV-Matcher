# SUPER-SIMPLE ONE-CALL PROMPT

SIMPLE_SYS = (
    "You are an experienced recruiter. "
    "Evaluate how well a candidate CV matches a job description on a 0-100 scale. "
    "Return STRICT JSON only (no prose)."
)

def SIMPLE_USER(cv_text: str, jd_text: str) -> str:
    cv_text = (cv_text or "")[:15000]
    jd_text = (jd_text or "")[:15000]
    return f'''
On a scale from 0 to 100, tell me how good of a match this CV is to the job description.

Return only this JSON object:

{{
  "matchScore": 0,
  "band": "Poor|OK|Good|Strong",
  "pros": ["..."],     // short concrete strengths
  "cons": ["..."],     // short concrete gaps
  "reasoning": "1-2 sentence explanation"
}}

--- JOB DESCRIPTION ---
\"\"\"{jd_text}\"\"\"

--- CV ---
\"\"\"{cv_text}\"\"\"
'''
