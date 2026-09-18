// ============================================================
// UNMASK // CITIZEN PORTAL HEADER BAR
// Public-Facing Government Cyber Crime & Scam Reporting HUD
// ============================================================

import React from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  LogIn, 
  LogOut, 
  User, 
  Search, 
  FileText, 
  Sparkles, 
  Sun, 
  Moon, 
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Lock,
  Home
} from 'lucide-react';
import type { CitizenAuthUser } from '../../types/complaint';

interface CitizenPortalHeaderProps {
  currentUser: CitizenAuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToHome?: () => void;
  activeTab: 'SUBMIT' | 'TRACK' | 'MY_COMPLAINTS';
  onSelectTab: (tab: 'SUBMIT' | 'TRACK' | 'MY_COMPLAINTS') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  myComplaintsCount: number;
}

export const CitizenPortalHeader: React.FC<CitizenPortalHeaderProps> = ({
  currentUser,
  onOpenAuthModal,
  onLogout,
  onNavigateToAdmin,
  onNavigateToHome,
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  myComplaintsCount
}) => {
  const isLight = theme === 'light';

  return (
    <header className={`h-16 w-full px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 font-sans transition-colors ${
      isLight 
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs text-slate-900' 
        : 'bg-[#02050c]/90 backdrop-blur-xl border-b border-cyan-500/25 text-white shadow-[0_4px_30px_rgba(0,0,0,0.7)]'
    }`}>
      {/* Brand & Citizen Portal Identity */}
      <div className="flex items-center space-x-3 shrink-0">
        <button
          onClick={onNavigateToHome || (() => { window.location.hash = '#/'; })}
          className="flex items-center space-x-3 group cursor-pointer text-left focus:outline-none"
          title="UNMASK - Return to Home"
        >
          {/* Square Logo Box with glowing border */}
          <div className={`w-10 h-10 rounded-xl p-1 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
            isLight 
              ? 'bg-white border-cyan-400/50 shadow-xs' 
              : 'bg-[#061224] border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
          }`}>
            <img 
              src="/unmask-logo.png" 
              alt="UNMASK Logo" 
              className="w-full h-full object-contain" 
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-display-tactical text-xl md:text-2xl font-black tracking-widest ${
                isLight ? 'text-slate-900' : 'text-white matrix-glow-text'
              }`}>
                UNMASK
              </span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-mono font-black uppercase tracking-wider ${
                isLight 
                  ? 'bg-[#cffafe] text-[#0e7490] border border-cyan-300 shadow-xs' 
                  : 'matrix-glow-badge'
              }`}>
                CITIZEN PORTAL
              </span>
            </div>
            <p className={`hidden md:block text-[11px] tracking-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              National Cyber Crime & Dark Web Threat Incident Reporting Engine
            </p>
          </div>
        </button>
      </div>

      {/* Center Navigation Tabs */}
      <div className={`hidden lg:flex items-center space-x-1 p-1 rounded-xl border text-xs font-semibold ${
        isLight 
          ? 'bg-slate-100 border-slate-200' 
          : 'bg-[#040a16]/90 border-cyan-500/25 shadow-inner'
      }`}>
        <button
          onClick={() => onSelectTab('SUBMIT')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 font-mono ${
            activeTab === 'SUBMIT'
              ? (isLight ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'matrix-button-primary')
              : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>File Complaint</span>
        </button>

        <button
          onClick={() => onSelectTab('TRACK')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 font-mono ${
            activeTab === 'TRACK'
              ? (isLight ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'matrix-button-primary')
              : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Live Case Tracker</span>
        </button>

        <button
          onClick={() => onSelectTab('MY_COMPLAINTS')}
          className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 font-mono ${
            activeTab === 'MY_COMPLAINTS'
              ? (isLight ? 'bg-cyan-600 text-white shadow-xs font-bold' : 'matrix-button-primary')
              : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Complaints</span>
          {myComplaintsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400 text-black font-extrabold ml-1 shadow-[0_0_8px_#00ffff]">
              {myComplaintsCount}
            </span>
          )}
        </button>
      </div>

      {/* Right User Auth & Admin Portal Switcher */}
      <div className="flex items-center space-x-2.5">
        {/* User Identity Display / Connect Button */}
        {currentUser ? (
          <div className="flex items-center space-x-2">
            <div className={`px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs ${
              currentUser.provider === 'METAMASK'
                ? (isLight 
                    ? 'bg-amber-50 border-amber-300 text-amber-900' 
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]')
                : (isLight 
                    ? 'bg-blue-50 border-blue-200 text-blue-900' 
                    : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]')
            }`}>
              {currentUser.provider === 'METAMASK' ? (
                <Wallet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center text-[10px] shrink-0">
                  G
                </div>
              )}
              <div className="max-w-[120px] sm:max-w-[160px] truncate text-[11px] font-mono font-semibold">
                {currentUser.displayName || (currentUser.walletAddress ? `${currentUser.walletAddress.substring(0, 6)}...${currentUser.walletAddress.substring(38)}` : currentUser.identifier)}
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out / Disconnect"
              className="p-2 rounded-lg border border-slate-200 dark:border-cyan-500/30 text-slate-500 hover:text-red-400 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-1.5 rounded-xl matrix-button-primary font-mono text-xs flex items-center space-x-1.5 cursor-pointer glitch-hover"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Web3</span>
          </button>
        )}

        {/* Home Navigation Link */}
        {onNavigateToHome && (
          <button
            onClick={onNavigateToHome}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 shadow-xs'
                : 'bg-[#091122] text-slate-300 border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300 shadow-sm'
            }`}
            title="Return to UNMASK Public Home"
          >
            <span className="hidden sm:inline text-[11px] font-mono">Home</span>
            <span className="sm:hidden">🏠</span>
          </button>
        )}

        {/* Day / Night Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-600 shadow-xs'
              : 'bg-[#061020] border-cyan-500/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
          }`}
          title={isLight ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        >
          {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};
