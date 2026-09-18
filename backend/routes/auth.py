# ============================================================
# UNMASK // PRODUCTION AUTHENTICATION & SECURITY REST API ROUTER
# Supports Google OAuth 2.0, Email/Password/User ID, MetaMask SIWE
# ============================================================

import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Header, Request, status, Query, Depends

from backend.auth_service import AuthService
from backend.database import DatabaseService

router = APIRouter(prefix="/auth", tags=["Authentication & User Identity"])

# ============================================================
# PYDANTIC SCHEMAS
# ============================================================

class RegisterRequest(BaseModel):
    email: str = Field(..., example="investigator@example.com")
    password: str = Field(..., min_length=6, example="SecurePassword123!")
    displayName: str = Field(..., example="Aman Singh")
    userId: Optional[str] = Field(None, example="UNMASK-USER-000001")

class LoginRequest(BaseModel):
    # Accepts either userId, email, identifier, or adminId
    userId: Optional[str] = None
    email: Optional[str] = None
    identifier: Optional[str] = None
    adminId: Optional[str] = None
    password: str

class GoogleVerifyRequest(BaseModel):
    idToken: Optional[str] = None
    code: Optional[str] = None
    redirectUri: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None
    sub: Optional[str] = None

class GoogleLinkRequest(BaseModel):
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    sub: Optional[str] = None

class MetaMaskNonceRequest(BaseModel):
    walletAddress: Optional[str] = None

class MetaMaskVerifyRequest(BaseModel):
    address: str
    message: str
    signature: str
    role: Optional[str] = "USER"

class MetaMaskLinkRequest(BaseModel):
    address: str
    message: str
    signature: str

# Helper to get client IP hash and user agent
def _get_client_meta(request: Request) -> tuple[str, str]:
    client_ip = request.client.host if request.client else "127.0.0.1"
    import hashlib
    ip_hash = hashlib.sha256(client_ip.encode()).hexdigest()[:16]
    user_agent = request.headers.get("user-agent", "Unknown")[:200]
    return ip_hash, user_agent

# Helper to resolve authenticated user from Bearer header
def get_current_authenticated_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header."
        )
    user = AuthService.validate_session(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again."
        )
    return user

# Helper for Admin-only routes
def require_admin_role(user: Dict[str, Any] = Depends(get_current_authenticated_user)) -> Dict[str, Any]:
    if user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Administrator privileges required."
        )
    return user

# ============================================================
# REST ENDPOINTS
# ============================================================

@router.post("/register")
def register_account(payload: RegisterRequest, request: Request):
    """
    Registers a new standard UNMASK user account.
    Validates input, securely hashes password with Argon2id, creates unique User ID.
    """
    ip_hash, user_agent = _get_client_meta(request)
    try:
        res = AuthService.register(
            email=payload.email,
            password=payload.password,
            display_name=payload.displayName,
            user_id=payload.userId,
            ip_hash=ip_hash,
            user_agent=user_agent
        )
        return {
            "success": True,
            "data": res,
            "error": None
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed.")

@router.post("/login")
def login_user(payload: LoginRequest, request: Request):
    """
    Authenticates user via User ID, Email, or Admin ID with Argon2id verification.
    """
    ip_hash, user_agent = _get_client_meta(request)
    # Determine the login identifier
    identifier = payload.userId or payload.email or payload.identifier or payload.adminId
    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID or Email is required."
        )

    try:
        res = AuthService.login(
            identifier=identifier,
            password=payload.password,
            ip_hash=ip_hash,
            user_agent=user_agent
        )
        return {
            "success": True,
            "data": res,
            "error": None
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Login failed.")

@router.post("/logout")
def logout_user(authorization: Optional[str] = Header(None)):
    """Revokes active session token."""
    if authorization:
        AuthService.revoke_session(authorization)
    return {
        "success": True,
        "data": {"message": "Session terminated successfully."},
        "error": None
    }

@router.get("/me")
def get_current_user(user: Dict[str, Any] = Depends(get_current_authenticated_user)):
    """Validates session token and returns safe user profile with connected providers."""
    # Ensure backward compatible fields for legacy admin views
    admin_id = user.get("userId")
    legacy_profile = {
        **user,
        "adminId": admin_id,
        "name": user.get("displayName", "Operator"),
        "clearanceLevel": "LEVEL-4-TOP-SECRET" if user.get("role") == "ADMIN" else "LEVEL-2-INVESTIGATOR",
        "agency": "NTRO Cyber Defense Division" if user.get("role") == "ADMIN" else "UNMASK Field Security",
        "lastLogin": user.get("lastLoginAt")
    }
    return {
        "success": True,
        "data": legacy_profile,
        "error": None
    }

# ------------------------------------------------------------
# GOOGLE OAUTH ENDPOINTS
# ------------------------------------------------------------

@router.get("/google")
@router.get("/google/url")
def get_google_auth_url(state: Optional[str] = Query(None)):
    """Returns Google OAuth 2.0 authorization URL."""
    url = AuthService.get_google_auth_url(state=state)
    return {
        "success": True,
        "data": {"url": url},
        "error": None
    }

@router.post("/google/verify")
@router.post("/google/callback")
def verify_google_oauth(payload: GoogleVerifyRequest, request: Request):
    """Verifies Google ID token, authorization code, or verified Google identity profile and returns authenticated session."""
    ip_hash, user_agent = _get_client_meta(request)
    try:
        user_info = None
        if payload.email:
            user_info = {
                "email": payload.email,
                "name": payload.name or "Google User",
                "picture": payload.picture,
                "sub": payload.sub
            }
        res = AuthService.verify_google_auth(
            id_token=payload.idToken,
            code=payload.code,
            redirect_uri=payload.redirectUri,
            user_info=user_info,
            ip_hash=ip_hash,
            user_agent=user_agent
        )
        return {
            "success": True,
            "data": res,
            "error": None
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google authentication failed.")

@router.post("/google/link")
def link_google_account_endpoint(
    payload: GoogleLinkRequest,
    request: Request,
    user: Dict[str, Any] = Depends(get_current_authenticated_user)
):
    """Links a Google Identity to the currently authenticated UNMASK account."""
    ip_hash, user_agent = _get_client_meta(request)
    try:
        res = AuthService.link_google_account(
            user_id=user["userId"],
            user_info={
                "email": payload.email,
                "name": payload.name or "Google User",
                "picture": payload.picture,
                "sub": payload.sub
            },
            ip_hash=ip_hash,
            user_agent=user_agent
        )
        return {
            "success": True,
            "data": res,
            "error": None
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google account linking failed.")

# ------------------------------------------------------------
# METAMASK SIWE ENDPOINTS
# ------------------------------------------------------------

@router.get("/metamask/nonce")
@router.post("/metamask/nonce")
def get_metamask_nonce(payload: Optional[MetaMaskNonceRequest] = None):
    """Generates a cryptographically secure single-use SIWE nonce."""
    wallet_addr = payload.walletAddress if payload else None
    nonce_data = AuthService.get_metamask_nonce(wallet_address=wallet_addr)
    return {
        "success": True,
        "data": nonce_data,
        "error": None
    }

@router.post("/metamask/verify")
def verify_metamask_login(payload: MetaMaskVerifyRequest, request: Request):
    """
    Verifies Ethereum cryptographic signature, validates SIWE nonce,
    and returns authenticated session with specified role (USER or ADMIN).
    """
    ip_hash, user_agent = _get_client_meta(request)
    try:
        res = AuthService.verify_metamask_auth(
            address=payload.address,
            message=payload.message,
            signature=payload.signature,
            role=payload.role or "USER",
            ip_hash=ip_hash,
            user_agent=user_agent
        )
        return {
            "success": True,
            "data": res,
            "error": None
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Wallet authentication failed.")

@router.post("/metamask/link")
def link_metamask_wallet_to_user(
    payload: MetaMaskLinkRequest,
    request: Request,
    user: Dict[str, Any] = Depends(get_current_authenticated_user)
):
    """Links an Ethereum wallet to the currently authenticated UNMASK account."""
    ip_hash, user_agent = _get_client_meta(request)
    try:
        updated_profile = AuthService.link_metamask_wallet(
            user_id=user["userId"],
            address=payload.address,
            message=payload.message,
            signature=payload.signature,
            ip_hash=ip_hash,
            user_agent=user_agent
        )
        return {
            "success": True,
            "data": updated_profile,
            "error": None
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Wallet linking failed.")

# ------------------------------------------------------------
# USER AUDIT & IDENTITY DETAILS
# ------------------------------------------------------------

@router.get("/providers")
def get_user_providers(user: Dict[str, Any] = Depends(get_current_authenticated_user)):
    """Returns all connected authentication identities for current user."""
    identities = DatabaseService.get_user_identities(user["userId"])
    return {
        "success": True,
        "data": {
            "userId": user["userId"],
            "identities": identities,
            "connectedProviders": user.get("connectedProviders", [])
        },
        "error": None
    }

@router.get("/events")
def get_user_auth_events(
    limit: int = Query(50, ge=1, le=100),
    user: Dict[str, Any] = Depends(get_current_authenticated_user)
):
    """Returns security and login audit trail for current user."""
    events = DatabaseService.get_auth_events(user["userId"], limit=limit)
    return {
        "success": True,
        "data": events,
        "error": None
    }

# ------------------------------------------------------------
# ADMIN-ONLY AUDIT LOGS
# ------------------------------------------------------------

@router.get("/admin/audit-logs")
def get_admin_audit_logs(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    admin_user: Dict[str, Any] = Depends(require_admin_role)
):
    """Returns complete authentication and security audit trail across all users."""
    events = DatabaseService.get_all_auth_events(limit=limit, offset=offset)
    return {
        "success": True,
        "data": {
            "events": events,
            "totalCount": len(events)
        },
        "error": None
    }
