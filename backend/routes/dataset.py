# ============================================================
# UNMASK // SCALABLE DATASET MANAGEMENT ROUTER
# Asynchronous Background Ingestion, Real-Time Progress & Large Data APIs
# ============================================================

import os
import shutil
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Body, Query, Request
from pydantic import BaseModel

from backend.database import DatabaseService
from backend.services.dataset_processor import DatasetProcessor, UPLOADS_DIR
from backend.dataset_service import DatasetService
from backend.dataset_loader import DatasetLoader

router = APIRouter(prefix="/dataset", tags=["Scalable Dataset Management"])
# Also register plural alias "/datasets"
plural_router = APIRouter(prefix="/datasets", tags=["Scalable Dataset Management"])

class ProcessDatasetRequest(BaseModel):
    filePath: str
    filename: str
    datasetId: Optional[str] = None
    mappings: Optional[Dict[str, Any]] = None
    autoActivate: Optional[bool] = False

@router.post("/upload")
@plural_router.post("/upload")
async def upload_dataset_files(
    request: Request
):
    """
    Asynchronous Large Dataset Upload Endpoint:
    Stores file(s), registers QUEUED dataset record, launches background chunked processor,
    and returns immediately with HTTP 202 / job ID without blocking the connection.
    """
    form = await request.form()
    print("FORM DEBUG:", list(form.keys()), [(k, type(v), getattr(v, 'filename', None)) for k, v in form.items()])
    uploaded_files: List[UploadFile] = []
    seen_ids = set()

    for key, value in form.items():
        if hasattr(value, "filename") and getattr(value, "filename", None):
            if id(value) not in seen_ids:
                seen_ids.add(id(value))
                uploaded_files.append(value)

    for key in set(form.keys()):
        for item in form.getlist(key):
            if isinstance(item, UploadFile) and item.filename:
                if id(item) not in seen_ids:
                    seen_ids.add(id(item))
                    uploaded_files.append(item)

    if not uploaded_files:
        raise HTTPException(status_code=400, detail="No dataset files were provided in request.")

    saved_items = []
    try:
        for f in uploaded_files:
            fname = f.filename or "dataset.csv"
            ext = os.path.splitext(fname)[1].lower()
            if ext not in [".csv", ".xlsx", ".xls"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported format '{fname}'. Please upload .csv, .xlsx, or .xls."
                )
            safe_name = f"upload_{os.urandom(4).hex()}_{fname}"
            saved_path = os.path.join(UPLOADS_DIR, safe_name)
            with open(saved_path, "wb") as buffer:
                shutil.copyfileobj(f.file, buffer)
            saved_items.append({"filePath": saved_path, "filename": fname})

        dataset_id = DatasetService.generate_dataset_id()
        primary_name = saved_items[0]["filename"] if len(saved_items) == 1 else f"Bundle ({len(saved_items)} files: {', '.join(s['filename'] for s in saved_items[:2])})"
        primary_path = saved_items[0]["filePath"]

        # Enqueue background processing job immediately
        processor = DatasetProcessor.get_instance()
        processor.enqueue_job(
            dataset_id=dataset_id,
            file_path=primary_path,
            filename=primary_name,
            files_list=saved_items,
            auto_activate=False
        )

        return {
            "success": True,
            "data": {
                "dataset_id": dataset_id,
                "datasetId": dataset_id,
                "filename": primary_name,
                "status": "QUEUED",
                "message": "Dataset uploaded and queued for background chunked processing.",
                "uploadedAt": datetime.now(timezone.utc).isoformat()
            },
            "error": None
        }

    except HTTPException:
        raise
    except Exception as e:
        for item in saved_items:
            if os.path.exists(item["filePath"]):
                try:
                    os.remove(item["filePath"])
                except Exception:
                    pass
        raise HTTPException(status_code=500, detail=f"Dataset upload initialization failed: {str(e)}")

@router.get("/{dataset_id}/status")
@plural_router.get("/{dataset_id}/status")
def get_dataset_job_status(dataset_id: str):
    """
    Real-Time Progress Polling Endpoint:
    Returns exact progress percentage, current stage, processed/total rows,
    valid vs invalid row counters, and execution metrics.
    """
    record = DatabaseService.get_dataset_by_id(dataset_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    return {
        "success": True,
        "data": {
            "dataset_id": dataset_id,
            "datasetId": dataset_id,
            "filename": record.get("filename"),
            "status": record.get("status", "QUEUED"),
            "current_stage": record.get("currentStage", "QUEUED"),
            "currentStage": record.get("currentStage", "QUEUED"),
            "progress_percent": record.get("progressPercent", 0.0),
            "progressPercent": record.get("progressPercent", 0.0),
            "total_rows": record.get("totalRows", 0),
            "totalRows": record.get("totalRows", 0),
            "processed_rows": record.get("processedRows", 0),
            "processedRows": record.get("processedRows", 0),
            "valid_rows": record.get("validRows", 0),
            "validRows": record.get("validRows", 0),
            "invalid_rows": record.get("invalidRows", 0),
            "invalidRows": record.get("invalidRows", 0),
            "entity_count": record.get("entityCount", 0),
            "entityCount": record.get("entityCount", 0),
            "relationship_count": record.get("relationshipCount", 0),
            "relationshipCount": record.get("relationshipCount", 0),
            "error_message": record.get("errorMessage"),
            "errorMessage": record.get("errorMessage"),
            "uploadedAt": record.get("uploadedAt"),
            "completedAt": record.get("completedAt")
        },
        "error": record.get("errorMessage")
    }

@router.post("/{dataset_id}/cancel")
@plural_router.post("/{dataset_id}/cancel")
def cancel_dataset_processing(dataset_id: str):
    """
    Cancels an active background processing job safely between row chunks.
    """
    processor = DatasetProcessor.get_instance()
    success = processor.cancel_job(dataset_id)
    return {
        "success": success,
        "datasetId": dataset_id,
        "status": "CANCELLED",
        "message": f"Processing job '{dataset_id}' cancelled."
    }

@router.post("/activate/{dataset_id}")
@plural_router.post("/activate/{dataset_id}")
def activate_dataset(dataset_id: str):
    """
    Atomic Dataset Activation Endpoint:
    Sets target dataset to ACTIVE and sets previous ACTIVE to ARCHIVED in one atomic transaction.
    """
    record = DatabaseService.get_dataset_by_id(dataset_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    if record.get("status") not in ["READY", "ACTIVE", "ARCHIVED"]:
        raise HTTPException(status_code=400, detail=f"Cannot activate dataset in status '{record.get('status')}'. Must be READY.")

    DatabaseService.activate_dataset_atomic(dataset_id)
    DatasetService._current_active_dataset = DatabaseService.get_dataset_by_id(dataset_id)
    DatasetLoader.get_instance().reload_from_db()

    return {
        "success": True,
        "message": f"Dataset '{dataset_id}' ({record.get('filename')}) is now the active source of truth.",
        "activeDatasetId": dataset_id,
        "status": "ACTIVE"
    }

@router.get("/{dataset_id}/errors")
@plural_router.get("/{dataset_id}/errors")
def get_dataset_error_report(
    dataset_id: str,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """
    Returns paginated list of invalid rows logged during dataset ingestion.
    """
    return DatabaseService.get_dataset_errors(dataset_id, limit, offset)

@router.get("/status")
@plural_router.get("/status")
def get_active_dataset_status():
    """
    Returns current active dataset metrics and telemetry.
    """
    active_dataset = DatasetService.get_active_dataset()
    stats = DatasetLoader.get_instance().get_stats()
    return {
        "active": stats,
        "datasetDetails": {
            "id": active_dataset.get("id") if active_dataset else None,
            "filename": active_dataset.get("filename") if active_dataset else None,
            "status": active_dataset.get("status") if active_dataset else "UNAVAILABLE",
            "uploadedAt": active_dataset.get("uploadedAt") if active_dataset else None,
            "uploadedBy": active_dataset.get("uploadedBy") if active_dataset else None,
            "validationSummary": active_dataset.get("validationSummary") if active_dataset else None,
            "entitiesCount": active_dataset.get("entitiesCount", 0) if active_dataset else 0,
            "relationshipsCount": active_dataset.get("relationshipsCount", 0) if active_dataset else 0
        }
    }

@router.get("/history")
@plural_router.get("/history")
def get_dataset_history():
    """
    Returns list of all uploaded, ready, processing, and historical datasets.
    """
    datasets = DatabaseService.list_all_datasets()
    return {
        "count": len(datasets),
        "datasets": datasets
    }

@router.delete("/{dataset_id}")
@plural_router.delete("/{dataset_id}")
def delete_dataset(dataset_id: str):
    """
    Deletes dataset record and cleans up storage.
    """
    record = DatabaseService.get_dataset_by_id(dataset_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    was_active = (record.get("status") == "ACTIVE")
    
    if record.get("filePath") and os.path.exists(record["filePath"]):
        try:
            os.remove(record["filePath"])
        except Exception:
            pass

    DatabaseService.delete_dataset_record(dataset_id)

    if was_active:
        remaining = DatabaseService.list_all_datasets()
        if remaining:
            next_id = remaining[0]["id"]
            DatabaseService.activate_dataset_atomic(next_id)
            DatasetService._current_active_dataset = DatabaseService.get_dataset_by_id(next_id)
            DatasetLoader.get_instance().reload_from_db()
        else:
            DatasetService.initialize_initial_dataset()

    return {
        "success": True,
        "deletedId": dataset_id,
        "message": f"Dataset '{dataset_id}' successfully removed."
    }

@router.get("/preview/{dataset_id}")
@plural_router.get("/preview/{dataset_id}")
def get_dataset_preview(dataset_id: str):
    """
    Fetches lightweight preview rows (first 20 rows) for a dataset without loading full dataset.
    """
    record = DatabaseService.get_dataset_by_id(dataset_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    file_path = record.get("filePath")
    if file_path and os.path.exists(file_path):
        try:
            preview = DatasetService.preview_uploaded_file(file_path, record.get("filename", "dataset"))
            return {
                "datasetId": dataset_id,
                "metadata": record,
                "preview": preview
            }
        except Exception:
            pass

    return {
        "datasetId": dataset_id,
        "metadata": record,
        "nodesSample": record.get("nodes", [])[:15],
        "linksSample": record.get("links", [])[:15]
    }

# ============================================================
# KAGGLE UNSW-NB15 DATASET INGESTION & SECURITY EVENTS ENDPOINTS
# ============================================================

from backend.services.kaggle_importer import KaggleImporter

class KaggleImportRequest(BaseModel):
    datasetIdentifier: Optional[str] = "likkisamarthreddy/unsw15"
    datasetId: Optional[str] = None
    maxRowsPerFile: Optional[int] = None
    autoActivate: Optional[bool] = False

@router.post("/import/kaggle")
@plural_router.post("/import/kaggle")
def import_kaggle_dataset(payload: KaggleImportRequest = Body(...)):
    """
    Triggers asynchronous download and ingestion of the Kaggle UNSW-NB15 dataset suite.
    Returns HTTP 202 status and job tracking ID.
    """
    importer = KaggleImporter.get_instance()
    dataset_id = importer.start_import(
        dataset_identifier=payload.datasetIdentifier or "likkisamarthreddy/unsw15",
        dataset_id=payload.datasetId,
        max_rows_per_file=payload.maxRowsPerFile,
        auto_activate=payload.autoActivate or False
    )
    return {
        "success": True,
        "data": {
            "dataset_id": dataset_id,
            "datasetId": dataset_id,
            "status": "QUEUED",
            "sourceIdentifier": payload.datasetIdentifier or "likkisamarthreddy/unsw15",
            "message": "Kaggle dataset UNSW-NB15 download and chunked ingestion queued in background.",
            "queuedAt": datetime.now(timezone.utc).isoformat()
        },
        "error": None
    }

@router.get("/{dataset_id}/statistics")
@plural_router.get("/{dataset_id}/statistics")
def get_dataset_security_statistics(dataset_id: str):
    """
    Returns aggregated security telemetry statistics (attacks vs normal, top protocols,
    traffic volume, unique IPs) for a network security dataset.
    """
    record = DatabaseService.get_dataset_by_id(dataset_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    stats = DatabaseService.get_security_events_statistics(dataset_id)
    return {
        "success": True,
        "datasetId": dataset_id,
        "filename": record.get("filename"),
        "statistics": stats
    }

@router.get("/{dataset_id}/events")
@plural_router.get("/{dataset_id}/events")
def get_dataset_security_events(
    dataset_id: str,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    attack_category: Optional[str] = Query(None),
    protocol: Optional[str] = Query(None),
    is_attack: Optional[int] = Query(None)
):
    """
    Returns paginated, searchable normalized security event records from the UNSW-NB15 flow suite.
    """
    record = DatabaseService.get_dataset_by_id(dataset_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")

    result = DatabaseService.get_security_events(
        dataset_id=dataset_id,
        limit=limit,
        offset=offset,
        search=search,
        attack_category=attack_category,
        protocol=protocol,
        is_attack=is_attack
    )
    return {
        "success": True,
        "datasetId": dataset_id,
        **result
    }

@router.get("/events/search")
@plural_router.get("/events/search")
def search_security_events_global(
    dataset_id: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    attack_category: Optional[str] = Query(None),
    protocol: Optional[str] = Query(None),
    is_attack: Optional[int] = Query(None)
):
    """
    Global search endpoint across all security events and network threat flows.
    """
    result = DatabaseService.get_security_events(
        dataset_id=dataset_id,
        limit=limit,
        offset=offset,
        search=search,
        attack_category=attack_category,
        protocol=protocol,
        is_attack=is_attack
    )
    return {
        "success": True,
        **result
    }

