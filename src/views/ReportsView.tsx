// ============================================================
// PAGE 8 — DOSSIER REPORTS GENERATOR
// Official NTRO-Formatted Threat Intelligence Dossier Generator
// ============================================================

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  ExternalLink,
  User,
  ArrowRight,
  FileCheck2,
  Share2
} from 'lucide-react';
import { THREAT_ACTORS, INVESTIGATIONS, STYLOMETRIC_COMPARISON } from '../data/mockIntelligence';
import confetti from 'canvas-confetti';

interface ReportsViewProps {
  selectedActorName?: string;
  onSelectActor: (actorName: string) => void;
  onNavigateToModule: (module: any) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  selectedActorName = 'shadowfox',
  onSelectActor,
  onNavigateToModule
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState('INV-1027');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(true);

  const currentCase = INVESTIGATIONS.find(c => c.id === selectedCaseId) || INVESTIGATIONS[0];
  const targetActor = THREAT_ACTORS.find(a => a.primaryAlias === currentCase.targetActorName) || THREAT_ACTORS[0];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00F0FF', '#8B5CF6', '#10B981']
      });
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1920px] mx-auto font-mono-code">
      {/* Header Actions Bar */}
      <div className="bg-[#030a1a]/40 backdrop-blur-md border border-[#1e90ff]/25 p-4 rounded-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white uppercase tracking-wider">
              NTRO Cyber Intelligence Dossier Generator
            </h1>
            <p className="text-xs text-slate-400">
              Automated De-anonymization Report Formulation & Evidentiary Synthesis
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <select
            value={selectedCaseId}
            onChange={e => setSelectedCaseId(e.target.value)}
            className="bg-[#020713]/60 border border-[#1e3a6a] rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#1e90ff]"
          >
            {INVESTIGATIONS.map(c => (
              <option key={c.id} value={c.id} className="bg-[#030a1a] text-slate-200">
                {c.id} ({c.targetActorName})
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#1e90ff] to-purple-600 hover:from-[#1e90ff]/80 hover:to-purple-500 text-white text-xs font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(30,144,255,0.4)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'GENERATE INTELLIGENCE REPORT'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-[#020713]/60 hover:bg-[#1e90ff]/20 border border-[#1e3a6a] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Print Official Dossier"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Printable Dossier Preview Sheet */}
      <div className="max-w-4xl mx-auto bg-[#030a1a]/50 backdrop-blur-xl border-2 border-[#1e90ff]/35 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Classification Header Stamp */}
        <div className="border-b-2 border-[#1e90ff]/30 pb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => { window.location.hash = '#/'; }}
              className="h-14 w-auto flex items-center justify-center p-0.5 shrink-0 group cursor-pointer focus:outline-none"
              title="UNMASK - Return to Home"
            >
              <img src="/unmask-logo.png" alt="UNMASK Logo" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold tracking-widest uppercase">
                  TOP SECRET // NTRO CYBER INTEL // LEVEL-4
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white font-display-tactical tracking-wider pt-0.5">
                UNMASK THREAT DE-ANONYMIZATION DOSSIER
              </h2>
              <p className="text-xs text-slate-400">
                Case Ref: <strong className="text-[#38bdf8] font-mono-code">{currentCase.id}</strong> • Target: <strong className="text-[#38bdf8] font-mono-code">{currentCase.targetActorName}</strong>
              </p>
            </div>
          </div>

          <div className="text-right text-xs font-mono-code space-y-1 text-slate-400">
            <div>Platform: <strong className="text-[#38bdf8] font-bold">UNMASK INTEL ENGINE</strong></div>
            <div>Auth Node: <strong className="text-slate-200">NTRO-DELHI-CYBER-OPS</strong></div>
            <div>Date: <strong className="text-slate-200">{new Date().toISOString().split('T')[0]}</strong></div>
            <div>Lead: <strong className="text-slate-200">{currentCase.leadAnalyst}</strong></div>
          </div>
        </div>

        {/* Executive Threat Summary Table */}
        <div className="bg-[#020713]/40 p-4 rounded-xl border border-[#1e90ff]/20 space-y-3">
          <h3 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
            1. Executive Assessment & Risk Formulation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentCase.summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Threat Risk Score</span>
              <span className="text-base font-bold text-amber-400">{targetActor.riskScore} / 100 [HIGH]</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Correlation Confidence</span>
              <span className="text-base font-bold text-emerald-400">{targetActor.confidenceScore}% [MULTI-SIGNAL]</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Monitored Aliases</span>
              <span className="text-base font-bold text-[#38bdf8]">{targetActor.metrics.aliasCount} Detected</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Laundering Mixers</span>
              <span className="text-base font-bold text-purple-300">{targetActor.metrics.walletCount} Hops</span>
            </div>
          </div>
        </div>

        {/* 2. Key Findings & Correlated Evidence */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#38bdf8]" />
            2. Verified Correlation Evidentiary Matrix
          </h3>
          <div className="space-y-2">
            {currentCase.keyFindings.map((finding, idx) => (
              <div key={idx} className="p-3 bg-[#020713]/40 rounded-lg border border-[#1e3a6a]/40 flex items-start space-x-2.5 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Alias & Infrastructure Footprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Correlated Aliases */}
          <div className="bg-[#020713]/40 p-4 rounded-xl border border-[#1e3a6a]/40 space-y-2">
            <h4 className="text-xs font-bold text-[#38bdf8] uppercase">Correlated Aliases</h4>
            <div className="space-y-1.5">
              {targetActor.aliases.map((al, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#020713]/60 text-[11px]">
                  <span className="text-slate-200 font-bold">{al.alias} ({al.platform})</span>
                  <span className="text-emerald-400 font-bold">{al.similarityScore}% Match</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure & Wallets */}
          <div className="bg-[#020713]/40 p-4 rounded-xl border border-[#1e3a6a]/40 space-y-2">
            <h4 className="text-xs font-bold text-[#38bdf8] uppercase">Crypto & Network Relays</h4>
            <div className="space-y-1.5">
              {targetActor.wallets.map((w, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#020713]/60 text-[11px]">
                  <span className="text-slate-200 truncate max-w-[180px]">{w.address}</span>
                  <span className="text-amber-400 font-bold">{w.currency} ({w.mixerHops} hops)</span>
                </div>
              ))}
              {targetActor.ips.map((ip, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded bg-[#020713]/60 text-[11px]">
                  <span className="text-slate-200">{ip.ip} ({ip.country})</span>
                  <span className="text-purple-300">{ip.serviceType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Stylometric Linguistic Proof Summary */}
        <div className="bg-[#020713]/40 p-4 rounded-xl border border-[#1e3a6a]/40 space-y-2 text-xs">
          <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
            3. Stylometric Linguistic Consistency Verification (78%)
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {STYLOMETRIC_COMPARISON.linguisticConclusion}
          </p>
        </div>

        {/* 5. Classification Disclaimer & Official Sign-off Stamp */}
        <div className="pt-6 border-t-2 border-[#1e3a6a]/40 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1 max-w-md">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">
              LEGAL & ETHICAL COMPLIANCE NOTICE:
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              All intelligence contained herein is synthesized for authorized defensive research under NTRO Cyber Intelligence Mandate. Correlations denote algorithmically verified probability matrices.
            </p>
          </div>

          <div className="p-3 bg-[#020713]/60 rounded-xl border border-[#1e90ff]/40 text-center space-y-1 min-w-[200px]">
            <span className="text-[9px] text-[#38bdf8] font-bold uppercase tracking-widest block">
              NTRO FORENSIC VALIDATION
            </span>
            <div className="text-xs font-bold text-white">DIGITALLY SIGNED // RAMAN_K</div>
            <div className="text-[9px] text-emerald-400">SHA-256: 7F90...E882B</div>
          </div>
        </div>
      </div>
    </div>
  );
};
