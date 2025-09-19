from pydantic import BaseModel
from typing import List, Dict, Optional

class Issue(BaseModel):
    severity: str
    message: str
    suggestion: str

class CodeReviewRequest(BaseModel):
    code: str

class CodeReviewResponse(BaseModel):
    language: str
    score: int
    summary: Optional[str] = None 
    issues: List[Issue]
    
