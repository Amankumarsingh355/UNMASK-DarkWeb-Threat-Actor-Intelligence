// ============================================================
// UNMASK // AUTHENTICATION & USER IDENTITY TYPE DEFINITIONS
// ============================================================

export type UserRole = 'ADMIN' | 'ANALYST' | 'USER';

export type AuthProviderType = 'password' | 'google' | 'ethereum';

export type AuthEventType = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'GOOGLE_LOGIN'
  | 'METAMASK_LOGIN'
  | 'ACCOUNT_CREATED'
  | 'LOGOUT'
  | 'WALLET_LINKED'
  | 'GOOGLE_LINKED';

export interface UserProfile {
  id: number | string;
  userId: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  connectedProviders: AuthProviderType[];
  connectedWallet: string | null;
  walletChainId?: number | null;

  // Legacy compatibility fields
  adminId?: string;
  name?: string;
  clearanceLevel?: string;
  agency?: string;
  lastLogin?: string;
}

export interface AuthIdentity {
  id: number;
  userId: string;
  provider: AuthProviderType;
  providerUserId: string;
  walletAddress: string | null;
  chainId: number | null;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface AuthEvent {
  id: string;
  userId: string | null;
  eventType: AuthEventType;
  provider: string;
  success: boolean;
  createdAt: string;
  ipHash: string;
  userAgent: string;
  details?: Record<string, any>;
}

export interface AuthLoginResult {
  success: boolean;
  token?: string;
  user?: UserProfile;
  error?: string;
}

export interface SiweNonceData {
  nonce: string;
  domain: string;
  uri: string;
  chainId: number;
  statement: string;
  issuedAt: string;
}

export interface GoogleAuthPayload {
  idToken?: string;
  code?: string;
  redirectUri?: string;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
}
