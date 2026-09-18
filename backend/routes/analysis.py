# ============================================================
# UNMASK // ACTOR ANALYSIS & ATTRIBUTION REST API ROUTER
# Endpoints for Dynamic Actor Intelligence Profile, Attribution Analysis,
# and 168-Hour Activity Heatmap Generation from Active Dataset.
# ============================================================

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Path

from backend.actor_analysis_engine import ActorAnalysisEngine
from backend.dataset_service import DatasetService

router = APIRouter(prefix="/analysis", tags=["Actor Intelligence & Attribution Analysis"])

@router.get("/{entity_id}/profile")
def get_actor_profile(
    entity_id: str = Path(..., description="Entity ID, username, or node identifier (e.g. shadowfox, account-shadowfox, prof_shadowfox)")
):
    """
    Returns the comprehensive Actor Intelligence Profile dynamically derived
    from the currently active uploaded dataset.
    Includes Overview, Threat Score, Attribution Analysis, 168-Hour Heatmap,
    Supporting Evidence, and Related Entities.
    """
    profile = ActorAnalysisEngine.get_actor_profile(entity_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"Actor / Entity '{entity_id}' was not found in the active dataset."
        )

    return {
        "success": True,
        "data": profile,
        "error": None
    }

@router.get("/{entity_id}/attribution")
def get_actor_attribution(
    entity_id: str = Path(..., description="Entity ID or username to analyze for multi-signal attribution")
):
    """
    Returns multi-signal analytical correlation score, signal contributions (PGP, Wallet,
    Writing Style, Behaviour, Common Sources), and evidence count for the target entity.
    """
    active = DatasetService.get_active_dataset()
    if not active:
        raise HTTPException(status_code=503, detail="No active dataset is currently loaded.")

    clean_id = ActorAnalysisEngine._normalize_identifier(entity_id)
    attribution_data = ActorAnalysisEngine._calculate_attribution_for_actor(clean_id, active)

    return {
        "success": True,
        "data": {
            "entity_id": entity_id,
            **attribution_data
        },
        "error": None
    }

@router.get("/{entity_id}/activity-heatmap")
def get_actor_activity_heatmap(
    entity_id: str = Path(..., description="Entity ID or username to extract 168-hour temporal activity distribution")
):
    """
    Returns 7x24 (168-hour) temporal distribution matrix, activity summary statistics
    (total activity, active days, peak day, peak hour, active window), and cell records.
    """
    active = DatasetService.get_active_dataset()
    if not active:
        raise HTTPException(status_code=503, detail="No active dataset is currently loaded.")

    clean_id = ActorAnalysisEngine._normalize_identifier(entity_id)
    dataset_posts = ActorAnalysisEngine._get_dataset_posts(active)
    actor_posts = [p for p in dataset_posts if p.get("username", "").strip().lower() == clean_id]

    heatmap_data = ActorAnalysisEngine._calculate_temporal_activity(actor_posts, clean_id, active.get("id", "UNMASK-ACTIVE"))

    return {
        "success": True,
        "data": heatmap_data,
        "error": None
    }
