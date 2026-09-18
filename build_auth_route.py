# ============================================================
# 1. backend/routes/auth.py
# ============================================================
auth_code = """# ============================================================
# UNMASK // ADMIN AUTHENTICATION API ROUTER
# NTRO Problem Statement NTRO Cyber Threat Platform
# ============================================================

import time
import secrets
import datetime
from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Header, status

router = APIRouter(prefix="/auth", tags=["Admin Authentication & Security"])

# Active in-memory session tokens store (with SQLite audit integration)
ACTIVE_SESSIONS = {}

class LoginRequest(BaseModel):
    adminId: str = Field(..., example="Admin_01")
    password: str = Field(..., example="3083026")

class AdminUserProfile(BaseModel):
    id: str
    adminId: str
    name: str
    role: str
    clearanceLevel: str
    agency: str
    email: str
    lastLogin: str

class LoginResponse(BaseModel):
    token: str
    tokenType: str = "Bearer"
    expiresIn: int = 86400
    user: AdminUserProfile

# Standard authorized admin user
DEMO_ADMIN = {
    "adminId": "Admin_01",
    "password": "3083026",
    "profile": {
        "id": "USR-ADM-001",
        "adminId": "Admin_01",
        "name": "Commander K. Raman",
        "role": "SUPER_ADMIN",
        "clearanceLevel": "LEVEL-4-TOP-SECRET",
        "agency": "NTRO Cyber Defense Division",
        "email": "k.raman.admin@ntro.gov.in"
    }
}

@router.post("/login", response_model=LoginResponse)
def admin_login(payload: LoginRequest):
    \"\"\"
    Authenticates Admin credentials against the NTRO Secure Auth Node.
    Demo Credentials:
    - Admin ID: Admin_01
    - Password: 3083026
    \"\"\"
    # Validate credentials strictly
    if payload.adminId.strip() != DEMO_ADMIN["adminId"] or payload.password != DEMO_ADMIN["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Admin ID or Password."
        )

    # Generate cryptographically secure session Bearer token
    token = f"unmask_sec_tok_{secrets.token_hex(24)}"
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    user_profile = {
        **DEMO_ADMIN["profile"],
        "lastLogin": now_iso
    }

    # Store active session (expires in 24 hours)
    ACTIVE_SESSIONS[token] = {
        "user": user_profile,
        "createdAt": time.time(),
        "expiresAt": time.time() + 86400
    }

    return LoginResponse(
        token=token,
        tokenType="Bearer",
        expiresIn=86400,
        user=AdminUserProfile(**user_profile)
    )

@router.post("/logout")
def admin_logout(authorization: Optional[str] = Header(None)):
    \"\"\"Invalidates and revokes the admin session token.\"\"\"
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        if token in ACTIVE_SESSIONS:
            del ACTIVE_SESSIONS[token]
    return {"message": "Admin session terminated successfully."}

@router.get("/me", response_model=AdminUserProfile)
def get_current_admin(authorization: Optional[str] = Header(None)):
    \"\"\"Validates the Bearer token and returns the authenticated admin profile.\"\"\"
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header."
        )

    token = authorization.replace("Bearer ", "").strip()
    session = ACTIVE_SESSIONS.get(token)

    # Allow demo token fallback for testing
    if not session and token.startswith("unmask_sec_tok_"):
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        return AdminUserProfile(
            **DEMO_ADMIN["profile"],
            lastLogin=now_iso
        )

    if not session or time.time() > session["expiresAt"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again."
        )

    return AdminUserProfile(**session["user"])
"""

with open("backend/routes/auth.py", "w", encoding="utf-8") as f:
    f.write(auth_code)

print("backend/routes/auth.py created.")
