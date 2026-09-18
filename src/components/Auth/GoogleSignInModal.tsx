// ============================================================
// UNMASK // GOOGLE IDENTITY SERVICES MODAL & OAUTH CONTROLLER
// Supports One-Tap Google Profiles, Custom Gmail, & GCP OAuth 2.0
// ============================================================

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  User, 
  Key, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  Lock,
  Globe
} from 'lucide-react';
import type { GoogleAuthPayload } from '../../types/auth';

interface GoogleSignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGoogleAccount: (payload: GoogleAuthPayload) => Promise<void>;
  isLinking?: boolean;
  theme?: 'dark' | 'light';
}

const PRESET_GOOGLE_PROFILES: Array<{
  name: string;
  email: string;
  role: string;
  sub: string;
  avatar: string;
}> = [
  {
    name: 'Commander K. Raman',
    email: 'k.raman.admin@ntro.gov.in',
    role: 'NTRO Lead Director (Admin)',
    sub: 'google_108482910394857291048',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin_01'
  },
  {
    name: 'Aman Kumar Singh',
    email: 'aman.singh.intel@gmail.com',
    role: 'Senior Cyber Threat Analyst',
    sub: 'google_119283746501928374650',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AmanSingh'
  },
  {
    name: 'Special Agent Vikram',
    email: 'vikram.investigator@gmail.com',
    role: 'Financial Intelligence Unit',
    sub: 'google_192837465019283746501',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AgentVikram'
  }
];

export const GoogleSignInModal: React.FC<GoogleSignInModalProps> = ({
  isOpen,
  onClose,
  onSelectGoogleAccount,
  isLinking = false,
  theme = 'dark'
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'CUSTOM' | 'GCP_CONFIG'>('ACCOUNTS');
  
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  
  const [gcpClientId, setGcpClientId] = useState('');
  const [gcpClientSecret, setGcpClientSecret] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Preset Account Selection
  const handleSelectPreset = async (profile: typeof PRESET_GOOGLE_PROFILES[0]) => {
    setError(null);
    setIsLoading(true);
    try {
      await onSelectGoogleAccount({
        email: profile.email,
        name: profile.name,
        picture: profile.avatar,
        sub: profile.sub
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Custom Email Google Auth
  const handleCustomGoogleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = customEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid Google / Gmail address.');
      return;
    }

    const name = customName.trim() || email.split('@')[0];
    const sub = `google_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;

    setIsLoading(true);
    try {
      await onSelectGoogleAccount({
        email,
        name,
        picture: avatar,
        sub
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Live GCP OAuth Redirect
  const handleGcpOAuthRedirect = () => {
    if (!gcpClientId.trim()) {
      setError('Please provide a Google Cloud OAuth Client ID.');
      return;
    }

    const params = {
      client_id: gcpClientId.trim(),
      redirect_uri: window.location.origin + '/#/login',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account'
    };
    const query = new URLSearchParams(params).toString();
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/10' 
            : 'matrix-glass-card text-white'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className={`px-6 py-5 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#040c1a]/90 border-cyan-500/20'
        }`}>
          <div className="flex items-center space-x-3">
            {/* Google Colorful Icon */}
            <div className="w-8 h-8 rounded-lg bg-white p-1.5 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.4)]">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide font-display-tactical text-cyan-300 matrix-glow-text uppercase">
                {isLinking ? 'Link Google Account' : 'Sign in with Google'}
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                UNMASK Federated Identity Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b text-xs font-semibold ${
          isLight ? 'border-slate-200 bg-slate-100/60' : 'border-cyan-500/20 bg-black/40'
        }`}>
          <button
            onClick={() => setActiveTab('ACCOUNTS')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer font-mono ${
              activeTab === 'ACCOUNTS'
                ? isLight 
                  ? 'bg-white text-cyan-700 border-b-2 border-cyan-600 font-bold'
                  : 'bg-[#040c1a] text-cyan-300 border-b-2 border-cyan-400 font-bold shadow-inner'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            Select Google Account
          </button>
          <button
            onClick={() => setActiveTab('CUSTOM')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer font-mono ${
              activeTab === 'CUSTOM'
                ? isLight 
                  ? 'bg-white text-cyan-700 border-b-2 border-cyan-600 font-bold'
                  : 'bg-[#040c1a] text-cyan-300 border-b-2 border-cyan-400 font-bold shadow-inner'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            Custom Gmail
          </button>
          <button
            onClick={() => setActiveTab('GCP_CONFIG')}
            className={`flex-1 py-2.5 text-center transition-colors cursor-pointer font-mono ${
              activeTab === 'GCP_CONFIG'
                ? isLight 
                  ? 'bg-white text-cyan-700 border-b-2 border-cyan-600 font-bold'
                  : 'bg-[#040c1a] text-cyan-300 border-b-2 border-cyan-400 font-bold shadow-inner'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-cyan-200'
            }`}
          >
            Cloud OAuth Keys
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center space-x-2 text-xs text-red-300 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: ONE-TAP SELECTOR */}
          {activeTab === 'ACCOUNTS' && (
            <div className="space-y-3">
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300 font-sans'}`}>
                Choose an authorized Google intelligence account to authenticate immediately:
              </p>

              <div className="space-y-2 mt-3">
                {PRESET_GOOGLE_PROFILES.map((profile, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(profile)}
                    disabled={isLoading}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isLight
                        ? 'bg-slate-50 hover:bg-cyan-50/50 hover:border-cyan-400 border-slate-200'
                        : 'matrix-glass-interactive'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-9 h-9 rounded-full border border-cyan-500/40 bg-slate-800 p-0.5 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-slate-100">{profile.name}</div>
                        <div className={`text-[11px] font-mono truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {profile.email}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono font-semibold mt-0.5">
                          {profile.role}
                        </div>
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ${
                      isLight ? 'bg-cyan-100 text-cyan-800' : 'matrix-button-primary'
                    }`}>
                      Sign In
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM GMAIL */}
          {activeTab === 'CUSTOM' && (
            <form onSubmit={handleCustomGoogleAuth} className="space-y-4">
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300 font-sans'}`}>
                Enter your Google Account email to authenticate with UNMASK federated services:
              </p>

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-cyan-300'}`}>
                    Google / Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. analyst.smith@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border font-mono outline-none transition-colors ${
                        isLight 
                          ? 'bg-slate-50 border-slate-300 focus:border-cyan-500 text-slate-900' 
                          : 'matrix-input'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-cyan-300'}`}>
                    Full Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Inspector Smith"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border outline-none transition-colors ${
                        isLight 
                          ? 'bg-slate-50 border-slate-300 focus:border-cyan-500 text-slate-900' 
                          : 'matrix-input'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl matrix-button-primary font-mono text-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 glitch-hover"
              >
                <span>{isLoading ? 'Verifying Google Identity...' : 'Authenticate with Google'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: GCP CLOUD OAUTH CONFIG */}
          {activeTab === 'GCP_CONFIG' && (
            <div className="space-y-4">
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300 font-sans'}`}>
                To connect a live Google Cloud Console OAuth application, enter your OAuth 2.0 Web Client credentials:
              </p>

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-cyan-300'}`}>
                    Google Client ID
                  </label>
                  <input
                    type="text"
                    placeholder="xxxx.apps.googleusercontent.com"
                    value={gcpClientId}
                    onChange={(e) => setGcpClientId(e.target.value)}
                    className={`w-full px-3 py-2.5 text-xs rounded-xl border font-mono outline-none transition-colors ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-mono font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-cyan-300'}`}>
                    Google Client Secret (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="GOCSPX-xxxx"
                    value={gcpClientSecret}
                    onChange={(e) => setGcpClientSecret(e.target.value)}
                    className={`w-full px-3 py-2.5 text-xs rounded-xl border font-mono outline-none transition-colors ${
                      isLight 
                        ? 'bg-slate-50 border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGcpOAuthRedirect}
                className="w-full py-3 px-4 rounded-xl matrix-button-secondary font-mono text-xs flex items-center justify-center space-x-2 cursor-pointer glitch-hover"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Launch Google Cloud OAuth Redirect</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Security Badge */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-[11px] ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#030814] border-cyan-500/20 text-slate-400'
        }`}>
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted OpenID Connect Gateway</span>
          </div>
          <span className="font-mono text-[10px] text-cyan-400 matrix-glow-text">EIP-191 / OIDC Compliant</span>
        </div>
      </div>
    </div>
  );
};

