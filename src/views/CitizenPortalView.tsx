// ============================================================
// UNMASK // CITIZEN COMPLAINT PORTAL (PUBLIC ROUTE)
// Comprehensive Public Cyber Incident Filing & Web3 Tracking
// ============================================================

import React, { useState, useEffect } from 'react';
import { CitizenPortalHeader } from '../components/CitizenPortal/CitizenPortalHeader';
import { CitizenComplaintForm } from '../components/CitizenPortal/CitizenComplaintForm';
import { CitizenTrackingView } from '../components/CitizenPortal/CitizenTrackingView';
import { CitizenAuthModal } from '../components/Auth/CitizenAuthModal';
import { MatrixBinaryBackground } from '../components/CitizenPortal/MatrixBinaryBackground';
import { ComplaintService } from '../services/complaintStore';
import type { CitizenAuthUser, CitizenComplaint } from '../types/complaint';
import { 
  ShieldAlert, 
  Search, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Wallet, 
  CheckCircle2, 
  ExternalLink,
  Plus,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';

interface CitizenPortalViewProps {
  onNavigateToAdmin: () => void;
  onNavigateToHome?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  onNavigateToAdmin,
  onNavigateToHome,
  theme,
  onToggleTheme
}) => {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'SUBMIT' | 'TRACK' | 'MY_COMPLAINTS'>('SUBMIT');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CitizenAuthUser | null>(() => {
    const raw = localStorage.getItem('unmask_citizen_auth_user');
    if (raw) {
      try {
        return JSON.parse(raw) as CitizenAuthUser;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [allComplaints, setAllComplaints] = useState<CitizenComplaint[]>(() => ComplaintService.getComplaints());

  useEffect(() => {
    const unsubscribe = ComplaintService.subscribe(updated => {
      setAllComplaints(updated);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('unmask_citizen_auth_user');
    setCurrentUser(null);
  };

  const handleSuccessAuth = (user: CitizenAuthUser) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const userComplaints = currentUser 
    ? allComplaints.filter(c => 
        c.submittedBy.identifier.toLowerCase() === currentUser.identifier.toLowerCase() ||
        (c.submittedBy.walletAddress && currentUser.walletAddress && c.submittedBy.walletAddress.toLowerCase() === currentUser.walletAddress.toLowerCase())
      )
    : [];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors relative selection:bg-cyan-500/30 selection:text-cyan-200 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#020408] text-slate-100'
    }`}>
      {/* Cascading Matrix Binary Code Background (Dark Mode) */}
      <MatrixBinaryBackground isLight={isLight} />

      {/* Citizen Portal Top HUD */}
      <CitizenPortalHeader
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onNavigateToAdmin={onNavigateToAdmin}
        onNavigateToHome={onNavigateToHome}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        theme={theme}
        onToggleTheme={onToggleTheme}
        myComplaintsCount={userComplaints.length}
      />

      {/* Hero Banner with Cyberpunk Matrix Security Context */}
      <div className={`border-b px-4 py-8 sm:py-11 text-center relative overflow-hidden z-10 ${
        isLight 
          ? 'bg-gradient-to-b from-cyan-50/80 via-white to-slate-50 border-slate-200' 
          : 'bg-transparent border-cyan-500/20'
      }`}>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          {/* Cyber Terminal System Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wider bg-[#04101e]/80 text-cyan-400 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00ffff]"></span>
            <span>SYSTEM // AI ANOMALY TRIAGE // WEB3 BLOCKCHAIN SEAL</span>
          </div>

          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-display-tactical uppercase ${
            isLight ? 'text-slate-900' : 'text-white matrix-glow-text'
          }`}>
            National Cyber Crime & Dark Web Incident Portal
          </h1>

          <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto ${
            isLight ? 'text-slate-600' : 'text-cyan-100/70 font-sans'
          }`}>
            Report fraudulent crypto wallets, ransomware extortion demands, and dark web data leaks. Every report is cryptographically sealed and correlated with national intelligence threat actors in real time.
          </p>

          {/* Quick Stats Grid with Cyberpunk Glass Styling */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center font-mono">
            <div className={`p-3.5 rounded-xl border transition-all ${
              isLight 
                ? 'bg-white border-slate-200 shadow-xs' 
                : 'matrix-glass-interactive border-cyan-500/30'
            }`}>
              <div className="text-base sm:text-xl font-black text-cyan-400 matrix-glow-text">100%</div>
              <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider mt-0.5 font-bold">AI Triaged</div>
            </div>
            
            <div className={`p-3.5 rounded-xl border transition-all ${
              isLight 
                ? 'bg-white border-slate-200 shadow-xs' 
                : 'matrix-glass-interactive border-cyan-500/30'
            }`}>
              <div className="text-base sm:text-xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">SHA-256</div>
              <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider mt-0.5 font-bold">Evidence Sealed</div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all ${
              isLight 
                ? 'bg-white border-slate-200 shadow-xs' 
                : 'matrix-glass-interactive border-cyan-500/30'
            }`}>
              <div className="text-base sm:text-xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Web3</div>
              <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider mt-0.5 font-bold">MetaMask Verified</div>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all ${
              isLight 
                ? 'bg-white border-slate-200 shadow-xs' 
                : 'matrix-glass-interactive border-cyan-500/30'
            }`}>
              <div className="text-base sm:text-xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]">&lt; 1 sec</div>
              <div className="text-[10px] text-cyan-200/60 uppercase tracking-wider mt-0.5 font-bold">Correlation Speed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 sm:py-8 relative z-10">
        {activeTab === 'SUBMIT' && (
          <CitizenComplaintForm
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onComplaintSubmitted={() => {
              // Stay on confirmation screen in form
            }}
            theme={theme}
          />
        )}

        {activeTab === 'TRACK' && (
          <CitizenTrackingView
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onNavigateToFileComplaint={() => setActiveTab('SUBMIT')}
            theme={theme}
          />
        )}

        {activeTab === 'MY_COMPLAINTS' && (
          <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl space-y-6 ${
            isLight 
              ? 'bg-white border-slate-200' 
              : 'matrix-glass-card'
          }`}>
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight font-display-tactical text-cyan-300 matrix-glow-text">
                  My Submitted Cyber Complaints
                </h2>
                <p className="text-xs text-slate-400">
                  History of all incidents filed under your connected Google or MetaMask account
                </p>
              </div>

              <button
                onClick={() => setActiveTab('SUBMIT')}
                className="px-4 py-2 rounded-xl matrix-button-primary text-xs flex items-center space-x-1.5 cursor-pointer glitch-hover"
              >
                <Plus className="w-4 h-4" />
                <span>File New Complaint</span>
              </button>
            </div>

            {userComplaints.length > 0 ? (
              <div className="space-y-3">
                {userComplaints.map(cmp => (
                  <div
                    key={cmp.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLight 
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' 
                        : 'matrix-glass-interactive'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{cmp.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono">
                          {cmp.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-100">{cmp.title}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        Submitted on {new Date(cmp.submittedAt).toLocaleDateString()} • Loss: {cmp.approximateLoss || 'Unspecified'}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-start sm:self-auto">
                      <div className="text-right">
                        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border inline-block font-mono ${
                          cmp.status === 'RESOLVED' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                          cmp.status === 'INVESTIGATING' ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' :
                          'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        }`}>
                          {cmp.status.replace('_', ' ')}
                        </span>
                        <div className="text-[10px] text-cyan-400/70 font-mono mt-0.5">
                          Anomaly: {cmp.aiAnomalyReport.anomalyScore}/100
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('TRACK')}
                        className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 transition-colors cursor-pointer"
                        title="View Detailed Case Timeline"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold font-mono text-slate-200">No Complaints Filed Yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven't submitted any complaints under this account yet. Click below to file your first incident.
                </p>
                <button
                  onClick={() => setActiveTab('SUBMIT')}
                  className="px-5 py-2.5 rounded-xl matrix-button-primary text-xs cursor-pointer"
                >
                  File Complaint Now
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Citizen Dual Auth Modal */}
      <CitizenAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessAuth={handleSuccessAuth}
        theme={theme}
      />
    </div>
  );
};
