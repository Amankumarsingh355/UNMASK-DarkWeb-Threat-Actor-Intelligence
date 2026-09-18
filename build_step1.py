import os

print("Writing backend files...")

# ==========================================
# 1. backend/schemas.py
# ==========================================
schemas_code = """# ============================================================
# UNMASK AI // FASTAPI PYDANTIC SCHEMAS
# NTRO Problem Statement NTRO Cyber Threat Platform - Dark Web Intelligence Triage
# ============================================================

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field

ComplaintCategory = Literal[
    'CRYPTO_SCAM',
    'RANSOMWARE',
    'DARK_WEB_LEAK',
    'PHISHING',
    'MARKETPLACE_FRAUD',
    'IDENTITY_THEFT',
    'TELEGRAM_EXTORTION',
    'OTHER'
]

ComplaintStatus = Literal[
    'PENDING',
    'AI_ANALYZED',
    'INVESTIGATING',
    'ESCALATED_CYBER_CELL',
    'RESOLVED',
    'DISMISSED'
]

RiskLevel = Literal['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

class CitizenAuthUserSchema(BaseModel):
    provider: Literal['GOOGLE', 'METAMASK']
    identifier: str
    displayName: Optional[str] = None
    avatarUrl: Optional[str] = None
    walletAddress: Optional[str] = None
    networkName: Optional[str] = None
    chainId: Optional[int] = None
    balance: Optional[str] = None
    authToken: Optional[str] = None
    connectedAt: str

class EvidenceAttachmentSchema(BaseModel):
    id: str
    name: str
    type: str
    size: int
    dataUrl: Optional[str] = None
    previewUrl: Optional[str] = None
    sha256Hash: str

class BlockchainProofSchema(BaseModel):
    txHash: str
    blockNumber: int
    evidenceHash: str
    signerAddress: str
    signature: str
    network: str
    gasUsed: str
    timestamp: str
    contractAddress: Optional[str] = None

class MatchedThreatActorSchema(BaseModel):
    actorName: str
    threatLevel: RiskLevel
    confidence: float
    matchedIndicators: List[str]
    riskScore: float

class ExtractedIndicatorsSchema(BaseModel):
    wallets: List[str] = []
    onionUrls: List[str] = []
    emails: List[str] = []
    transactionHashes: List[str] = []
    aliases: List[str] = []

class AIAnomalyReportSchema(BaseModel):
    anomalyScore: float
    riskLevel: RiskLevel
    confidenceScore: float
    matchedActors: List[MatchedThreatActorSchema] = []
    detectedPatterns: List[str] = []
    forensicSummary: str
    recommendedAction: str
    extractedIndicators: ExtractedIndicatorsSchema
    analyzedAt: str
    engineVersion: str

class AdminResolutionNoteSchema(BaseModel):
    id: str
    adminName: str
    note: str
    statusChangedTo: Optional[ComplaintStatus] = None
    timestamp: str

class ComplaintCreateRequest(BaseModel):
    title: str = Field(..., example="DeFi Liquidity Pool Drainer Scam")
    category: ComplaintCategory = Field(..., example="CRYPTO_SCAM")
    incidentDate: Optional[str] = Field(None, example="2026-09-02T14:30:00Z")
    approximateLoss: Optional[str] = Field(None, example="4.85 ETH (₹ 11,20,000)")
    narrative: str = Field(..., example="Connected wallet to fake staking dApp...")
    suspectAlias: Optional[str] = Field(None, example="shadow_drainer")
    suspectWallet: Optional[str] = Field(None, example="0x7a9f6d3b9e1c2a4f8812c98d5e3f1a2b4c5d6e7f")
    suspectOnionUrl: Optional[str] = Field(None, example="darksurvey77x.onion")
    suspectEmail: Optional[str] = Field(None, example="shadow77_support@proton.me")
    suspectPhone: Optional[str] = Field(None, example="+91 98765 43210")
    transactionHash: Optional[str] = Field(None, example="0x8f4c3b2a1e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b")
    evidenceFiles: List[EvidenceAttachmentSchema] = []
    submittedBy: CitizenAuthUserSchema
    blockchainProof: Optional[BlockchainProofSchema] = None

class ComplaintStatusUpdateRequest(BaseModel):
    status: ComplaintStatus
    adminName: Optional[str] = "ANALYST_K.RAMAN"
    note: Optional[str] = None

class ComplaintResponse(BaseModel):
    id: str
    title: str
    category: ComplaintCategory
    incidentDate: str
    approximateLoss: Optional[str] = None
    narrative: str
    suspectAlias: Optional[str] = None
    suspectWallet: Optional[str] = None
    suspectOnionUrl: Optional[str] = None
    suspectEmail: Optional[str] = None
    suspectPhone: Optional[str] = None
    transactionHash: Optional[str] = None
    evidenceFiles: List[EvidenceAttachmentSchema] = []
    submittedBy: CitizenAuthUserSchema
    blockchainProof: Optional[BlockchainProofSchema] = None
    status: ComplaintStatus
    submittedAt: str
    updatedAt: str
    aiAnomalyReport: AIAnomalyReportSchema
    adminNotes: List[AdminResolutionNoteSchema] = []

class CorrelationRequest(BaseModel):
    queryText: Optional[str] = None
    walletAddress: Optional[str] = None
    onionUrl: Optional[str] = None
    alias: Optional[str] = None
    email: Optional[str] = None

class CorrelationResponse(BaseModel):
    corroborationScore: float
    confidenceLevel: str
    riskScore: float
    riskLevel: RiskLevel
    riskPillars: Dict[str, float]
    matchedActors: List[MatchedThreatActorSchema]
    detectedPatterns: List[str]
    forensicBreakdown: str
    graphRecommendations: List[str]

class StylometricRequest(BaseModel):
    text: str = Field(..., example="escrow_locked instant_drop for verified buyers only. Contact via PGP.")
    candidateAliases: Optional[List[str]] = None

class StylometricResponse(BaseModel):
    analyzedTextSnippet: str
    tokenCount: int
    vocabularyRichnessScore: float
    avgSentenceLength: float
    punctuationEntropy: float
    cryptoSlangDensity: float
    matchedProfiles: List[Dict[str, Any]]
    confidence: float
    attributionVerdict: str
"""

with open("backend/schemas.py", "w", encoding="utf-8") as f:
    f.write(schemas_code)

print("backend/schemas.py written.")
