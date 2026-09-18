import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Bell, 
  User, 
  RotateCw, 
  Sparkles, 
  Sun, 
  Moon, 
  LogOut, 
  Home,
  ShieldCheck,
  Command,
  Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TacticalHeaderProps {
  onOpenSearch: () => void;
  onOpenCommandPalette: () => void;
  onToggleAIAnalyst: () => void;
  isAIOpen: boolean;
  unreadAlertsCount: number;
  activeInvestigationCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateToCitizenPortal?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
}

export const TacticalHeader: React.FC<TacticalHeaderProps> = ({
  onOpenSearch,
  onOpenCommandPalette,
  onToggleAIAnalyst,
  isAIOpen,
  unreadAlertsCount,
  activeInvestigationCount,
  theme,
  onToggleTheme,
  onNavigateToCitizenPortal,
  onNavigateToHome,
  onNavigateToProfile,
  onLogout
}) => {
  const { user } = useAuth();
  const isLight = theme === 'light';

  return (
    <header className={`h-16 w-full px-4 md:px-6 flex items-center justify-between z-30 sticky top-0 transition-colors ${
      isLight
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs'
        : 'bg-[#020713]/40 backdrop-blur-md border-b border-[#1e90ff]/25 shadow-[0_4px_24px_rgba(2,8,22,0.4)]'
    }`}>
      {/* Brand & Official Logo with HUD Ring Motif */}
      <div className="flex items-center space-x-3.5 shrink-0">
        <button
          onClick={onNavigateToHome || (() => { window.location.hash = '#/'; })}
          className="flex items-center space-x-3 group cursor-pointer text-left focus:outline-none relative"
          title="UNMASK - Return to Home"
        >
          {/* Square Logo Box with Electric Blue Glowing Ring */}
          <div className="relative w-10 h-10 rounded-xl bg-white/90 p-1 border border-blue-400/60 shadow-[0_0_18px_rgba(30,144,255,0.4)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            {/* Subtle animated rotating mini tech ring behind logo */}
            {!isLight && (
              <div className="absolute -inset-1 rounded-xl border border-blue-400/40 border-dashed animate-[rotate-hud-cw_25s_linear_infinite] pointer-events-none" />
            )}
            <img 
              src="/unmask-logo.png" 
              alt="UNMASK Logo" 
              className="w-full h-full object-contain relative z-10"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-display-tactical text-xl md:text-2xl font-black tracking-widest ${
                isLight ? 'text-slate-900' : 'text-white drop-shadow-[0_0_14px_rgba(30,144,255,0.9)]'
              }`}>
                UNMASK
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider flex items-center gap-1 ${
                isLight 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-xs' 
                  : 'bg-[#081a38]/80 text-[#60a5fa] border border-[#1e90ff]/50 shadow-[0_0_10px_rgba(30,144,255,0.3)]'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF] animate-ping" />
                ADMIN PORTAL
              </span>
            </div>
            <p className={`hidden md:block text-[10px] tracking-tight ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              AI-Powered Threat Actor Correlation & Citizen Triage
            </p>
          </div>
        </button>
      </div>

      {/* Global Omni-Search Input / Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full h-9 px-3.5 rounded-lg text-xs flex items-center justify-between transition-all group cursor-pointer border ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-600 shadow-inner'
              : 'bg-[#040c1e]/40 hover:bg-[#081a38]/60 border-[#1e3a6a]/60 hover:border-[#1e90ff]/60 text-slate-300 shadow-inner hover:shadow-[0_0_15px_rgba(30,144,255,0.2)] backdrop-blur-sm'
          }`}
          title="Open Global Search (Ctrl + K / ⌘K)"
        >
          <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2 overflow-hidden">
            <Search className={`w-3.5 h-3.5 shrink-0 ${
              isLight ? 'text-slate-500' : 'text-[#60a5fa] group-hover:text-[#38bdf8]'
            }`} />
            <span className={`truncate whitespace-nowrap text-left block text-[11px] ${
              isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-slate-200'
            }`}>
              Search threat actors, crypto wallets, onion domains, IPs...
            </span>
          </div>
          <kbd className={`shrink-0 px-2 py-0.5 text-[10px] rounded font-mono border flex items-center gap-0.5 ${
            isLight 
              ? 'bg-white border-slate-300 text-slate-600 font-semibold' 
              : 'bg-[#0b2046] border-[#1e90ff]/40 text-[#93c5fd] group-hover:text-white group-hover:border-[#1e90ff]'
          }`}>
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Telemetry & Navigation Actions */}
      <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
        {/* Public Home Navigation Link */}
        {onNavigateToHome && (
          <button
            onClick={onNavigateToHome}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-300 hover:text-white hover:bg-[#161c28]'
            }`}
            title="Return to UNMASK Public Landing Page"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-xs">Home</span>
          </button>
        )}

        {/* Switch to Citizen Complaint Portal Button */}
        {onNavigateToCitizenPortal && (
          <button
            onClick={onNavigateToCitizenPortal}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
              isLight
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-[#081530] text-slate-200 border-[#1e3a6a] hover:border-[#1e90ff]/60 hover:text-white hover:shadow-[0_0_12px_rgba(30,144,255,0.25)]'
            }`}
            title="Open Citizen Cyber Crime & Scam Reporting Portal"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-[#38bdf8]'}`} />
            <span className="hidden sm:inline">Citizen portal</span>
            <span className="sm:hidden">Portal</span>
          </button>
        )}

        {/* System Online Status Badge */}
        <div className={`hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
          isLight
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-[#041a24]/90 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-wider">HUD ONLINE</span>
        </div>

        {/* UNMASK Analyst AI Drawer Trigger Button */}
        <button
          onClick={onToggleAIAnalyst}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
            isLight
              ? (isAIOpen
                  ? 'bg-blue-100 text-blue-900 border-blue-400 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300')
              : (isAIOpen
                  ? 'bg-[#0e2a5c] text-white border-[#1e90ff] shadow-[0_0_18px_rgba(30,144,255,0.45)]'
                  : 'bg-[#081530] text-[#93c5fd] border-[#1e3a6a] hover:border-[#1e90ff]/60 hover:text-white hover:shadow-[0_0_12px_rgba(30,144,255,0.25)]')
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="hidden sm:inline font-medium">Analyst AI</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={() => window.location.reload()}
          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
              : 'bg-[#07132a] border-[#1e3a6a] hover:border-[#1e90ff]/50 text-slate-400 hover:text-white'
          }`}
          title="Refresh Data Telemetry"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={onOpenSearch}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-[#07132a] border-[#1e3a6a] text-slate-400 hover:text-white hover:border-[#1e90ff]/50'
            }`}
            title="Notifications & Alerts"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
              {unreadAlertsCount}
            </span>
          )}
        </div>

        {/* Day / Night Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-600'
              : 'bg-[#07132a] border-[#1e3a6a] hover:border-[#1e90ff]/50 text-[#60a5fa] hover:text-[#93c5fd]'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-[#38bdf8]" />}
        </button>

        {/* Authenticated User Profile Pill */}
        <button
          onClick={onNavigateToProfile || (() => { window.location.hash = '#/profile'; })}
          className={`flex items-center space-x-2 pl-2 border-l transition-all cursor-pointer group text-left ${
            isLight ? 'border-slate-200 hover:bg-slate-50' : 'border-[#1e3a6a] hover:bg-[#0c1f44]/50'
          } p-1 rounded-lg`}
          title="Open User Profile & Credentials"
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border overflow-hidden shrink-0 ${
            isLight
              ? 'bg-blue-100 border-blue-300 text-blue-800'
              : 'bg-[#0e244d] border-[#1e90ff]/40 text-[#93c5fd] group-hover:border-[#1e90ff] shadow-[0_0_8px_rgba(30,144,255,0.25)]'
          }`}>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'OP'}</span>
            )}
          </div>
          <div className="hidden xl:block text-left">
            <div className={`font-semibold text-xs leading-none flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-slate-200 group-hover:text-[#60a5fa]'
            }`}>
              <span>{user?.displayName || 'Commander Raman'}</span>
              <span className={`text-[8px] px-1 py-0.2 rounded font-black ${
                user?.role === 'ADMIN' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <div className={`text-[10px] mt-0.5 leading-none font-mono ${isLight ? 'text-slate-500' : 'text-[#64748b]'}`}>
              {user?.userId || 'UNMASK-ADMIN-000001'}
            </div>
          </div>
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center space-x-1.5 ${
              isLight
                ? 'bg-red-50 hover:bg-red-100 border-red-300 text-red-700'
                : 'bg-red-950/30 hover:bg-red-900/50 border-red-500/30 text-red-300 hover:text-red-200'
            }`}
            title="Log Out (Terminate Session)"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};

