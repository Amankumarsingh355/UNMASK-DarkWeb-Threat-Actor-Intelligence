// ============================================================
// UNMASK // PRODUCTION USER PROFILE & IDENTITY VIEW
// Displays User ID, Connected Accounts (Password, Google, MetaMask),
// Wallet Linking via SIWE, and Authentication Audit Trail
// ============================================================

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Key, 
  ShieldCheck, 
  Wallet, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Shield, 
  RefreshCw, 
  Lock, 
  Sparkles,
  Layers,
  ArrowRight,
  AlertTriangle,
  History,
  Activity,
  LogOut,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../services/authService';
import { GoogleSignInModal } from '../components/Auth/GoogleSignInModal';
import type { AuthEvent, GoogleAuthPayload } from '../types/auth';

interface UserProfileViewProps {
  onNavigateHome?: () => void;
  onNavigateToDashboard?: () => void;
  theme?: 'dark' | 'light';
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onNavigateHome,
  onNavigateToDashboard,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const { user, logout, linkMetaMask, linkGoogle, refreshUser } = useAuth();

  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLinkingWallet, setIsLinkingWallet] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Format date safely
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Not recorded';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return isoString;
    }
  };

  // Fetch user audit events
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    setIsLoadingEvents(true);

    AuthService.getAuthEvents(30)
      .then(res => {
        if (isMounted) {
          setEvents(res);
          setIsLoadingEvents(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingEvents(false);
      });

    return () => { isMounted = false; };
  }, [user]);

  // Connect & Link MetaMask Wallet
  const handleLinkMetaMask = async () => {
    setLinkError(null);
    setLinkSuccess(false);
    setIsLinkingWallet(true);

    try {
      const result = await linkMetaMask();
      if (result.success) {
        setLinkSuccess(true);
        await refreshUser();
      } else {
        setLinkError(result.error || 'Failed to connect MetaMask wallet.');
      }
    } catch (err: any) {
      setLinkError(err.message || 'MetaMask connection failed.');
    } finally {
      setIsLinkingWallet(false);
    }
  };

  // Connect & Link Google Account
  const handleLinkGoogle = async (payload: GoogleAuthPayload) => {
    setLinkError(null);
    setLinkSuccess(false);

    try {
      const result = await linkGoogle(payload);
      if (result.success) {
        setLinkSuccess(true);
        await refreshUser();
      } else {
        setLinkError(result.error || 'Failed to link Google account.');
      }
    } catch (err: any) {
      setLinkError(err.message || 'Google account linking failed.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono">
        <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
        <p className="text-sm font-bold text-slate-300">Please login to view your profile.</p>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
        >
          Return to Portal
        </button>
      </div>
    );
  }

  const hasPasswordAuth = user.connectedProviders.includes('password');
  const hasGoogleAuth = user.connectedProviders.includes('google');
  const hasEthereumAuth = user.connectedProviders.includes('ethereum') || Boolean(user.connectedWallet);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Top Breadcrumb / Return Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-md matrix-glow-badge text-xs font-mono font-bold uppercase">
            USER IDENTITY & CREDENTIALS
          </span>
          <span className="text-cyan-500/50 text-xs">•</span>
          <span className="text-xs text-slate-400 font-mono">UNMASK Security Gateway</span>
        </div>

        {onNavigateToDashboard && user.role === 'ADMIN' && (
          <button
            onClick={onNavigateToDashboard}
            className="px-3 py-1.5 rounded-lg matrix-button-secondary font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer glitch-hover"
          >
            <span>Command Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Profile Header Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl relative overflow-hidden ${
        isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
      }`}>
        {/* Glowing Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 shadow-[0_0_12px_#00ffff]"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex items-start space-x-4 sm:space-x-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cyan-950/60 border-2 border-cyan-400 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-cyan-400" />
                )}
              </div>
              <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider font-mono ${
                user.role === 'ADMIN'
                  ? 'bg-rose-500 text-white shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                  : 'bg-emerald-400 text-black shadow-[0_0_8px_rgba(52,211,153,0.6)]'
              }`}>
                {user.role}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h1 className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white matrix-glow-text'
                }`}>
                  {user.displayName}
                </h1>
                {user.isEmailVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-semibold flex items-center gap-1 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 font-bold">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>User ID: <strong className="text-white font-mono">{user.userId}</strong></span>
              </div>

              {user.email && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Account Metrics Strip */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 font-mono text-xs">
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive'}`}>
              <span className="text-[10px] text-slate-400 uppercase block font-mono">ACCOUNT CREATED</span>
              <span className="text-slate-200 font-bold text-xs mt-0.5 block">
                {formatDate(user.createdAt).split(',')[0]}
              </span>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive'}`}>
              <span className="text-[10px] text-slate-400 uppercase block font-mono">LAST LOGIN</span>
              <span className="text-emerald-400 font-bold text-xs mt-0.5 block shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                {formatDate(user.lastLoginAt).split(',')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns for Connected Auth & Connected Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Connected Authentication Methods */}
        <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
        }`}>
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 matrix-glow-text">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>AUTHENTICATION METHODS</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Multi-Provider</span>
          </div>

          <div className="space-y-3">
            {/* Email / Password Status */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              hasPasswordAuth 
                ? (isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive border-cyan-500/30')
                : (isLight ? 'bg-slate-100/50 border-slate-200 text-slate-400' : 'bg-[#040c1a]/50 border-slate-800 text-slate-500')
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${hasPasswordAuth ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Email & Password</div>
                  <div className="text-[11px] text-slate-400 font-mono">Argon2id Cryptographic Hash</div>
                </div>
              </div>

              <div>
                {hasPasswordAuth ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Not Configured</span>
                )}
              </div>
            </div>

            {/* Google OAuth Status */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              hasGoogleAuth 
                ? (isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive border-cyan-500/30')
                : (isLight ? 'bg-slate-100/50 border-slate-200 text-slate-400' : 'bg-[#040c1a]/50 border-slate-800 text-slate-500')
            }`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Google OAuth</div>
                  <div className="text-[11px] text-slate-400 font-mono">OpenID Connect Protocol</div>
                </div>
              </div>

              <div>
                {hasGoogleAuth ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <button
                    onClick={() => setIsGoogleModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg matrix-button-primary font-mono text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 glitch-hover"
                  >
                    <span>Link Google</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* MetaMask SIWE Status */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              hasEthereumAuth 
                ? (isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive border-amber-500/30')
                : (isLight ? 'bg-slate-100/50 border-slate-200 text-slate-400' : 'bg-[#040c1a]/50 border-slate-800 text-slate-500')
            }`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <span className="text-base">🦊</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">MetaMask (SIWE)</div>
                  <div className="text-[11px] text-slate-400 font-mono">Sign-In with Ethereum EIP-4361</div>
                </div>
              </div>

              <div>
                {hasEthereumAuth ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Not Linked</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Connected Crypto Wallet (SIWE) */}
        <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
        }`}>
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>CONNECTED WALLET</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Web3 Security</span>
          </div>

          {linkError && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono font-semibold flex items-center space-x-2 animate-in shake duration-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{linkError}</span>
            </div>
          )}

          {linkSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>MetaMask wallet connected and verified successfully!</span>
            </div>
          )}

          {user.connectedWallet ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#040c1a]/90 border border-amber-500/40 space-y-2 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Active Ethereum Address</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                    Chain ID: {user.walletChainId || 1} (Ethereum)
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-amber-300 break-all">
                  {user.connectedWallet}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                <span>Cryptographic verification: <strong className="text-cyan-400">SIWE EIP-4361</strong></span>
                <button
                  onClick={handleLinkMetaMask}
                  disabled={isLinkingWallet}
                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isLinkingWallet ? 'Re-signing...' : 'Change Wallet'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-5 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                🦊
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 font-mono">No Wallet Connected</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Link your Ethereum address to enable passwordless Web3 login and forensic signing.
                </p>
              </div>

              <button
                onClick={handleLinkMetaMask}
                disabled={isLinkingWallet}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-mono text-xs font-bold transition-all flex items-center space-x-2 mx-auto cursor-pointer disabled:opacity-50 shadow-lg shadow-amber-500/25 glitch-hover"
              >
                {isLinkingWallet ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sign in MetaMask...</span>
                  </>
                ) : (
                  <>
                    <span>🦊</span>
                    <span>Connect MetaMask</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login & Security Audit Trail Section */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${
        isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
      }`}>
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            <History className="w-4 h-4 text-purple-400" />
            <span>LOGIN & SECURITY AUDIT TRAIL</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Immutable Records</span>
        </div>

        {isLoadingEvents ? (
          <div className="py-8 flex items-center justify-center space-x-2 text-slate-400 font-mono text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading security events...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 font-mono">
            No audit events recorded for this session yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-cyan-500/20 text-[11px] text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Auth Provider</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">IP Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {events.map((ev, idx) => (
                  <tr key={ev.id || idx} className="hover:bg-cyan-500/10 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-200">
                      {ev.eventType}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] uppercase font-bold">
                        {ev.provider}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {ev.success ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                          <XCircle className="w-3.5 h-3.5" /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      {formatDate(ev.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400/80 text-[11px] font-mono">
                      {ev.ipHash || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Logout Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-cyan-400/70 font-mono">UNMASK Session Active</span>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.2)] glitch-hover"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Terminate Session (Logout)</span>
        </button>
      </div>

      {/* Google Identity Linking Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectGoogleAccount={handleLinkGoogle}
        isLinking={true}
        theme={theme}
      />
    </div>
  );
};
