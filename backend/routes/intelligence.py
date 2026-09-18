# ============================================================
# INTELLIGENCE & SCALABLE THREAT GRAPH API ROUTER
# Real Dataset Ingestion, Paginated Graph & On-Demand Neighborhood Loading
# ============================================================

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from backend.dataset_loader import dataset_loader
from backend.database import DatabaseService
from backend.schemas import CorrelationRequest, CorrelationResponse, MatchedThreatActorSchema
from backend.ai_engine import run_ai_anomaly_detection

router = APIRouter(prefix="/intelligence", tags=["Dark Web Intelligence & Graph"])

@router.get("/dataset/stats")
def get_dataset_stats():
    """
    Returns live dataset source indicators:
    Accounts, Posts, Forums, Wallets, Transactions, and derived Relationships.
    """
    return dataset_loader.get_stats()

@router.get("/actors")
def get_threat_actors(limit: int = Query(100, ge=1, le=500), page: int = Query(1, ge=1)):
    """List all real tracked account entities from the active dataset with pagination."""
    actors = dataset_loader.get_all_actors()
    offset = (page - 1) * limit
    paginated = actors[offset:offset+limit]
    return paginated

@router.get("/actors/{actor_id}")
def get_actor_by_id(actor_id: str):
    """Get detailed threat actor profile by ID, username, or alias."""
    actors = dataset_loader.get_all_actors()
    for a in actors:
        if (a["id"].lower() == actor_id.lower() or 
            a["primaryAlias"].lower() == actor_id.lower() or 
            a.get("profileId", "").lower() == actor_id.lower()):
            return a
    raise HTTPException(status_code=404, detail=f"Account / Threat Actor '{actor_id}' not found in dataset.")

@router.get("/actors/{actor_id}/heatmap")
def get_actor_activity_heatmap(actor_id: str):
    """
    Returns exactly 168 aggregated values (24h x 7 days) without sending raw post records to client.
    """
    actors = dataset_loader.get_all_actors()
    matched = next((a for a in actors if a["id"].lower() == actor_id.lower() or a["primaryAlias"].lower() == actor_id.lower()), None)
    username = matched["primaryAlias"] if matched else actor_id
    grid = DatabaseService.get_actor_heatmap_aggregated(None, username)
    return {
        "actorId": actor_id,
        "username": username,
        "grid": grid,
        "totalObservedActivity": sum(grid)
    }

@router.get("/search")
def search_intelligence(
    q: str = Query(..., min_length=1, description="Search term for username, wallet, bio, PGP"),
    limit: int = Query(50, ge=1, le=200)
):
    """
    Search real dataset entities without mock index fabrication.
    """
    results = dataset_loader.search_intelligence(q)
    paginated_results = results[:limit]
    return {
        "query": q,
        "count": len(paginated_results),
        "totalMatches": len(results),
        "results": paginated_results,
        "message": "Results found" if paginated_results else "No matching intelligence found in the dataset."
    }

@router.get("/graph/topology")
def get_graph_topology(
    dataset_id: Optional[str] = Query(None),
    limit: int = Query(120, ge=10, le=500, description="Max node threshold to prevent browser freeze"),
    cursor: int = Query(0, ge=0, description="Pagination offset cursor"),
    min_risk: float = Query(0.0, ge=0.0, le=100.0),
    entity_type: Optional[str] = Query(None, description="Filter by ACCOUNT, WALLET, FORUM, PGP, etc.")
):
    """
    Scalable Paginated Threat Graph API:
    Returns bounded nodes and links with cursor pagination to prevent frontend WebGL/D3 memory exhaustion.
    """
    graph_data = DatabaseService.get_paginated_graph(
        dataset_id=dataset_id,
        limit=limit,
        cursor_offset=cursor,
        min_risk=min_risk,
        entity_type=entity_type
    )
    return graph_data

@router.get("/graph/neighborhood/{entity_id}")
@router.get("/graph/entity/{entity_id}")
def get_entity_neighborhood(
    entity_id: str,
    dataset_id: Optional[str] = Query(None),
    depth: int = Query(1, ge=1, le=2),
    limit: int = Query(50, ge=5, le=200)
):
    """
    On-demand neighborhood expansion:
    Returns immediate 1-hop connected nodes and links for the selected entity.
    """
    neighborhood = DatabaseService.get_entity_neighborhood(
        dataset_id=dataset_id,
        entity_id=entity_id,
        depth=depth,
        limit=limit
    )
    return neighborhood

@router.get("/graph/node/{node_id}")
def get_node_details(node_id: str):
    """
    Fetch real connected records and supporting evidence for a clicked entity node.
    """
    details = dataset_loader.get_node_details(node_id)
    if not details:
        raise HTTPException(status_code=404, detail=f"Node '{node_id}' not found in dataset graph.")
    return details

@router.post("/correlate", response_model=CorrelationResponse)
def correlate_intelligence(payload: CorrelationRequest):
    """
    Multi-Signal Intelligence Correlation Engine:
    Evaluates submitted indicators against real dataset entities.
    """
    complaint_proxy = {
        "title": "Intelligence Pivot Inquiry",
        "narrative": payload.queryText or "",
        "suspectAlias": payload.alias,
        "suspectWallet": payload.walletAddress,
        "suspectOnionUrl": payload.onionUrl,
        "suspectEmail": payload.email,
        "evidenceFiles": []
    }

    ai_report = run_ai_anomaly_detection(complaint_proxy)

    score = ai_report["anomalyScore"]
    risk_pillars = {
        "aliasCorrelation": round(min(20.0, score * 0.22), 1),
        "behavioralSimilarity": round(min(15.0, score * 0.16), 1),
        "infrastructureLink": round(min(20.0, score * 0.21), 1),
        "activityAnomaly": round(min(15.0, score * 0.15), 1),
        "temporalCorrelation": round(min(10.0, score * 0.11), 1),
        "blockchainRelationship": round(min(20.0, score * 0.20), 1)
    }

    matched_actors = [
        MatchedThreatActorSchema(
            actorName=m["actorName"],
            threatLevel=m["threatLevel"],
            confidence=m["confidence"],
            matchedIndicators=m["matchedIndicators"],
            riskScore=m["riskScore"]
        ) for m in ai_report["matchedActors"]
    ]

    graph_recs = [
        "Cross-reference wallet on-chain transaction history in dataset",
        "Inspect shared PGP fingerprint keyrings across darknet forums",
        "Examine stylometric vocabulary richness and linguistic syntax matches"
    ]

    confidence_level = "VERY HIGH" if ai_report["confidenceScore"] >= 85 else "HIGH" if ai_report["confidenceScore"] >= 70 else "MODERATE"

    return CorrelationResponse(
        corroborationScore=ai_report["anomalyScore"],
        confidenceLevel=confidence_level,
        riskScore=ai_report["anomalyScore"],
        riskLevel=ai_report["riskLevel"],
        riskPillars=risk_pillars,
        matchedActors=matched_actors,
        detectedPatterns=ai_report["detectedPatterns"],
        forensicBreakdown=ai_report["forensicSummary"],
        graphRecommendations=graph_recs
    )

# ============================================================
# MULTI-SIGNAL CONNECTION & ATTRIBUTION RULE ENGINE ENDPOINTS
# ============================================================
from backend.services.connection_rule_engine import ConnectionRuleEngine

@router.post("/attribution/correlate")
@router.post("/correlate-entities")
def correlate_two_entities(payload: Dict[str, Any]):
    """
    Multi-Signal Entity Attribution Evaluation:
    Evaluates two entities across all 9 independent forensic rules (PGP, Wallets,
    Stylometrics, Diurnal Heatmaps, Timelines, Technical Indicators, Lexical Handle Similarity).
    """
    entity_a = payload.get("entityA") or payload.get("sourceActor") or payload.get("entity_a")
    entity_b = payload.get("entityB") or payload.get("targetCandidate") or payload.get("entity_b")
    
    if not entity_a or not entity_b:
        raise HTTPException(
            status_code=400,
            detail="Both 'entityA' and 'entityB' identifiers are required for correlation analysis."
        )

    dataset_id = payload.get("datasetId") or payload.get("dataset_id")
    entity_a_data = payload.get("entityAData") or payload.get("entity_a_data")
    entity_b_data = payload.get("entityBData") or payload.get("entity_b_data")

    engine = ConnectionRuleEngine.get_instance()
    result = engine.correlate_entities(
        entity_a_id=entity_a,
        entity_b_id=entity_b,
        dataset_id=dataset_id,
        entity_a_data=entity_a_data,
        entity_b_data=entity_b_data
    )

    return {
        "success": True,
        "data": result,
        "error": None
    }

@router.get("/attribution/correlate/{entity_a}/{entity_b}")
@router.get("/correlate/{entity_a}/{entity_b}")
def get_entity_correlation_pair(
    entity_a: str,
    entity_b: str,
    dataset_id: Optional[str] = Query(None)
):
    """
    On-Demand Multi-Signal Correlation between two specific entities.
    """
    engine = ConnectionRuleEngine.get_instance()
    result = engine.correlate_entities(
        entity_a_id=entity_a,
        entity_b_id=entity_b,
        dataset_id=dataset_id
    )

    return {
        "success": True,
        "data": result,
        "error": None
    }

@router.get("/attribution/correlations")
@router.get("/correlations")
def list_correlated_pairs(
    dataset_id: Optional[str] = Query(None),
    min_confidence: float = Query(30.0, ge=0.0, le=100.0)
):
    """
    Returns all dynamically evaluated multi-signal correlation pairs from the active dataset.
    """
    engine = ConnectionRuleEngine.get_instance()
    pairs = engine.get_all_correlated_pairs(
        dataset_id=dataset_id,
        min_confidence=min_confidence
    )

    return {
        "success": True,
        "count": len(pairs),
        "data": pairs,
        "error": None
    }

@router.get("/attribution/rules")
@router.get("/correlation-rules")
def get_correlation_rules_config():
    """
    Returns the transparent 9-rule configuration matrix, weights, confidence tiers, and disclaimer.
    """
    engine = ConnectionRuleEngine.get_instance()
    return {
        "success": True,
        "data": engine.get_rule_configurations(),
        "error": None
    }

@router.put("/attribution/rules")
@router.put("/correlation-rules")
def update_correlation_rules_config(payload: Dict[str, Any]):
    """
    Configurable Rule Engine Administration:
    Update weights or enable/disable individual rules.
    """
    engine = ConnectionRuleEngine.get_instance()
    updated = engine.update_rule_configurations(payload)
    return {
        "success": True,
        "message": "Correlation rule weights updated successfully.",
        "data": updated,
        "error": None
    }

