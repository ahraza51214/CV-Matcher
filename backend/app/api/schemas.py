from pydantic import BaseModel
from typing import List, Dict


'''Purpose: Define what data the API sends back (and could validate incoming data too).'''
class MatchResponse(BaseModel):
    matchScore: int
    band: str
    pros: List[str]
    cons: List[str]
    missingSkills: List[str]
    explanations: Dict[str, float]
