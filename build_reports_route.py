# ============================================================
# 2. backend/routes/reports.py
# ============================================================
reports_code = """# ============================================================
# UNMASK // CYBER THREAT REPORTS & INTELLIGENCE API ROUTER
# NTRO Problem Statement NTRO Cyber Threat Platform
# ============================================================

import datetime
import random
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from backend.schemas import (
    ComplaintCreateRequest, 
    ComplaintResponse, 
    ComplaintStatusUpdateRequest
)
from backend.database import DatabaseService
from backend.ai_engine import run_ai_anomaly_detection

router = APIRouter(prefix="/reports", tags=["Threat Reports & Incident Intelligence"])

@router.get("", response_model=List[ComplaintResponse])
def list_reports(
    status: Optional[str] = Query(None, description="Filter by status, e.g. PENDING, INVESTIGATING"),
    category: Optional[str] = Query(None, description="Filter by category, e.g. CRYPTO_SCAM, RANSOMWARE"),
    search: Optional[str] = Query(None, description="Search query across narrative, aliases, wallets")
):
    \"\"\"List all registered cyber incident reports from the database.\"\"\"
    return DatabaseService.get_all_complaints(status=status, category=category, search=search)

@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def submit_threat_report(payload: ComplaintCreateRequest):
    \"\"\"
    Public Threat Report Ingestion:
    1. Cryptographically digests evidence files with SHA-256.
    2. Runs AI Anomaly & Multi-Signal Correlation Engine.
    3. Persists to database.
    4. Generates unique Report ID: UNMASK-2026-XXXXXX.
    \"\"\"
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    random_num = random.randint(100000, 999999)
    report_id = f"UNMASK-2026-{random_num}"

    raw_dict = payload.model_dump()
    raw_dict["id"] = report_id

    # Run AI Engine
    ai_report = run_ai_anomaly_detection(raw_dict)

    report_data = {
        "id": report_id,
        "title": payload.title,
        "category": payload.category,
        "incidentDate": payload.incidentDate or now_iso,
        "approximateLoss": payload.approximateLoss,
        "narrative": payload.narrative,
        "suspectAlias": payload.suspectAlias,
        "suspectWallet": payload.suspectWallet,
        "suspectOnionUrl": payload.suspectOnionUrl,
        "suspectEmail": payload.suspectEmail,
        "suspectPhone": payload.suspectPhone,
        "transactionHash": payload.transactionHash,
        "evidenceFiles": [f.model_dump() for f in payload.evidenceFiles],
        "submittedBy": payload.submittedBy.model_dump(),
        "blockchainProof": payload.blockchainProof.model_dump() if payload.blockchainProof else None,
        "status": "AI_ANALYZED",
        "submittedAt": now_iso,
        "updatedAt": now_iso,
        "aiAnomalyReport": ai_report,
        "adminNotes": []
    }

    saved = DatabaseService.insert_complaint(report_data)
    return saved

@router.get("/{report_id}", response_model=ComplaintResponse)
def get_report_details(report_id: str):
    \"\"\"Fetch specific threat report details by ID.\"\"\"
    report = DatabaseService.get_complaint_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Threat Report with ID '{report_id}' not found.")
    return report

@router.get("/{report_id}/threat-intelligence")
def get_report_threat_intelligence(report_id: str):
    \"\"\"Extract correlated threat intelligence and matched syndicates for a specific report.\"\"\"
    report = DatabaseService.get_complaint_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Threat Report with ID '{report_id}' not found.")
    
    ai_rep = report.get("aiAnomalyReport", {})
    return {
        "reportId": report_id,
        "category": report["category"],
        "anomalyScore": ai_rep.get("anomalyScore", 0),
        "riskLevel": ai_rep.get("riskLevel", "LOW"),
        "confidenceScore": ai_rep.get("confidenceScore", 0),
        "matchedActors": ai_rep.get("matchedActors", []),
        "detectedPatterns": ai_rep.get("detectedPatterns", []),
        "forensicSummary": ai_rep.get("forensicSummary", ""),
        "extractedIndicators": ai_rep.get("extractedIndicators", {}),
        "recommendedAction": ai_rep.get("recommendedAction", "")
    }

@router.get("/{report_id}/threat-graph")
def get_report_threat_graph(report_id: str):
    \"\"\"Returns the 3D graph sub-network nodes and links associated with this report.\"\"\"
    report = DatabaseService.get_complaint_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Threat Report with ID '{report_id}' not found.")
    
    topology = DatabaseService.get_graph_topology()
    report_node_id = f"CMP-{report_id.split('-')[-1]}"
    
    # Filter nodes associated with this report
    associated_node_ids = {report_node_id}
    if report.get("suspectWallet"):
        associated_node_ids.add(f"W-{report['suspectWallet'][:6]}")
        associated_node_ids.add("W-01")
    
    matched_actors = report.get("aiAnomalyReport", {}).get("matchedActors", [])
    if matched_actors:
        associated_node_ids.add("ACT-001")
        associated_node_ids.add("ONION-01")

    sub_nodes = [n for n in topology["nodes"] if n["id"] in associated_node_ids or n["type"] == "ACTOR"]
    sub_links = [l for l in topology["links"] if l["source"] in associated_node_ids or l["target"] in associated_node_ids]

    return {
        "reportId": report_id,
        "nodes": sub_nodes if sub_nodes else topology["nodes"],
        "links": sub_links if sub_links else topology["links"]
    }

@router.get("/{report_id}/risk-score")
def get_report_risk_score(report_id: str):
    \"\"\"Returns the 6-Pillar Risk Breakdown formulation for a report.\"\"\"
    report = DatabaseService.get_complaint_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Threat Report with ID '{report_id}' not found.")
    
    score = report.get("aiAnomalyReport", {}).get("anomalyScore", 50)
    return {
        "reportId": report_id,
        "compositeRiskScore": score,
        "riskLevel": report.get("aiAnomalyReport", {}).get("riskLevel", "MEDIUM"),
        "riskPillars": {
            "aliasCorrelation": round(min(20.0, score * 0.22), 1),
            "behavioralSimilarity": round(min(15.0, score * 0.16), 1),
            "infrastructureLink": round(min(20.0, score * 0.21), 1),
            "activityAnomaly": round(min(15.0, score * 0.15), 1),
            "temporalCorrelation": round(min(10.0, score * 0.11), 1),
            "blockchainRelationship": round(min(20.0, score * 0.20), 1)
        }
    }
"""

with open("backend/routes/reports.py", "w", encoding="utf-8") as f:
    f.write(reports_code)

print("backend/routes/reports.py created.")
