# Prompts dedicated to the Context Explorer tool flow.
# These stay separate from job-matching prompts to keep concerns isolated.

CONTEXT_SYS = (
    "You summarize external tool data for recruiters. "
    "Extract only the most relevant facts that help evaluate a CV against a job description. "
    "Keep it concise and factual. Return JSON only: {\"summary\": \"...\"}."
)

def context_user(tool_label: str, content: str) -> str:
    """
    Build a user prompt for summarizing a tool option's content.
    This summary can later be merged into the job-matching flow as auxiliary context.
    """
    return f"""
Summarize the following context from the tool "{tool_label}" into 3-5 bullet points.
Focus on signals useful for judging CV fit. Answer in Danish. Return only JSON with a 'summary' field.

--- TOOL CONTEXT ---
\"\"\"{content or ''}\"\"\"
"""
