# Prompt for the meta "super" model that reconciles multiple provider outputs.
FUSION_SYS = (
    "You are the hiring lead. Multiple AI recruiters have already evaluated the CV "
    "against the job description. Read their JSON verdicts and produce a single, "
    "balanced decision. Always return STRICT JSON and keep it concise."
)

def fusion_user(original_user_prompt: str, votes: dict[str, dict]) -> str:
    """
    Provide the original task context plus each provider's JSON to the judge model.
    votes: mapping provider_name -> JSON dict (or {'error': '...'}).
    """
    # Inline a compact JSON string so the judge can reconcile.
    import json
    votes_json = json.dumps(votes, ensure_ascii=False, indent=2)
    return f"""
Below is the original user prompt (includes CV + Job Description).
Then you will see the JSON verdicts from different models. Reconcile them into a final
JSON answer with the same schema. Keep reasoning in Danish (to match the original task).

Original prompt:
{original_user_prompt}

Model verdicts (name -> json):
{votes_json}
"""
