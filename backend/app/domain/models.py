"""Domain models for evaluation requests/results."""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class EvaluationRequest(BaseModel):
    cv_text: str = Field(..., description="Plain text extracted from CV")
    jd_text: str = Field(..., description="Plain text extracted from Job Description")

class EvaluationResult(BaseModel):
    matchScore: int
    band: str
    pros: List[str]
    cons: List[str]
    reasoning: Optional[str] = None
    # keep a flexible bag for future metadata, without breaking clients
    meta: Dict[str, float] = {}  
