// ============================================================
// PAGE — ADMIN CITIZEN COMPLAINTS & AI ANOMALY TRIAGE HUD
// National Incident Ingestion, Dark Web Cross-Correlation & Action Center
// ============================================================

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Wallet, 
  Key, 
  Network, 
  ArrowRight, 
  Send, 
  FileText, 
  RefreshCw,
  Building,
  Radio,
  Eye,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  X,
  Database,
  UploadCloud
} from 'lucide-react';
import type { CitizenComplaint, ComplaintStatus, ComplaintCategory, ComplaintRiskLevel } from '../types/complaint';
import { ComplaintService } from '../services/complaintStore';
import { DatasetManagement } from '../components/Admin/DatasetManagement';

interface AdminComplaintsViewProps {
  onFocusThreatGraph: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const AdminComplaintsView: React.FC<AdminComplaintsViewProps> = ({
  onFocusThreatGraph,
  onNavigateToModule
}) => {
  const [adminTab, setAdminTab] = useState<'COMPLAINTS' | 'DATASETS'>('COMPLAINTS');
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => ComplaintService.getComplaints());
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(() => {
    const all = ComplaintService.getComplaints();
    return all[0] || null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [adminNoteText, setAdminNoteText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = ComplaintService.subscribe(updated => {
      setComplaints(updated);
      if (selectedComplaint) {
        const refreshed = updated.find(c => c.id === selectedComplaint.id);
        if (refreshed) setSelectedComplaint(refreshed);
      }
    });
    return unsubscribe;
  }, [selectedComplaint]);

  // Telemetry Counts
  const totalCount = complaints.length;
  const criticalCount = complaints.filter(c => c.aiAnomalyReport.riskLevel === 'CRITICAL').length;
  const investigatingCount = complaints.filter(c => c.status === 'INVESTIGATING' || c.status === 'ESCALATED_CYBER_CELL').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  // Filtered complaints list
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.narrative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.suspectWallet && c.suspectWallet.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.suspectAlias && c.suspectAlias.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.submittedBy.identifier.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (newStatus: ComplaintStatus) => {
    if (!selectedComplaint) return;
    setIsUpdatingStatus(true);
    setTimeout(() => {
      const updated = ComplaintService.updateComplaintStatus(
        selectedComplaint.id,
        newStatus,
        adminNoteText ? adminNoteText : `Status updated to ${newStatus} by Analyst`,
        'ANALYST_K.RAMAN'
      );
      if (updated) {
        setSelectedComplaint(updated);
      }
      setAdminNoteText('');
      setIsUpdatingStatus(false);
    }, 300);
  };

  const handleAddNoteOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint || !adminNoteText.trim()) return;
    const updated = ComplaintService.updateComplaintStatus(
      selectedComplaint.id,
      selectedComplaint.status,
      adminNoteText.trim(),
      'ANALYST_K.RAMAN'
    );
    if (updated) setSelectedComplaint(updated);
    setAdminNoteText('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code select-none">
      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setAdminTab('COMPLAINTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            adminTab === 'COMPLAINTS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>CITIZEN COMPLAINT TRIAGE</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-800 text-slate-300 font-mono">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('DATASETS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            adminTab === 'DATASETS'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>DATASET MANAGEMENT & GRAPH GENERATOR</span>
          <span className="px-1.5 py-0.2 text-[10px] rounded bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono font-bold">
            NEW
          </span>
        </button>
      </div>

      {adminTab === 'DATASETS' ? (
        <DatasetManagement onNavigateToThreatGraph={() => onNavigateToModule('THREAT_GRAPH')} />
      ) : (
        <>
          {/* Top Operations Telemetry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl border border-[#1e90ff]/25 bg-[#030a1a]/40 backdrop-blur-md space-y-1 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-between">
                <span>Total Citizen Complaints</span>
                <Radio className="w-3.5 h-3.5 text-[#38bdf8]" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{totalCount}</div>
              <div className="text-[10px] text-[#38bdf8] font-medium">Real-time Stream Active</div>
            </div>

        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 backdrop-blur-md space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-red-300 flex items-center justify-between">
            <span>Critical AI Anomalies</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{criticalCount}</div>
          <div className="text-[10px] text-red-300 font-medium">Dark Web Correlation &gt; 80%</div>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-950/20 backdrop-blur-md space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-amber-300 flex items-center justify-between">
            <span>Active Investigations</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{investigatingCount}</div>
          <div className="text-[10px] text-amber-300 font-medium">Under Multi-Hop Trace</div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md space-y-1 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-300 flex items-center justify-between">
            <span>Resolved / Actioned</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{resolvedCount}</div>
          <div className="text-[10px] text-emerald-300 font-medium">Freezing Notice Dispatched</div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Feed + Right AI Triage Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Complaints Feed & Filters (7 Cols) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border border-[#1e90ff]/25 bg-[#030a1a]/40 backdrop-blur-md space-y-3">
            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#38bdf8] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by tracking ID, wallet address, alias, or citizen email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#020713]/60 border border-[#1e3a6a] rounded-lg text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#1e90ff]"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#020713]/60 border border-[#1e3a6a] rounded-lg text-xs text-slate-300 outline-none focus:border-[#1e90ff] cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending Triage</option>
                <option value="AI_ANALYZED">AI Analyzed</option>
                <option value="INVESTIGATING">Under Investigation</option>
                <option value="ESCALATED_CYBER_CELL">Escalated to Cyber Cell</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#020713]/60 border border-[#1e3a6a] rounded-lg text-xs text-slate-300 outline-none focus:border-[#1e90ff] cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="CRYPTO_SCAM">Crypto Scam</option>
                <option value="RANSOMWARE">Ransomware</option>
                <option value="DARK_WEB_LEAK">Dark Web Leak</option>
                <option value="PHISHING">Phishing</option>
                <option value="MARKETPLACE_FRAUD">Marketplace Fraud</option>
              </select>
            </div>
          </div>

          {/* Complaints List Cards */}
          <div className="space-y-2.5 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(cmp => {
                const isSelected = selectedComplaint?.id === cmp.id;
                const risk = cmp.aiAnomalyReport.riskLevel;
                const topActor = cmp.aiAnomalyReport.matchedActors[0];

                return (
                  <div
                    key={cmp.id}
                    onClick={() => setSelectedComplaint(cmp)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative backdrop-blur-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#1e90ff]/20 to-[#0c1830]/80 border-[#1e90ff] shadow-[0_0_20px_rgba(30,144,255,0.25)]'
                        : 'bg-[#030a1a]/40 hover:bg-[#0c1830]/60 border-[#1e3a6a]/40 hover:border-[#1e90ff]/40'
                    }`}
                  >
                    {/* Active line */}
                    {isSelected && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#06B6D4]"></span>
                    )}

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">{cmp.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {cmp.category.replace('_', ' ')}
                          </span>
                          {cmp.blockchainProof && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40 flex items-center space-x-1">
                              <Key className="w-2.5 h-2.5" />
                              <span>ON-CHAIN SEAL</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-1">{cmp.title}</h4>
                      </div>

                      {/* AI Anomaly Badge */}
                      <div className="text-right shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border inline-flex items-center space-x-1 ${
                          risk === 'CRITICAL' ? 'bg-red-950/80 text-red-400 border-red-500/40' :
                          risk === 'HIGH' ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' :
                          'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          <span>ANOMALY: {cmp.aiAnomalyReport.anomalyScore}/100</span>
                        </span>
                      </div>
                    </div>

                    {/* Suspect & Actor Correlation Row */}
                    <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <div className="flex items-center space-x-3">
                        {topActor ? (
                          <span className="text-cyan-300 font-bold flex items-center space-x-1">
                            <span>Matched Actor:</span>
                            <span className="text-white px-1.5 py-0.5 bg-cyan-950 rounded border border-cyan-500/40">{topActor.actorName} ({topActor.confidence}%)</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">No primary APT match</span>
                        )}
                        {cmp.approximateLoss && (
                          <span className="text-amber-400 font-semibold">• Loss: {cmp.approximateLoss}</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          cmp.status === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40' :
                          cmp.status === 'INVESTIGATING' ? 'bg-amber-950 text-amber-400 border-amber-500/40' :
                          cmp.status === 'ESCALATED_CYBER_CELL' ? 'bg-red-950 text-red-400 border-red-500/40' :
                          'bg-slate-900 text-cyan-300 border-cyan-500/40'
                        }`}>
                          {cmp.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No citizen complaints match the selected filter criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Anomaly Triage Scorecard & Action Center (5 Cols) */}
        <div className="xl:col-span-5">
          {selectedComplaint ? (
            <div className="p-5 sm:p-6 rounded-2xl border border-[#1e90ff]/30 bg-[#030a1a]/45 backdrop-blur-xl shadow-2xl space-y-6 animate-in fade-in duration-150">
              {/* Card Header & Citizen Info */}
              <div className="flex items-start justify-between pb-4 border-b border-[#1e90ff]/20 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-[#38bdf8] font-mono">{selectedComplaint.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#020713]/60 text-slate-300 border border-[#1e3a6a]">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1 leading-snug">{selectedComplaint.title}</h3>
                  <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1.5">
                    <User className="w-3 h-3 text-[#38bdf8]" />
                    <span>Reported by: </span>
                    <span className="font-bold text-slate-200">
                      {selectedComplaint.submittedBy.displayName || selectedComplaint.submittedBy.identifier} ({selectedComplaint.submittedBy.provider})
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border block ${
                    selectedComplaint.aiAnomalyReport.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                    selectedComplaint.aiAnomalyReport.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                    'bg-[#1e90ff]/20 text-[#38bdf8] border border-[#1e90ff]/40'
                  }`}>
                    {selectedComplaint.aiAnomalyReport.riskLevel} RISK
                  </span>
                </div>
              </div>

              {/* Automated AI Correlation Scorecard */}
              <div className="p-4 rounded-xl border border-[#1e90ff]/25 bg-[#020713]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-[#38bdf8] animate-pulse" />
                    <span>AI Threat Correlation Engine</span>
                  </span>
                  <span className="font-mono text-[#38bdf8]">Index: {selectedComplaint.aiAnomalyReport.anomalyScore}/100</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedComplaint.aiAnomalyReport.forensicSummary}
                </p>

                {/* Detected Patterns */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Detected Anomaly Signatures ({selectedComplaint.aiAnomalyReport.detectedPatterns.length})
                  </span>
                  <div className="space-y-1 text-[11px]">
                    {selectedComplaint.aiAnomalyReport.detectedPatterns.map((pat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-cyan-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
                        <span>{pat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Threat Actor Box */}
                {selectedComplaint.aiAnomalyReport.matchedActors.length > 0 && (
                  <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-red-300">
                      <span className="flex items-center space-x-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        <span>Correlated Target: {selectedComplaint.aiAnomalyReport.matchedActors[0].actorName}</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px]">
                        {selectedComplaint.aiAnomalyReport.matchedActors[0].confidence}% Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">Direct Threat Intelligence Pivot:</span>
                      <button
                        onClick={() => {
                          const actorName = selectedComplaint.aiAnomalyReport.matchedActors[0].actorName;
                          onFocusThreatGraph(actorName || 'shadowfox');
                          onNavigateToModule('THREAT_GRAPH');
                        }}
                        className="px-2.5 py-1 rounded bg-[#1e90ff]/20 hover:bg-[#1e90ff]/30 text-[#38bdf8] font-bold text-[10px] border border-[#1e90ff]/40 flex items-center space-x-1 transition-all cursor-pointer"
                      >
                        <Network className="w-3 h-3 text-[#38bdf8]" />
                        <span>Pivot to 3D Graph</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Suspect Indicators & Evidence Drawer */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Extracted Indicators & Evidence
                </span>
                <div className="p-3.5 rounded-xl border border-[#1e3a6a]/40 bg-[#020713]/50 space-y-2 font-mono text-[11px]">
                  {selectedComplaint.suspectWallet && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Suspect Wallet:</span>
                      <span className="text-amber-400 truncate max-w-[200px]">{selectedComplaint.suspectWallet}</span>
                    </div>
                  )}
                  {selectedComplaint.suspectAlias && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Suspect Alias:</span>
                      <span className="text-[#38bdf8] font-bold">{selectedComplaint.suspectAlias}</span>
                    </div>
                  )}
                  {selectedComplaint.suspectOnionUrl && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Onion Portal:</span>
                      <span className="text-emerald-400">{selectedComplaint.suspectOnionUrl}</span>
                    </div>
                  )}
                  {selectedComplaint.transactionHash && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tx Hash:</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{selectedComplaint.transactionHash}</span>
                    </div>
                  )}
                  {selectedComplaint.evidenceFiles && selectedComplaint.evidenceFiles.length > 0 && (
                    <div className="pt-2 border-t border-[#1e3a6a]/40 flex items-center justify-between">
                      <span className="text-slate-400">Forensic Attachments:</span>
                      <span className="text-[#38bdf8] font-bold">{selectedComplaint.evidenceFiles.length} Sealed File(s)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Action Center & Case Resolution */}
              <div className="space-y-3 pt-2 border-t border-[#1e3a6a]/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block flex items-center justify-between">
                  <span>Analyst Action Center</span>
                  <span className="text-[#38bdf8] font-mono text-[10px]">CASE STATUS: {selectedComplaint.status}</span>
                </span>

                {/* Status Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange('INVESTIGATING')}
                    className={`py-2 px-3 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedComplaint.status === 'INVESTIGATING'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    ● Set Investigating
                  </button>

                  <button
                    onClick={() => handleStatusChange('ESCALATED_CYBER_CELL')}
                    className={`py-2 px-3 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedComplaint.status === 'ESCALATED_CYBER_CELL'
                        ? 'bg-red-500/20 text-red-300 border-red-400 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-red-400'
                    }`}
                  >
                    ● Escalate Cyber Cell
                  </button>

                  <button
                    onClick={() => handleStatusChange('RESOLVED')}
                    className={`py-2 px-3 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      selectedComplaint.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    ● Mark Case Resolved
                  </button>

                  <button
                    onClick={() => {
                      onNavigateToModule('INVESTIGATIONS');
                    }}
                    className="py-2 px-3 rounded-lg text-[11px] font-bold bg-[#1e90ff]/20 hover:bg-[#1e90ff]/30 text-[#38bdf8] border border-[#1e90ff]/40 flex items-center justify-center space-x-1 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Promote to FIR Dossier</span>
                  </button>
                </div>

                {/* Log Official Resolution Note Form */}
                <form onSubmit={handleAddNoteOnly} className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add official resolution note (updates citizen live tracker)..."
                      value={adminNoteText}
                      onChange={e => setAdminNoteText(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#020713]/60 border border-[#1e3a6a] rounded-lg text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#1e90ff]"
                    />
                    <button
                      type="submit"
                      disabled={!adminNoteText.trim()}
                      className="px-3.5 py-2 bg-[#1e90ff] hover:bg-[#1e90ff]/80 disabled:opacity-50 text-white font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer shadow-[0_0_12px_rgba(30,144,255,0.4)]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Select a citizen complaint from the feed to inspect AI Anomaly scores.
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
