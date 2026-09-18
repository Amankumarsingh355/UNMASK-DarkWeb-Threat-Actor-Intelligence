// ============================================================
// UNMASK // PRODUCTION AUTHENTICATION SERVICE & SESSION MANAGER
// Supports Google OAuth, User ID + Password, MetaMask SIWE
// ============================================================

import type { UserProfile, AuthLoginResult, AuthEvent, SiweNonceData, GoogleAuthPayload } from '../types/auth';

const TOKEN_KEY = 'unmask_admin_auth_token';
const USER_KEY = 'unmask_admin_user_profile';
const API_BASE_URL = 'http://localhost:8000/api/auth';

// Declare Ethereum window extension interface
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
      on?: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export class AuthService {
  /**
   * Checks if an authenticated session token exists.
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    return Boolean(token && token.trim().length > 0);
  }

  /**
   * Retrieves the active Bearer token.
   */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Retrieves cached user profile from localStorage.
   */
  static getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  /**
   * Validates active session with the backend API and refreshes stored user profile.
   */
  static async getMe(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: AbortSignal.timeout(4000)
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearSession();
        }
        return null;
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const userObj = (resData.data.user || resData.data) as UserProfile;
        localStorage.setItem(USER_KEY, JSON.stringify(userObj));
        return userObj;
      }
      return null;
    } catch (e) {
      console.warn('[UNMASK Auth] Could not refresh session from backend:', e);
      return this.getCurrentUser();
    }
  }

  /**
   * Authenticates user via User ID or Email + Password.
   */
  static async login(identifier: string, password: string): Promise<AuthLoginResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim()
        }),
        signal: AbortSignal.timeout(6000)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        const errorMsg = resData?.detail || resData?.error?.message || 'Invalid User ID or password.';
        return { success: false, error: errorMsg };
      }

      const { token, user } = resData.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return {
        success: true,
        token,
        user
      };
    } catch (e: any) {
      console.error('[UNMASK Auth] Login network error:', e);
      return { success: false, error: 'Network connection failed. Please ensure the backend server is running.' };
    }
  }

  /**
   * Registers a new standard UNMASK user account.
   */
  static async register(
    email: string,
    password: string,
    displayName: string,
    userId?: string
  ): Promise<AuthLoginResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          displayName: displayName.trim(),
          userId: userId?.trim() || undefined
        }),
        signal: AbortSignal.timeout(6000)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        const errorMsg = resData?.detail || resData?.error?.message || 'Registration failed.';
        return { success: false, error: errorMsg };
      }

      const { token, user } = resData.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return {
        success: true,
        token,
        user
      };
    } catch (e: any) {
      console.error('[UNMASK Auth] Registration network error:', e);
      return { success: false, error: 'Network connection failed. Please ensure the backend server is running.' };
    }
  }

  /**
   * Requests a single-use SIWE nonce from backend.
   */
  static async getMetaMaskNonce(walletAddress?: string): Promise<SiweNonceData> {
    const response = await fetch(`${API_BASE_URL}/metamask/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: walletAddress || null }),
      signal: AbortSignal.timeout(5000)
    });

    const resData = await response.json();
    if (!response.ok || !resData.success) {
      throw new Error(resData?.detail || 'Failed to generate authentication nonce.');
    }
    return resData.data as SiweNonceData;
  }

  /**
   * Real Sign-In with Ethereum (SIWE) using MetaMask.
   * Supports role specification for citizen ('USER') and defense command ('ADMIN').
   */
  static async loginWithMetaMask(role: 'USER' | 'ADMIN' = 'USER'): Promise<AuthLoginResult> {
    if (typeof window === 'undefined' || !window.ethereum) {
      return {
        success: false,
        error: 'MetaMask extension was not detected. Please install MetaMask to login with your wallet.'
      };
    }

    try {
      // 1. Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        return { success: false, error: 'No Ethereum account selected in MetaMask.' };
      }

      const selectedAddress = accounts[0];

      // 2. Fetch single-use cryptographic nonce
      const nonceData = await this.getMetaMaskNonce(selectedAddress);

      // 3. Format standard SIWE message (EIP-4361 standard)
      const roleStatement = role === 'ADMIN'
        ? 'Sign in with Administrator clearance to UNMASK Cyber Threat Intelligence Command Center.'
        : (nonceData.statement || 'Sign in to UNMASK Cyber Threat Intelligence Platform.');

      const siweMessage = 
        `${nonceData.domain} wants you to sign in with your Ethereum account:\n` +
        `${selectedAddress}\n\n` +
        `${roleStatement}\n\n` +
        `URI: ${nonceData.uri}\n` +
        `Version: 1\n` +
        `Chain ID: ${nonceData.chainId}\n` +
        `Nonce: ${nonceData.nonce}\n` +
        `Issued At: ${nonceData.issuedAt}`;

      // 4. Request cryptographic personal_sign signature
      let signature: string;
      try {
        signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [siweMessage, selectedAddress]
        });
      } catch (signErr: any) {
        if (signErr?.code === 4001 || signErr?.message?.includes('reject') || signErr?.message?.includes('User rejected')) {
          return { success: false, error: 'Wallet signature was rejected.' };
        }
        return { success: false, error: 'Wallet signature failed or was cancelled.' };
      }

      // 5. Send verification payload to backend with target role
      const verifyResp = await fetch(`${API_BASE_URL}/metamask/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: selectedAddress,
          message: siweMessage,
          signature: signature,
          role: role
        }),
        signal: AbortSignal.timeout(6000)
      });

      const verifyData = await verifyResp.json();
      if (!verifyResp.ok || !verifyData.success) {
        return { success: false, error: verifyData?.detail || 'Wallet authentication failed.' };
      }

      const { token, user } = verifyData.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return {
        success: true,
        token,
        user
      };
    } catch (e: any) {
      console.error('[UNMASK Auth] MetaMask SIWE error:', e);
      return { success: false, error: e.message || 'MetaMask authentication failed.' };
    }
  }

  /**
   * Links a MetaMask wallet to the currently authenticated UNMASK account.
   */
  static async linkMetaMaskWallet(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      return { success: false, error: 'MetaMask extension was not detected.' };
    }

    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'User is not logged in.' };
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        return { success: false, error: 'No Ethereum account selected.' };
      }

      const address = accounts[0];
      const nonceData = await this.getMetaMaskNonce(address);

      const siweMessage = 
        `${nonceData.domain} wants you to sign in with your Ethereum account:\n` +
        `${address}\n\n` +
        `${nonceData.statement}\n\n` +
        `URI: ${nonceData.uri}\n` +
        `Version: 1\n` +
        `Chain ID: ${nonceData.chainId}\n` +
        `Nonce: ${nonceData.nonce}\n` +
        `Issued At: ${nonceData.issuedAt}`;

      let signature: string;
      try {
        signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [siweMessage, address]
        });
      } catch {
        return { success: false, error: 'Wallet signature was rejected.' };
      }

      const response = await fetch(`${API_BASE_URL}/metamask/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address,
          message: siweMessage,
          signature
        }),
        signal: AbortSignal.timeout(6000)
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, error: resData?.detail || 'Failed to link wallet.' };
      }

      localStorage.setItem(USER_KEY, JSON.stringify(resData.data));
      return { success: true, user: resData.data };
    } catch (e: any) {
      return { success: false, error: e.message || 'Wallet linking failed.' };
    }
  }

  /**
   * Fetches Google OAuth authorization URL.
   */
  static async getGoogleAuthUrl(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/url`, { signal: AbortSignal.timeout(4000) });
      const resData = await response.json();
      return resData?.data?.url || '';
    } catch {
      return '';
    }
  }

  /**
   * Verifies Google token, code, or identity profile.
   */
  static async verifyGoogleAuth(payload: GoogleAuthPayload): Promise<AuthLoginResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/google/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000)
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, error: resData?.detail || 'Google authentication could not be completed.' };
      }

      const { token, user } = resData.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return { success: true, token, user };
    } catch (e: any) {
      return { success: false, error: e.message || 'Google authentication failed.' };
    }
  }

  /**
   * Helper alias for Google login.
   */
  static async loginWithGoogle(payload: GoogleAuthPayload): Promise<AuthLoginResult> {
    return this.verifyGoogleAuth(payload);
  }

  /**
   * Links a Google Account to the currently authenticated UNMASK account.
   */
  static async linkGoogleAccount(payload: GoogleAuthPayload): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'User is not logged in.' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/google/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000)
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        return { success: false, error: resData?.detail || 'Failed to link Google account.' };
      }

      localStorage.setItem(USER_KEY, JSON.stringify(resData.data));
      return { success: true, user: resData.data };
    } catch (e: any) {
      return { success: false, error: e.message || 'Google account linking failed.' };
    }
  }

  /**
   * Fetches user's authentication and security audit trail.
   */
  static async getAuthEvents(limit: number = 50): Promise<AuthEvent[]> {
    const token = this.getToken();
    if (!token) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/events?limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(4000)
      });

      if (!response.ok) return [];
      const resData = await response.json();
      return (resData?.data || []) as AuthEvent[];
    } catch {
      return [];
    }
  }

  /**
   * Fetches admin audit logs for all users (Admin only).
   */
  static async getAdminAuditLogs(limit: number = 100, offset: number = 0): Promise<{ events: AuthEvent[]; totalCount: number }> {
    const token = this.getToken();
    if (!token) return { events: [], totalCount: 0 };

    try {
      const response = await fetch(`${API_BASE_URL}/admin/audit-logs?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) return { events: [], totalCount: 0 };
      const resData = await response.json();
      return resData?.data || { events: [], totalCount: 0 };
    } catch {
      return { events: [], totalCount: 0 };
    }
  }

  /**
   * Logs out user and invalidates session.
   */
  static async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          signal: AbortSignal.timeout(2000)
        });
      } catch {
        // ignore offline error
      }
    }
    this.clearSession();
  }

  /**
   * Clears local authentication state.
   */
  static clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

// Backward compatibility alias for legacy imports
export const AdminAuthService = AuthService;
