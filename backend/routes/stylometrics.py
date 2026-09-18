# ============================================================
# STYLOMETRIC NLP ATTRIBUTION API ROUTER
# NTRO Cyber Threat Intelligence Platform
# ============================================================

from fastapi import APIRouter
from backend.schemas import StylometricRequest, StylometricResponse
from backend.stylometric_engine import analyze_stylometrics

router = APIRouter(prefix="/stylometrics", tags=["Stylometric NLP Authorship Attribution"])

@router.post("/analyze", response_model=StylometricResponse)
def analyze_text(payload: StylometricRequest):
    """
    Analyzes dark web messages, ransom notes, and suspect communications
    to attribute authorship signatures to known threat actors.
    """
    res = analyze_stylometrics(payload.text, candidate_aliases=payload.candidateAliases)
    return StylometricResponse(**res)
