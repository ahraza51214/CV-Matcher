# Prompt for resonating tool content with JD and an existing match score.
# Does NOT alter the match score—only produces a short summary to display.

RESONANCE_SYS = (
    "You are a recruiter assistant. "
    "You will be given: (1) job description text, (2) a match score already computed, "
    "and (3) external tool context. "
    "Do not change the score. Summarize how the tool context relates to the job and the score "
    "in at most 50 words. Keep it neutral and concise. "
    "Return JSON only: {\"summary\": \"...\"}."
)

def resonance_user(jd_text: str, match_score: int, tool_label: str, content: str) -> str:
    """
    Build a user prompt that asks the model to relate tool context data to the JD and existing score.
    This keeps evaluation separate from scoring.
    """
    return f"""
Summarize in <=50 words how the tool context relates to the job description and this score. Use real tool name and option. Do not use tool context word.
Write in Danish. Be concise and neutral. Return only JSON with a 'summary' field.

--- JOB DESCRIPTION ---
\"\"\"{jd_text or ''}\"\"\"

--- TOOL CONTEXT ({tool_label}) ---
\"\"\"{content or ''}\"\"\"
"""
