// ============================================================
// UNMASK // CITIZEN LIVE COMPLAINT TRACKER
// Real-Time Case Progression, AI Anomaly Scorecards & Receipts
// ============================================================

import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Printer, 
  Key, 
  Wallet, 
  User, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Building,
  Radio
} from 'lucide-react';
import type { CitizenComplaint, ComplaintStatus, CitizenAuthUser } from '../../types/complaint';
import { ComplaintService } from '../../services/complaintStore';

interface CitizenTrackingViewProps {
  currentUser: CitizenAuthUser | null;
  onOpenAuthModal: () => void;
  onNavigateToFileComplaint: () => void;
  theme?: 'dark' | 'light';
}

const TIMELINE_STAGES: { status: ComplaintStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Incident Logged', desc: 'Case received into national encrypted registry' },
  { status: 'AI_ANALYZED', label: 'AI Anomaly Triaged', desc: 'Multi-signal ML cross-correlated suspect indicators' },
  { status: 'INVESTIGATING', label: 'Under Investigation', desc: 'Assigned to Cyber Defense Analyst for forensic tracing' },
  { status: 'ESCALATED_CYBER_CELL', label: 'Action Dispatched', desc: 'Exchange freeze notice and LEA warrant active' },
  { status: 'RESOLVED', label: 'Case Resolved', desc: 'Final resolution report and asset recovery notice' }
];

export const CitizenTrackingView: React.FC<CitizenTrackingViewProps> = ({
  currentUser,
  onOpenAuthModal,
  onNavigateToFileComplaint,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [searchedComplaint, setSearchedComplaint] = useState<CitizenComplaint | null>(() => {
    const all = ComplaintService.getComplaints();
    return all[0] || null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingId.trim()) return;
    const res = ComplaintService.getComplaintById(searchTrackingId.trim());
    if (res) {
      setSearchedComplaint(res);
    } else {
      alert(`No complaint found with Tracking ID: ${searchTrackingId}`);
    }
  };

  const getStageIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'AI_ANALYZED': return 1;
      case 'INVESTIGATING': return 2;
      case 'ESCALATED_CYBER_CELL': return 3;
      case 'RESOLVED': return 4;
      case 'DISMISSED': return 1;
      default: return 0;
    }
  };

  const currentStageIndex = searchedComplaint ? getStageIndex(searchedComplaint.status) : 0;
  const userComplaints = currentUser ? ComplaintService.getComplaintsByUser(currentUser.identifier) : [];

  return (
    <div className={`w-full max-w-5xl mx-auto space-y-6 font-sans ${
      isLight ? 'text-slate-900' : 'text-slate-100'
    }`}>
      {/* Top Search Bar for Tracking */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-3 ${
        isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-tight flex items-center space-x-2 font-display-tactical text-cyan-300 matrix-glow-text">
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Live Cyber Crime Complaint Tracker</span>
            </h2>
            <p className="text-xs text-slate-400">
              Enter your tracking ID to inspect live AI anomaly scores, threat correlations, and analyst notes
            </p>
          </div>

          {/* Quick sample chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-mono">
            <span className="text-slate-400 text-[10px] hidden sm:inline">Try:</span>
            {['UNMASK-CMP-2026-8942', 'UNMASK-CMP-2026-7731', 'UNMASK-CMP-2026-5120'].map(id => (
              <button
                key={id}
                onClick={() => {
                  setSearchTrackingId(id);
                  const found = ComplaintService.getComplaintById(id);
                  if (found) setSearchedComplaint(found);
                }}
                className={`px-2.5 py-1 rounded-lg border text-[10px] transition-all cursor-pointer font-mono ${
                  searchedComplaint?.id === id 
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : 'border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 bg-[#040c1a]/60'
                }`}
              >
                {id.replace('UNMASK-CMP-2026-', '#')}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. UNMASK-CMP-2026-8942)"
            value={searchTrackingId}
            onChange={e => setSearchTrackingId(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-xl border text-xs outline-none font-mono transition-all ${
              isLight 
                ? 'bg-slate-50 border-slate-300 focus:border-cyan-500 text-slate-900' 
                : 'matrix-input'
            }`}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl matrix-button-primary font-mono text-xs flex items-center space-x-2 cursor-pointer glitch-hover"
          >
            <Search className="w-4 h-4" />
            <span>Track Case</span>
          </button>
        </form>
      </div>

      {searchedComplaint ? (
        <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl space-y-8 animate-in fade-in duration-200 ${
          isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
        }`}>
          {/* Case Header Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-cyan-500/20 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-mono text-xs font-bold text-cyan-400 matrix-glow-text">
                  {searchedComplaint.id}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
                  {searchedComplaint.category.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight font-display-tactical text-slate-100">{searchedComplaint.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Filed on {new Date(searchedComplaint.submittedAt).toLocaleDateString()} at {new Date(searchedComplaint.submittedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border ${
                searchedComplaint.status === 'RESOLVED' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.25)]' :
                searchedComplaint.status === 'ESCALATED_CYBER_CELL' ? 'bg-red-950/80 text-red-300 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.25)]' :
                searchedComplaint.status === 'INVESTIGATING' ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]' :
                'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
              }`}>
                ● {searchedComplaint.status.replace('_', ' ')}
              </span>

              <button
                onClick={() => window.print()}
                title="Print Official Acknowledgment"
                className="p-2 rounded-xl border border-cyan-500/30 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Case Timeline Progression */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-2 font-mono">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Official Case Progression Timeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {TIMELINE_STAGES.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={stage.status}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? (isLight 
                            ? 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-sm ring-2 ring-cyan-500/20' 
                            : 'bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/60')
                        : isPassed
                        ? (isLight 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                            : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300')
                        : (isLight 
                            ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60' 
                            : 'matrix-glass-card border-slate-800/80 text-slate-500 opacity-40')
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold font-mono">STEP 0{idx + 1}</span>
                      {isPassed ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-cyan-400 animate-pulse shadow-[0_0_6px_#00ffff]' : 'text-emerald-400'}`} />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-600"></div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-300 matrix-glow-text' : ''}`}>{stage.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {stage.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Anomaly Triage & Forensic Insights Card */}
          <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/30 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  AI Anomaly Detection & Threat Correlation Report
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono text-slate-400">Threat Anomaly Index:</span>
                <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg matrix-glow-badge">
                  {searchedComplaint.aiAnomalyReport.anomalyScore}/100 ({searchedComplaint.aiAnomalyReport.riskLevel} RISK)
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300 font-sans">
              {searchedComplaint.aiAnomalyReport.forensicSummary}
            </p>

            {/* Matched Actor Sub-card */}
            {searchedComplaint.aiAnomalyReport.matchedActors.length > 0 && (
              <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-black/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center space-x-1.5 font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                    <span>Correlated Threat Actor Group: {searchedComplaint.aiAnomalyReport.matchedActors[0].actorName}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    Confidence: {searchedComplaint.aiAnomalyReport.matchedActors[0].confidence}% Match
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-400 font-mono">
                  {searchedComplaint.aiAnomalyReport.matchedActors[0].matchedIndicators.map((ind, i) => (
                    <div key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00ffff]"></span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Official Admin Analyst Notes & Resolution Stream */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-2 font-mono">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Official Analyst Case Updates & Actions</span>
            </h3>

            {searchedComplaint.adminNotes && searchedComplaint.adminNotes.length > 0 ? (
              <div className="space-y-2">
                {searchedComplaint.adminNotes.map(note => (
                  <div 
                    key={note.id}
                    className="p-3.5 rounded-xl border border-cyan-500/20 bg-[#040c1a]/70 space-y-1 text-xs matrix-glass-interactive"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-bold text-cyan-400">{note.adminName} (Cyber Defense Unit)</span>
                      <span className="text-slate-400">{new Date(note.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-xs">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-cyan-500/30 text-center text-xs text-slate-400 font-mono bg-[#040a16]/40">
                Case currently undergoing automated AI correlation. An analyst will log initial triage notes shortly.
              </div>
            )}
          </div>

          {/* Web3 Blockchain Seal & Provenance Card */}
          {searchedComplaint.blockchainProof && (
            <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-2 text-xs font-mono shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <div className="flex items-center justify-between font-bold text-amber-400">
                <span className="flex items-center space-x-1.5">
                  <Key className="w-4 h-4" />
                  <span>Verified On-Chain Cryptographic Seal</span>
                </span>
                <span className="text-[10px] text-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]">IMMUTABLE PROOF</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>Evidence Hash: <span className="font-bold text-white">{searchedComplaint.blockchainProof.evidenceHash.substring(0, 20)}...</span></div>
                <div>Block Height: <span className="font-bold text-white">#{searchedComplaint.blockchainProof.blockNumber}</span></div>
                <div>Signer Address: <span className="font-bold text-white">{searchedComplaint.blockchainProof.signerAddress.substring(0, 14)}...</span></div>
                <div>Network: <span className="font-bold text-emerald-400">{searchedComplaint.blockchainProof.network}</span></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-12 text-slate-400 font-mono">
          Search for a valid tracking ID or submit a complaint.
        </div>
      )}
    </div>
  );
};
