// ============================================================
// UNMASK // CENTRAL AUTHENTICATION CONTEXT & PROVIDER
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, AuthLoginResult, GoogleAuthPayload } from '../types/auth';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<AuthLoginResult>;
  register: (email: string, password: string, displayName: string, userId?: string) => Promise<AuthLoginResult>;
  loginWithMetaMask: (role?: 'USER' | 'ADMIN') => Promise<AuthLoginResult>;
  linkMetaMask: () => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  loginWithGoogle: (payload: GoogleAuthPayload) => Promise<AuthLoginResult>;
  linkGoogle: (payload: GoogleAuthPayload) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = Boolean(user && AuthService.isAuthenticated());
  const isAdmin = Boolean(user && user.role === 'ADMIN');

  // Verify and refresh session on initial application load
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      if (AuthService.isAuthenticated()) {
        const freshUser = await AuthService.getMe();
        setUser(freshUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('[UNMASK AuthProvider] Session verification error:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (identifier: string, password: string): Promise<AuthLoginResult> => {
    setIsLoading(true);
    const result = await AuthService.login(identifier, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const register = async (email: string, password: string, displayName: string, userId?: string): Promise<AuthLoginResult> => {
    setIsLoading(true);
    const result = await AuthService.register(email, password, displayName, userId);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const loginWithMetaMask = async (role: 'USER' | 'ADMIN' = 'USER'): Promise<AuthLoginResult> => {
    setIsLoading(true);
    const result = await AuthService.loginWithMetaMask(role);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const linkMetaMask = async () => {
    const result = await AuthService.linkMetaMaskWallet();
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const loginWithGoogle = async (payload: GoogleAuthPayload): Promise<AuthLoginResult> => {
    setIsLoading(true);
    const result = await AuthService.verifyGoogleAuth(payload);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const linkGoogle = async (payload: GoogleAuthPayload) => {
    const result = await AuthService.linkGoogleAccount(payload);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    setIsLoading(true);
    await AuthService.logout();
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        register,
        loginWithMetaMask,
        linkMetaMask,
        loginWithGoogle,
        linkGoogle,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
