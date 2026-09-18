# ============================================================
# UNMASK // PRODUCTION AUTHENTICATION & IDENTITY SERVICE
# Supports Google OAuth, Email/Password/User ID, and MetaMask SIWE
# ============================================================

import os
import re
import time
import secrets
import datetime
import hashlib
from typing import Optional, Dict, Any, List, Tuple
import argon2
import httpx
from eth_account import Account
from eth_account.messages import encode_defunct

from backend.database import DatabaseService

# Configuration
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:5173/auth/google/callback")
SESSION_SECRET = os.environ.get("SESSION_SECRET", "unmask_master_security_token_secret_2026")
SIWE_DOMAIN = os.environ.get("SIWE_DOMAIN", "localhost:5173")
SIWE_URI = os.environ.get("SIWE_URI", "http://localhost:5173")
SIWE_CHAIN_ID = int(os.environ.get("SIWE_CHAIN_ID", "1"))

# Password Hasher
_ph = argon2.PasswordHasher(
    time_cost=2,
    memory_cost=65536,
    parallelism=2,
    hash_len=32,
    salt_len=16
)

class AuthService:

    # ------------------------------------------------------------
    # 1. PASSWORD HASHING & VALIDATION
    # ------------------------------------------------------------

    @staticmethod
    def hash_password(password: str) -> str:
        """Securely hashes password using Argon2id."""
        return _ph.hash(password)

    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """Verifies password against stored Argon2id hash with legacy fallback."""
        if not password or not password_hash:
            return False
        try:
            return _ph.verify(password_hash, password)
        except Exception:
            return password == password_hash

    # ------------------------------------------------------------
    # 2. SESSION MANAGEMENT
    # ------------------------------------------------------------

    @staticmethod
    def create_session(user_id: str, role: str, user_agent: str = "", ip_hash: str = "") -> Tuple[str, str]:
        """Creates a cryptographically secure 24-hour session."""
        token = f"unmask_sec_tok_{secrets.token_hex(28)}"
        expires_dt = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
        expires_iso = expires_dt.isoformat()
        
        DatabaseService.create_session(
            session_token=token,
            user_id=user_id,
            role=role,
            expires_at=expires_iso,
            user_agent=user_agent,
            ip_hash=ip_hash
        )
        return token, expires_iso

    @staticmethod
    def validate_session(session_token: str) -> Optional[Dict[str, Any]]:
        """Validates session token and returns safe user profile."""
        if not session_token:
            return None
            
        clean_token = session_token.replace("Bearer ", "").strip()
        sess = DatabaseService.get_session(clean_token)
        if not sess:
            return None
            
        try:
            exp_dt = datetime.datetime.fromisoformat(sess["expiresAt"].replace("Z", "+00:00"))
            if datetime.datetime.now(datetime.timezone.utc) > exp_dt:
                DatabaseService.delete_session(clean_token)
                return None
        except Exception:
            pass

        user = DatabaseService.get_user_by_user_id(sess["userId"])
        if not user or not user.get("isActive", True):
            return None

        return AuthService._format_user_profile(user)

    @staticmethod
    def revoke_session(session_token: str) -> bool:
        if not session_token:
            return False
        clean_token = session_token.replace("Bearer ", "").strip()
        sess = DatabaseService.get_session(clean_token)
        if sess:
            DatabaseService.create_auth_event(
                user_id=sess["userId"],
                event_type="LOGOUT",
                provider="session",
                success=True
            )
        return DatabaseService.delete_session(clean_token)

    # ------------------------------------------------------------
    # 3. USER REGISTRATION & EMAIL / USER ID LOGIN
    # ------------------------------------------------------------

    @staticmethod
    def register(
        email: str,
        password: str,
        display_name: str,
        user_id: Optional[str] = None,
        ip_hash: str = "",
        user_agent: str = ""
    ) -> Dict[str, Any]:
        """Registers a new standard UNMASK user account."""
        clean_email = email.strip().lower()
        if not clean_email or "@" not in clean_email:
            raise ValueError("A valid email address is required.")
            
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long.")
            
        existing_email = DatabaseService.get_user_by_email(clean_email)
        if existing_email:
            raise ValueError("An account already exists with this email.")

        final_user_id = user_id.strip().upper() if user_id and user_id.strip() else DatabaseService.get_next_user_id("UNMASK-USER-")
        if not final_user_id.startswith("UNMASK-USER-") and not final_user_id.startswith("UNMASK-ADMIN-"):
            final_user_id = f"UNMASK-USER-{final_user_id}"

        existing_uid = DatabaseService.get_user_by_user_id(final_user_id)
        if existing_uid:
            raise ValueError("This User ID is already registered.")

        pw_hash = AuthService.hash_password(password)
        
        user = DatabaseService.create_user(
            user_id=final_user_id,
            email=clean_email,
            password_hash=pw_hash,
            display_name=display_name.strip() or "UNMASK Investigator",
            role="USER",
            is_email_verified=0,
            auth_provider="password",
            provider_user_id=final_user_id
        )

        DatabaseService.create_auth_event(
            user_id=final_user_id,
            event_type="ACCOUNT_CREATED",
            provider="password",
            success=True,
            ip_hash=ip_hash,
            user_agent=user_agent,
            details={"email": clean_email, "displayName": display_name}
        )

        token, expires_at = AuthService.create_session(final_user_id, "USER", user_agent, ip_hash)
        profile = AuthService._format_user_profile(user)

        return {
            "token": token,
            "tokenType": "Bearer",
            "expiresAt": expires_at,
            "user": profile
        }

    @staticmethod
    def login(
        identifier: str,
        password: str,
        ip_hash: str = "",
        user_agent: str = ""
    ) -> Dict[str, Any]:
        """Authenticates user via User ID or registered Email."""
        clean_id = identifier.strip()
        user = None

        if "@" in clean_id:
            user = DatabaseService.get_user_by_email(clean_id)
        else:
            user = DatabaseService.get_user_by_user_id(clean_id)
            if not user:
                user = DatabaseService.get_user_by_provider("password", clean_id)

        if not user:
            DatabaseService.create_auth_event(
                user_id=None,
                event_type="LOGIN_FAILED",
                provider="password",
                success=False,
                ip_hash=ip_hash,
                user_agent=user_agent,
                details={"identifier": clean_id, "reason": "User not found"}
            )
            raise ValueError("Invalid User ID or password.")

        if not user.get("isActive", True):
            raise ValueError("This account has been deactivated. Please contact administrator.")

        stored_hash = user.get("passwordHash", "")
        if not AuthService.verify_password(password, stored_hash):
            DatabaseService.create_auth_event(
                user_id=user["userId"],
                event_type="LOGIN_FAILED",
                provider="password",
                success=False,
                ip_hash=ip_hash,
                user_agent=user_agent,
                details={"identifier": clean_id, "reason": "Invalid password"}
            )
            raise ValueError("Invalid User ID or password.")

        DatabaseService.update_user_last_login(user["userId"], "password")

        DatabaseService.create_auth_event(
            user_id=user["userId"],
            event_type="LOGIN_SUCCESS",
            provider="password",
            success=True,
            ip_hash=ip_hash,
            user_agent=user_agent
        )

        token, expires_at = AuthService.create_session(user["userId"], user["role"], user_agent, ip_hash)
        profile = AuthService._format_user_profile(user)

        return {
            "token": token,
            "tokenType": "Bearer",
            "expiresAt": expires_at,
            "user": profile
        }

    # ------------------------------------------------------------
    # 4. GOOGLE OAUTH 2.0 / OPENID CONNECT
    # ------------------------------------------------------------

    @staticmethod
    def get_google_auth_url(state: Optional[str] = None) -> str:
        """Generates real Google OAuth 2.0 authorization URL."""
        if not GOOGLE_CLIENT_ID:
            client_id = "UNCONFIGURED_GOOGLE_CLIENT_ID"
        else:
            client_id = GOOGLE_CLIENT_ID

        sec_state = state or secrets.token_urlsafe(16)
        params = {
            "client_id": client_id,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "state": sec_state,
            "prompt": "select_account"
        }
        query = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"https://accounts.google.com/o/oauth2/v2/auth?{query}"

    @staticmethod
    def verify_google_auth(
        id_token: Optional[str] = None,
        code: Optional[str] = None,
        redirect_uri: Optional[str] = None,
        user_info: Optional[Dict[str, Any]] = None,
        ip_hash: str = "",
        user_agent: str = ""
    ) -> Dict[str, Any]:
        """
        Verifies Google OpenID Connect ID token, authorization code, or verified Google identity profile.
        Creates a new UNMASK user or securely links with existing account by verified email.
        """
        google_user_info = None

        if user_info and user_info.get("email"):
            google_user_info = user_info
        elif id_token:
            try:
                with httpx.Client(timeout=6.0) as client:
                    resp = client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
                    if resp.status_code == 200:
                        google_user_info = resp.json()
            except Exception as e:
                print(f"[UNMASK Auth] Google tokeninfo request error: {e}")

        elif code:
            try:
                with httpx.Client(timeout=6.0) as client:
                    token_resp = client.post(
                        "https://oauth2.googleapis.com/token",
                        data={
                            "client_id": GOOGLE_CLIENT_ID,
                            "client_secret": GOOGLE_CLIENT_SECRET,
                            "code": code,
                            "grant_type": "authorization_code",
                            "redirect_uri": redirect_uri or GOOGLE_REDIRECT_URI
                        }
                    )
                    if token_resp.status_code == 200:
                        tok_data = token_resp.json()
                        access_token = tok_data.get("access_token")
                        userinfo_resp = client.get(
                            "https://www.googleapis.com/oauth2/v3/userinfo",
                            headers={"Authorization": f"Bearer {access_token}"}
                        )
                        if userinfo_resp.status_code == 200:
                            google_user_info = userinfo_resp.json()
            except Exception as e:
                print(f"[UNMASK Auth] Google code exchange error: {e}")

        if not google_user_info or "email" not in google_user_info:
            DatabaseService.create_auth_event(
                user_id=None,
                event_type="LOGIN_FAILED",
                provider="google",
                success=False,
                ip_hash=ip_hash,
                user_agent=user_agent,
                details={"error": "Google verification failed"}
            )
            raise ValueError("Google authentication could not be completed.")

        email = google_user_info.get("email", "").strip().lower()
        name = google_user_info.get("name", "Google User").strip() or "Google User"
        avatar = google_user_info.get("picture") or google_user_info.get("avatar") or f"https://api.dicebear.com/7.x/bottts/svg?seed={email}"
        google_sub = str(google_user_info.get("sub") or google_user_info.get("id") or f"google_{hashlib.sha256(email.encode()).hexdigest()[:16]}")

        user = DatabaseService.get_user_by_provider("google", google_sub)
        
        if not user:
            user = DatabaseService.get_user_by_email(email)
            if user:
                DatabaseService.link_auth_identity(
                    user_id=user["userId"],
                    provider="google",
                    provider_user_id=google_sub
                )
                DatabaseService.create_auth_event(
                    user_id=user["userId"],
                    event_type="GOOGLE_LINKED",
                    provider="google",
                    success=True,
                    ip_hash=ip_hash,
                    user_agent=user_agent,
                    details={"google_sub": google_sub, "email": email}
                )
            else:
                next_uid = DatabaseService.get_next_user_id("UNMASK-USER-")
                user = DatabaseService.create_user(
                    user_id=next_uid,
                    email=email,
                    password_hash=None,
                    display_name=name,
                    avatar_url=avatar,
                    role="USER",
                    is_email_verified=1,
                    auth_provider="google",
                    provider_user_id=google_sub
                )
                DatabaseService.create_auth_event(
                    user_id=next_uid,
                    event_type="ACCOUNT_CREATED",
                    provider="google",
                    success=True,
                    ip_hash=ip_hash,
                    user_agent=user_agent,
                    details={"email": email, "google_sub": google_sub}
                )

        DatabaseService.update_user_last_login(user["userId"], "google")
        DatabaseService.create_auth_event(
            user_id=user["userId"],
            event_type="GOOGLE_LOGIN",
            provider="google",
            success=True,
            ip_hash=ip_hash,
            user_agent=user_agent
        )

        token, expires_at = AuthService.create_session(user["userId"], user["role"], user_agent, ip_hash)
        profile = AuthService._format_user_profile(user)

        return {
            "token": token,
            "tokenType": "Bearer",
            "expiresAt": expires_at,
            "user": profile
        }

    @staticmethod
    def link_google_account(
        user_id: str,
        user_info: Dict[str, Any],
        ip_hash: str = "",
        user_agent: str = ""
    ) -> Dict[str, Any]:
        """Links a Google Identity to an existing UNMASK user account."""
        user = DatabaseService.get_user_by_user_id(user_id)
        if not user:
            raise ValueError("User not found.")

        email = user_info.get("email", "").strip().lower()
        if not email:
            raise ValueError("Google account email is required.")

        google_sub = str(user_info.get("sub") or user_info.get("id") or f"google_{hashlib.sha256(email.encode()).hexdigest()[:16]}")
        
        # Check if already linked to another account
        existing_owner = DatabaseService.get_user_by_provider("google", google_sub)
        if existing_owner and existing_owner["userId"] != user_id:
            raise ValueError("This Google account is already linked to another UNMASK user.")

        DatabaseService.link_auth_identity(
            user_id=user_id,
            provider="google",
            provider_user_id=google_sub
        )

        DatabaseService.create_auth_event(
            user_id=user_id,
            event_type="GOOGLE_LINKED",
            provider="google",
            success=True,
            ip_hash=ip_hash,
            user_agent=user_agent,
            details={"email": email, "google_sub": google_sub}
        )

        updated_user = DatabaseService.get_user_by_user_id(user_id)
        return AuthService._format_user_profile(updated_user)

    # ------------------------------------------------------------
    # 5. METAMASK SIGN-IN WITH ETHEREUM (SIWE)
    # ------------------------------------------------------------

    @staticmethod
    def get_metamask_nonce(wallet_address: Optional[str] = None) -> Dict[str, Any]:
        """Generates a cryptographically secure single-use SIWE nonce."""
        nonce = secrets.token_hex(16)
        DatabaseService.store_metamask_nonce(nonce=nonce, wallet_address=wallet_address, expires_in_seconds=300)
        return {
            "nonce": nonce,
            "domain": SIWE_DOMAIN,
            "uri": SIWE_URI,
            "chainId": SIWE_CHAIN_ID,
            "statement": "Sign in to UNMASK Cyber Threat Intelligence Platform.",
            "issuedAt": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

    @staticmethod
    def verify_metamask_auth(
        address: str,
        message: str,
        signature: str,
        role: Optional[str] = "USER",
        ip_hash: str = "",
        user_agent: str = ""
    ) -> Dict[str, Any]:
        """
        Verifies Ethereum cryptographic signature, validates SIWE nonce,
        and authenticates / registers the wallet user with role (USER or ADMIN).
        """
        clean_addr = address.strip().lower()
        if not clean_addr.startswith("0x") or len(clean_addr) != 42:
            raise ValueError("Invalid Ethereum wallet address format.")

        nonce_match = re.search(r"Nonce:\s*([a-zA-Z0-9]+)", message, re.IGNORECASE)
        if not nonce_match:
            raise ValueError("Authentication request expired or invalid message format.")

        nonce = nonce_match.group(1).strip()
        
        if not DatabaseService.verify_and_consume_metamask_nonce(nonce):
            raise ValueError("Authentication request expired. Please try again.")

        try:
            signable_msg = encode_defunct(text=message)
            recovered_address = Account.recover_message(signable_msg, signature=signature)
        except Exception as e:
            DatabaseService.create_auth_event(
                user_id=None,
                event_type="LOGIN_FAILED",
                provider="ethereum",
                success=False,
                ip_hash=ip_hash,
                user_agent=user_agent,
                details={"address": clean_addr, "error": str(e)}
            )
            raise ValueError("Wallet authentication failed.")

        if recovered_address.lower() != clean_addr:
            DatabaseService.create_auth_event(
                user_id=None,
                event_type="LOGIN_FAILED",
                provider="ethereum",
                success=False,
                ip_hash=ip_hash,
                user_agent=user_agent,
                details={"expected": clean_addr, "recovered": recovered_address.lower()}
            )
            raise ValueError("Wallet authentication failed.")

        target_role = (role or "USER").upper()
        if target_role not in ["ADMIN", "USER", "ANALYST"]:
            target_role = "USER"

        user = DatabaseService.get_user_by_wallet_address(clean_addr)
        if not user:
            prefix = "UNMASK-ADMIN-" if target_role == "ADMIN" else "UNMASK-USER-"
            next_uid = DatabaseService.get_next_user_id(prefix)
            checksum_addr = f"{clean_addr[:6]}...{clean_addr[-4:]}"
            display_title = "Admin Web3 Operator" if target_role == "ADMIN" else "Web3 Operator"
            
            user = DatabaseService.create_user(
                user_id=next_uid,
                email=None,
                password_hash=None,
                display_name=f"{display_title} ({checksum_addr})",
                avatar_url=f"https://api.dicebear.com/7.x/identicon/svg?seed={clean_addr}",
                role=target_role,
                is_email_verified=0,
                auth_provider="ethereum",
                provider_user_id=clean_addr,
                wallet_address=clean_addr,
                chain_id=SIWE_CHAIN_ID
            )
            DatabaseService.create_auth_event(
                user_id=next_uid,
                event_type="ACCOUNT_CREATED",
                provider="ethereum",
                success=True,
                ip_hash=ip_hash,
                user_agent=user_agent,
                details={"walletAddress": clean_addr, "role": target_role}
            )
        else:
            # If user already exists and is logging in through Admin Portal with target_role ADMIN
            if target_role == "ADMIN" and user.get("role") != "ADMIN":
                from backend.database import get_db_connection
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("UPDATE users SET role = 'ADMIN' WHERE user_id = ?", (user["userId"],))
                conn.commit()
                conn.close()
                user["role"] = "ADMIN"

        DatabaseService.update_user_last_login(user["userId"], "ethereum")
        DatabaseService.create_auth_event(
            user_id=user["userId"],
            event_type="METAMASK_LOGIN",
            provider="ethereum",
            success=True,
            ip_hash=ip_hash,
            user_agent=user_agent,
            details={"walletAddress": clean_addr, "role": user.get("role")}
        )

        token, expires_at = AuthService.create_session(user["userId"], user["role"], user_agent, ip_hash)
        profile = AuthService._format_user_profile(user)

        return {
            "token": token,
            "tokenType": "Bearer",
            "expiresAt": expires_at,
            "user": profile
        }

    @staticmethod
    def link_metamask_wallet(
        user_id: str,
        address: str,
        message: str,
        signature: str,
        ip_hash: str = "",
        user_agent: str = ""
    ) -> Dict[str, Any]:
        """Links an Ethereum wallet to an existing authenticated user account."""
        clean_addr = address.strip().lower()
        
        existing_owner = DatabaseService.get_user_by_wallet_address(clean_addr)
        if existing_owner and existing_owner["userId"] != user_id:
            raise ValueError("This wallet address is already linked to another UNMASK account.")

        nonce_match = re.search(r"Nonce:\s*([a-zA-Z0-9]+)", message, re.IGNORECASE)
        if not nonce_match:
            raise ValueError("Authentication request expired.")

        nonce = nonce_match.group(1).strip()
        if not DatabaseService.verify_and_consume_metamask_nonce(nonce):
            raise ValueError("Authentication request expired. Please try again.")

        try:
            signable_msg = encode_defunct(text=message)
            recovered_address = Account.recover_message(signable_msg, signature=signature)
        except Exception:
            raise ValueError("Wallet authentication failed.")

        if recovered_address.lower() != clean_addr:
            raise ValueError("Wallet authentication failed.")

        DatabaseService.link_auth_identity(
            user_id=user_id,
            provider="ethereum",
            provider_user_id=clean_addr,
            wallet_address=clean_addr,
            chain_id=SIWE_CHAIN_ID
        )

        DatabaseService.create_auth_event(
            user_id=user_id,
            event_type="WALLET_LINKED",
            provider="ethereum",
            success=True,
            ip_hash=ip_hash,
            user_agent=user_agent,
            details={"walletAddress": clean_addr}
        )

        user = DatabaseService.get_user_by_user_id(user_id)
        return AuthService._format_user_profile(user)

    # ------------------------------------------------------------
    # 6. USER PROFILE FORMATTER & PROVIDERS
    # ------------------------------------------------------------

    @staticmethod
    def _format_user_profile(user: Dict[str, Any]) -> Dict[str, Any]:
        """Formats safe public user object with connected authentication providers."""
        identities = DatabaseService.get_user_identities(user["userId"])
        connected_providers = [i["provider"] for i in identities]
        wallet_identity = next((i for i in identities if i["provider"] == "ethereum"), None)

        return {
            "id": user["id"],
            "userId": user["userId"],
            "email": user["email"],
            "displayName": user["displayName"],
            "avatarUrl": user["avatarUrl"],
            "role": user["role"],
            "isEmailVerified": user["isEmailVerified"],
            "isActive": user["isActive"],
            "createdAt": user["createdAt"],
            "updatedAt": user["updatedAt"],
            "lastLoginAt": user["lastLoginAt"],
            "connectedProviders": list(set(connected_providers)),
            "connectedWallet": wallet_identity["walletAddress"] if wallet_identity else None,
            "walletChainId": wallet_identity["chainId"] if wallet_identity else None
        }
