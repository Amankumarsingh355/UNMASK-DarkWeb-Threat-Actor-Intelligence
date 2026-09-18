// ============================================================
// UNMASK // PRODUCTION AUTHENTICATION VIEW (LOGIN)
// Supports Google OAuth, MetaMask SIWE, User ID / Email + Password
// ============================================================

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Wallet,
  Globe,
  Radio,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { GoogleSignInModal } from '../components/Auth/GoogleSignInModal';
import { MatrixBinaryBackground } from '../components/CitizenPortal/MatrixBinaryBackground';
import type { GoogleAuthPayload, UserProfile } from '../types/auth';

interface LoginViewProps {
  onLoginSuccess: (user?: UserProfile) => void;
  onNavigateToRegister: () => void;
  onNavigateToAdminLogin?: () => void;
  onNavigateHome: () => void;
  theme?: 'dark' | 'light';
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToAdminLogin,
  onNavigateHome,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const { login, loginWithMetaMask, loginWithGoogle } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Email / User ID Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both User ID / Email and Password.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Authenticating credentials with UNMASK Security Node...');

    try {
      const result = await login(identifier, password);
      if (result.success && result.user) {
        setIsSuccess(true);
        setLoadingStep('Authentication Granted • Loading Dashboard...');
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(result.user);
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMessage(result.error || 'Invalid User ID or password.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Login failed.');
    }
  };

  // MetaMask SIWE Login (Role: USER)
  const handleMetaMaskLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingStep('Connecting MetaMask... Please approve the login request in your wallet.');

    try {
      const result = await loginWithMetaMask('USER');
      if (result.success && result.user) {
        setIsSuccess(true);
        setLoadingStep('Wallet verified. Signing into your User Profile...');
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(result.user);
        }, 600);
      } else {
        setIsLoading(false);
        setErrorMessage(result.error || 'Wallet authentication failed.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'MetaMask login failed.');
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = () => {
    setErrorMessage(null);
    setIsGoogleModalOpen(true);
  };

  // Handle Google Account Selection
  const handleSelectGoogleAccount = async (payload: GoogleAuthPayload) => {
    setIsLoading(true);
    setLoadingStep('Authenticating Google identity with UNMASK Security Node...');

    try {
      const result = await loginWithGoogle(payload);
      if (result.success && result.user) {
        setIsSuccess(true);
        setLoadingStep('Google Identity Verified • Loading Workspace...');
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(result.user);
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMessage(result.error || 'Google authentication failed.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Google authentication could not be completed.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors relative overflow-x-hidden ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#020408] text-white'
    }`}>
      {/* Dynamic Matrix Rain Canvas */}
      <MatrixBinaryBackground isLight={isLight} opacity={0.85} />

      {/* Top Header / Back Navigation */}
      <header className={`h-16 px-6 flex items-center justify-between border-b backdrop-blur-xl relative z-20 ${
        isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#02050c]/90 border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
      }`}>
        <button
          onClick={onNavigateHome}
          className={`flex items-center space-x-2 text-xs font-mono font-bold transition-colors cursor-pointer ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-cyan-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to UNMASK Public Portal</span>
        </button>

        <div className="flex items-center space-x-3">
          {onNavigateToAdminLogin && (
            <button
              onClick={onNavigateToAdminLogin}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center space-x-1.5 transition-all cursor-pointer ${
                isLight 
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' 
                  : 'matrix-glass-interactive bg-rose-950/30 border-rose-500/40 text-rose-300 hover:bg-rose-900/50'
              }`}
              title="Admin Command Gateway"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Gateway →</span>
            </button>
          )}

          <div className="flex items-center space-x-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
            <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
              USER-GATEWAY
            </span>
          </div>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4 relative z-10">
        <div className="w-full max-w-md space-y-5">
          {/* Brand Logo & Security Header */}
          <div className="text-center space-y-2.5">
            <button
              onClick={onNavigateHome}
              className="inline-block mx-auto group cursor-pointer focus:outline-none"
              title="UNMASK - Return to Home"
            >
              <div className={`w-14 h-14 rounded-2xl p-1 flex items-center justify-center mx-auto transition-transform group-hover:scale-105 ${
                isLight
                  ? 'bg-white border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                  : 'bg-gradient-to-br from-[#0a1829] to-[#040a14] border border-cyan-400/60 shadow-[0_0_22px_rgba(6,182,212,0.5)]'
              }`}>
                <img 
                  src="/unmask-logo.png" 
                  alt="UNMASK Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </button>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <span className={`font-display-tactical text-2xl font-black tracking-widest ${
                  isLight ? 'text-slate-900' : 'text-white matrix-glow-text'
                }`}>
                  USER LOGIN
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider font-mono ${
                  isLight
                    ? 'bg-[#cffafe] text-[#0e7490] border border-cyan-300 shadow-xs'
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                }`}>
                  INVESTIGATOR / CITIZEN
                </span>
              </div>
              <p className={`text-xs mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Sign in with MetaMask SIWE, Google, or User ID / Email
              </p>
            </div>
          </div>

          {/* Login Card Form */}
          <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl relative overflow-hidden ${
            isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
          }`}>
            {/* Top Glowing Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300"></div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-semibold flex items-center space-x-2.5 animate-in shake duration-300 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success State Banner */}
            {isSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center space-x-2.5 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Authentication successful! Access Granted.</span>
              </div>
            )}

            {/* Social & Web3 Quick Sign-in Buttons */}
            <div className="space-y-2.5">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-xs'
                    : 'matrix-glass-interactive border-cyan-500/30 text-cyan-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* MetaMask SIWE Button */}
              <button
                type="button"
                onClick={handleMetaMaskLogin}
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                    : 'matrix-glass-interactive border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                }`}
              >
                <span className="text-sm">🦊</span>
                <span>Login with MetaMask SIWE</span>
              </button>
            </div>

            {/* Divider OR */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isLight ? 'border-slate-200' : 'border-cyan-500/20'}`}></div>
              </div>
              <span className={`relative px-3 text-[10px] uppercase font-bold tracking-wider font-mono ${
                isLight ? 'bg-white text-slate-400' : 'bg-[#06101d] text-cyan-400/70'
              }`}>
                OR SECURE CREDENTIALS
              </span>
            </div>

            {/* Email / User ID + Password Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-3.5 font-sans">
              {/* Identifier Field */}
              <div className="space-y-1">
                <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  User ID / Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="UNMASK-USER-000001 or email"
                    disabled={isLoading}
                    autoFocus
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-mono transition-all outline-hidden ${
                      isLight 
                        ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isLoading}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs font-mono transition-all outline-hidden ${
                      isLight 
                        ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-2 font-mono ${
                  isLight
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
                    : 'matrix-button-primary'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="truncate">{loadingStep || 'Verifying...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>AUTHENTICATE & ENTER</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Create Account Link Footer */}
            <div className={`mt-4 pt-3.5 border-t text-center space-y-2.5 ${isLight ? 'border-slate-200' : 'border-cyan-500/20'}`}>
              <div className="flex items-center justify-center space-x-1 text-xs font-mono">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  Don't have an account?
                </span>
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>CREATE ACCOUNT</span>
                </button>
              </div>

              {/* Switch to Admin Login Gateway */}
              {onNavigateToAdminLogin && (
                <button
                  type="button"
                  onClick={onNavigateToAdminLogin}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-mono flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isLight
                      ? 'bg-rose-50/60 hover:bg-rose-100 border-rose-200 text-rose-800'
                      : 'matrix-glass-interactive bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-400'
                  }`}
                  title="Switch to Admin Command Gateway"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Defense Analysts: Switch to Admin Gateway</span>
                </button>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center text-[10px] text-slate-500 space-y-0.5 font-mono">
            <p>UNMASK DEFENSIVE CYBER OPERATIONS // AUTHENTICATED GATEWAY</p>
            <p>All authentication attempts are cryptographically verified and recorded.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`h-11 px-6 flex items-center justify-between text-[11px] font-mono border-t relative z-20 ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#02050c]/90 border-cyan-500/20 text-slate-500'
      }`}>
        <span>UNMASK Security Layer v4.5</span>
        <span>Argon2id & SIWE Certified</span>
      </footer>

      {/* Google Identity Services Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectGoogleAccount={handleSelectGoogleAccount}
        theme={theme}
      />
    </div>
  );
};

