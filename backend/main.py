# ============================================================
# UNMASK // BACKEND FASTAPI APPLICATION
# NTRO Dark Web Anomaly Detection & Citizen Complaint Triage Portal
# Cyber Threat Intelligence Platform
# ============================================================

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.database import init_db
from backend.routes import auth, reports, complaints, intelligence, stylometrics, system, confidence, dataset, analysis, network
from backend.dataset_loader import DatasetLoader

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables, datasets, and seed data on startup
    init_db(force_reseed=False)
    print("UNMASK Intelligence Database & Dataset Pipeline initialized on port 8000.")
    yield

app = FastAPI(
    title="UNMASK // Dark Web Intelligence & Citizen Triage API",
    description="""
## NTRO Dark Web Anomaly Detection & Citizen Complaint Triage Portal

Welcome to the **UNMASK AI REST API Backend**.
This service provides enterprise-grade endpoints for:
- 🔐 **Admin Authentication & Token Clearance** (Admin_01 / 3083026)
- 📊 **Scalable Asynchronous Dataset Ingestion** (.xlsx, .xls, .csv chunked background streaming)
- 🌐 **UNSW-NB15 Network Threat Intelligence** (Intrusion detection, flow classification & evidence fusion)
- 👤 **Actor Intelligence Profile & 168-Hour Activity Heatmap** (Attribution analysis & Grounded evidence)
- 🛡️ **Threat Reports & Citizen Triage** (with SHA-256 evidence hashing & blockchain proofs)
- 🧠 **Multi-Signal AI Threat Correlation** (6-Pillar Risk Engine)
- 🎯 **AI Analysis Confidence & Scoring Engine** (Explainable multi-signal correlation & timeline)
- 🌐 **3D WebGL Threat Graph Topology** (Actors, Wallets, Forums, PGP, Network IPs, Attacks)
- ✍️ **NLP Stylometric Authorship Attribution** (Ransomware & Forum Dark Web text analysis)
- ⚡ **Real-time REST & JSON APIs** running live on `http://localhost:8000`
    """,
    version="4.6.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for seamless integration with Vite / React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers with /api/v1 prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(reports.direct_router, prefix="/api/v1")
app.include_router(complaints.router, prefix="/api/v1")
app.include_router(intelligence.router, prefix="/api/v1")
app.include_router(confidence.router, prefix="/api/v1")
app.include_router(stylometrics.router, prefix="/api/v1")
app.include_router(system.router, prefix="/api/v1")
app.include_router(dataset.router, prefix="/api/v1")
app.include_router(dataset.plural_router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")
app.include_router(network.router, prefix="/api/v1")

# Also include with /api prefix for backward and REST compatibility
app.include_router(auth.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(reports.direct_router, prefix="/api")
app.include_router(complaints.router, prefix="/api")
app.include_router(intelligence.router, prefix="/api")
app.include_router(confidence.router, prefix="/api")
app.include_router(stylometrics.router, prefix="/api")
app.include_router(system.router, prefix="/api")
app.include_router(dataset.router, prefix="/api")
app.include_router(dataset.plural_router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(network.router, prefix="/api")

# Direct analysis & intelligence aliases without prefix
app.include_router(analysis.router)

# Direct graph aliases
@app.get("/api/graph", tags=["Direct Graph API"])
@app.get("/api/v1/graph", tags=["Direct Graph API"])
def get_graph_alias():
    """Direct alias to fetch complete threat graph topology from active dataset."""
    return DatasetLoader.get_instance().get_graph_topology()

@app.get("/", tags=["Root"])
def root_endpoint():
    return {
        "service": "UNMASK AI Backend",
        "system": "NTRO Cyber Threat Intelligence Platform",
        "status": "RUNNING",
        "documentation": {
            "swaggerUi": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        },
        "endpoints": {
            "authLogin": "/api/v1/auth/login",
            "authLogout": "/api/v1/auth/logout",
            "authMe": "/api/v1/auth/me",
            "datasetUpload": "/api/v1/dataset/upload",
            "datasetProcess": "/api/v1/dataset/process",
            "datasetStatus": "/api/v1/dataset/status",
            "datasetHistory": "/api/v1/dataset/history",
            "reports": "/api/v1/reports",
            "complaints": "/api/v1/complaints",
            "complaintsStats": "/api/v1/complaints/stats/summary",
            "intelligenceActors": "/api/v1/intelligence/actors",
            "intelligenceCorrelate": "/api/v1/intelligence/correlate",
            "threatGraphTopology": "/api/v1/intelligence/graph/topology",
            "directGraph": "/api/graph",
            "stylometricsAnalyze": "/api/v1/stylometrics/analyze",
            "systemHealth": "/api/v1/system/health"
        }
    }
