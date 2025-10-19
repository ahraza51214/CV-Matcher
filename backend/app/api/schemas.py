from pydantic import BaseModel
from typing import List, Optional

class Explanations(BaseModel):
    reasoning: Optional[str] = None
    mustHaveCoverage: Optional[float] = None
    niceToHaveCoverage: Optional[float] = None
    overallFit: Optional[float] = None
    embeddingsSim: Optional[float] = None  # may be unused in single-call flow

class MatchResponse(BaseModel):
    matchScore: int
    band: str
    pros: List[str]
    cons: List[str]
    missingSkills: List[str]
    explanations: Explanations
