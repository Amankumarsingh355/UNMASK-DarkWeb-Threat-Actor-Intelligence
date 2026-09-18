# ============================================================
# SYSTEM HEALTH & DEMO SEEDING API ROUTER
# NTRO Cyber Threat Intelligence Platform
# ============================================================

import time
import datetime
from fastapi import APIRouter
from backend.database import DatabaseService, init_db

router = APIRouter(prefix="/system", tags=["System & Health"])
START_TIME = time.time()

@router.get("/health")
def get_health():
    """Returns system uptime, active database statistics, and model version."""
    complaints = DatabaseService.get_all_complaints()
    actors = DatabaseService.get_all_actors()
    topology = DatabaseService.get_graph_topology()

    return {
        "status": "OPERATIONAL",
        "system": "UNMASK Dark Web Intelligence Triage",
        "uptimeSeconds": round(time.time() - START_TIME, 2),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "database": {
            "type": "SQLite-ThreadSafe",
            "complaintsCount": len(complaints),
            "threatActorsCount": len(actors),
            "graphNodesCount": len(topology["nodes"]),
            "graphLinksCount": len(topology["links"])
        },
        "aiEngine": {
            "version": "v4.2-FASTAPI",
            "activePipelines": ["AnomalyDetection", "MultiSignalCorrelator", "StylometricNLP", "LedgerFlowTracer"],
            "status": "ONLINE"
        }
    }

@router.post("/seed")
def reseed_database():
    """Reseeds the database with clean baseline demo data."""
    init_db(force_reseed=True)
    return {"message": "Database successfully reseeded with official intelligence dataset."}
