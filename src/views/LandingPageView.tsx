import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Network, 
  Search, 
  Activity, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Globe2, 
  Eye, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Sun, 
  Moon,
  ChevronRight,
  ExternalLink,
  Shield,
  Radio,
  Server,
  Key,
  User,
  UserPlus,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MatrixBinaryBackground } from '../components/CitizenPortal/MatrixBinaryBackground';

interface LandingPageViewProps {
  onNavigateToReport: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToAdminLogin: () => void;
  onNavigateToRegister?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToDashboard?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigateToReport,
  onNavigateToLogin,
  onNavigateToAdminLogin,
  onNavigateToRegister,
  onNavigateToProfile,
  onNavigateToDashboard,
  theme = 'dark',
  onToggleTheme
}) => {
  const isLight = theme === 'light';
  const { user, isAuthenticated, isAdmin } = useAuth();

  const WORKFLOW_STEPS = [
    {
      step: '01',
      title: 'Report',
      icon: ShieldAlert,
      iconColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/20 to-teal-500/10',
      borderColor: 'border-cyan-500/30',
      badge: 'CITIZEN / USER INGESTION',
      description: 'Citizens and security teams submit suspected cyber threat incidents, ransomware ransom notes, crypto wallet drainers, or dark web data leaks.'
    },
    {
      step: '02',
      title: 'Analyze',
      icon: Cpu,
      iconColor: 'text-cyan-300',
      bgGlow: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      badge: 'AUTOMATED ML INGESTION',
      description: 'The automated triage engine ingests submitted evidence, calculates SHA-256 cryptographic digests, and validates integrity seals.'
    },
    {
      step: '03',
      title: 'Extract',
      icon: Search,
      iconColor: 'text-teal-400',
      bgGlow: 'from-teal-500/20 to-cyan-500/10',
      borderColor: 'border-teal-500/30',
      badge: 'INDICATOR DE-ANONYMIZATION',
      description: 'High-speed parsers extract core indicators including suspect aliases, crypto wallet addresses, Tor onion hidden services, and transaction hashes.'
    },
    {
      step: '04',
      title: 'Correlate',
      icon: Sparkles,
      iconColor: 'text-purple-400',
      bgGlow: 'from-purple-500/20 to-cyan-500/10',
      borderColor: 'border-purple-500/30',
      badge: '6-PILLAR RISK ENGINE',
      description: 'Multi-signal AI engine cross-references extracted indicators against known dark web syndicates, past campaigns, and mixer routes.'
    },
    {
      step: '05',
      title: 'Visualize',
      icon: Network,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/30',
      badge: '3D TOPOLOGICAL GRAPH',
      description: 'Entity relationships, multi-hop mixer flows, and infrastructure hubs are projected onto an interactive 3D WebGL Threat Graph.'
    },
    {
      step: '06',
      title: 'Investigate',
      icon: FileText,
      iconColor: 'text-rose-400',
      bgGlow: 'from-rose-500/20 to-red-500/10',
      borderColor: 'border-rose-500/30',
      badge: 'LEGAL / FORENSIC DOSSIER',
      description: 'Authorized defense analysts review evidentiary linkages, dispatch exchange asset freezes, and export court-admissible FIR dossiers.'
    }
  ];

  const CAPABILITIES = [
    {
      title: '6-Pillar Risk Engine',
      icon: Activity,
      desc: 'Evaluates Alias Correlation, Behavioral Similarity, Dark Web Infrastructure, Temporal Activity, Activity Anomalies, and Blockchain Flow.'
    },
    {
      title: '3D WebGL Threat Graph',
      icon: Network,
      desc: 'Real-time topological exploration of threat syndicates, intermediary mixer clusters, onion services, and reported citizen incident hubs.'
    },
    {
      title: 'Stylometric NLP Attribution',
      icon: Layers,
      desc: 'De-anonymizes threat actors by analyzing Type-Token Ratio vocabulary richness, crypto-slang density, and linguistic rhythm in ransom notes.'
    },
    {
      title: 'Cryptographic Evidence Sealing',
      icon: ShieldCheck,
      desc: 'Calculates SHA-256 hashes for all uploaded evidence files and binds complaints to Web3 blockchain proofs for undeniable forensic chain of custody.'
    },
    {
      title: 'Triage & FIR Dossiers',
      icon: FileText,
      desc: 'Generates structured NTRO Level-4 Intelligence Dossiers with actionable executive assessments, target aliases, and LEA freeze notices.'
    },
    {
      title: 'Protected Command Center',
      icon: Lock,
      desc: 'Role-based access control safeguarding threat intelligence with backend session authentication, rate-limiting, and immutable audit logging.'
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors relative overflow-x-hidden ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#020408] text-white'
    }`}>
      {/* Matrix Cascading Binary Digital Rain Background Canvas */}
      <MatrixBinaryBackground isLight={isLight} opacity={0.85} />

      {/* Top Tactical Navigation Header */}
      <header className={`h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 border-b backdrop-blur-xl transition-colors ${
        isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#02050c]/90 border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
      }`}>
        {/* Brand & Official Logo */}
        <div className="flex items-center space-x-3">
          <a
            href="#/"
            className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
            title="UNMASK - Return to Home"
          >
            {/* Square Logo Box with glowing cyber border */}
            <div className={`w-10 h-10 rounded-xl p-1 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
              isLight 
                ? 'bg-white border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-gradient-to-br from-[#0a1829] to-[#040a14] border border-cyan-400/60 shadow-[0_0_18px_rgba(6,182,212,0.45)]'
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
                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider ${
                  isLight 
                    ? 'bg-[#cffafe] text-[#0e7490] border border-cyan-300 shadow-xs' 
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] font-mono'
                }`}>
                  DEFENSE PORTAL
                </span>
              </div>
              <p className={`hidden md:block text-[10px] tracking-tight ${isLight ? 'text-slate-500' : 'text-slate-400 font-mono'}`}>
                NTRO AI Threat De-Anonymization & Correlation Platform
              </p>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold tracking-wide">
          <a href="#about" className={`font-mono transition-colors ${isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-slate-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'}`}>
            About UNMASK
          </a>
          <a href="#how-it-works" className={`font-mono transition-colors ${isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-slate-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'}`}>
            How It Works
          </a>
          <a href="#capabilities" className={`font-mono transition-colors ${isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-slate-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'}`}>
            Capabilities
          </a>
          <a href="#architecture" className={`font-mono transition-colors ${isLight ? 'text-slate-600 hover:text-cyan-700' : 'text-slate-300 hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'}`}>
            Architecture
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Report Threat CTA (Cyberpunk Glowing Teal/Cyan) */}
          <button
            onClick={onNavigateToReport}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer ${
              isLight 
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm' 
                : 'matrix-button-primary'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report threat</span>
            <span className="sm:hidden">Report</span>
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2">
              {/* Profile Link */}
              <button
                onClick={onNavigateToProfile || onNavigateToLogin || onNavigateToAdminLogin}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isLight 
                    ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-300' 
                    : 'matrix-glass-interactive text-cyan-300 border border-cyan-500/40'
                }`}
                title="User Profile & Credentials"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate max-w-[120px]">{user.displayName || user.userId}</span>
              </button>

              {/* Admin Gateway if Admin */}
              {user.role === 'ADMIN' && onNavigateToDashboard && (
                <button
                  onClick={onNavigateToDashboard}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isLight 
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                      : 'matrix-glass-interactive text-rose-300 border border-rose-500/40'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Admin Gateway</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              {/* User Sign In */}
              <button
                onClick={onNavigateToLogin || onNavigateToProfile}
                className={`px-3 py-2 rounded-xl border text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 shadow-xs' 
                    : 'matrix-glass-interactive text-cyan-300 border-cyan-500/30'
                }`}
                title="User / Investigator Login"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In</span>
              </button>

              {/* Admin Gateway */}
              <button
                onClick={onNavigateToAdminLogin}
                className={`px-3 py-2 rounded-xl border text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isLight 
                    ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700 shadow-xs' 
                    : 'matrix-glass-interactive bg-rose-950/30 hover:bg-rose-900/50 border-rose-500/30 text-rose-300 hover:border-rose-400'
                }`}
                title="Admin Command Gateway"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-600'
                  : 'matrix-glass-interactive border-cyan-500/30 text-cyan-400'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLight ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className={`px-4 sm:px-8 py-20 sm:py-28 text-center relative overflow-hidden border-b ${
        isLight
          ? 'bg-gradient-to-b from-cyan-50/80 via-white to-slate-50 border-slate-200'
          : 'bg-transparent border-cyan-500/20'
      }`}>
        <div className="max-w-4xl mx-auto space-y-7 relative z-10">
          {/* Government / Defense Clearance Chip */}
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wide ${
            isLight 
              ? 'bg-[#cffafe] text-[#0e7490] border border-cyan-300 shadow-xs' 
              : 'matrix-glow-badge bg-[#061e2d]/80 text-cyan-300 border-cyan-500/40 backdrop-blur-md'
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
            <span>NTRO CYBER INTELLIGENCE // DE-ANONYMIZATION PLATFORM</span>
          </div>

          {/* Platform Main Title with Multi-Color Gradient */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-display-tactical text-white">
            <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">AI-powered cyber threat</div>
            <div className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">intelligence</div>
            <div className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent matrix-glow-text font-black">
              & reporting platform
            </div>
          </h1>

          {/* Value Proposition Description */}
          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${
            isLight ? 'text-slate-600' : 'text-slate-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]'
          }`}>
            UNMASK empowers national cybersecurity agencies and defense analysts to <strong className="text-cyan-300 font-bold">de-anonymize, cross-correlate, and investigate</strong> dark web threat syndicates using advanced AI, multi-hop entity relationships, behavioral signatures, and interactive 3D threat graphs.
          </p>

          {/* Primary Action Buttons (Cyberpunk Teal/Cyan) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToReport}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isLight 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20' 
                  : 'matrix-button-primary text-cyan-200 text-base'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-cyan-300" />
              <span>Report a cyber threat →</span>
            </button>

            <button
              onClick={onNavigateToAdminLogin}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isLight 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20' 
                  : 'matrix-glass-interactive text-rose-300 border border-rose-500/50 hover:bg-rose-950/40 text-base shadow-[0_0_15px_rgba(244,63,94,0.3)]'
              }`}
            >
              <Target className="w-4 h-4 text-rose-400" />
              <span>View Prime Suspects & Attribution (Why) →</span>
            </button>
          </div>

          {/* Quick Metrics Bar (Matrix Glass Panels) */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto font-mono text-center">
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'matrix-glass-interactive'}`}>
              <div className="text-xl sm:text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">100%</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">AI Automated Triage</div>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'matrix-glass-interactive'}`}>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">SHA-256</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">Cryptographic Evidence</div>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'matrix-glass-interactive'}`}>
              <div className="text-xl sm:text-2xl font-black text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">&lt; 150ms</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">Correlation Latency</div>
            </div>
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'matrix-glass-interactive'}`}>
              <div className="text-xl sm:text-2xl font-black text-teal-300 drop-shadow-[0_0_10px_rgba(20,184,166,0.6)]">₹ 1.48 Cr+</div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-0.5">Loss Mitigated</div>
            </div>
          </div>
        </div>
      </section>

      {/* How UNMASK Works Workflow Section */}
      <section id="how-it-works" className={`px-4 sm:px-8 py-16 sm:py-20 border-b relative z-10 ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#02050c]/80 border-cyan-500/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 matrix-glow-text">
              END-TO-END INTELLIGENCE LIFECYCLE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display-tactical">
              How UNMASK Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-mono">
              From public incident submission to autonomous multi-signal correlation and court-ready defense dossiers.
            </p>
          </div>

          {/* 6-Step Visual Workflow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className={`p-6 rounded-2xl border transition-all relative overflow-hidden group glitch-hover ${
                    isLight 
                      ? 'bg-slate-50 hover:bg-white border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-md' 
                      : 'matrix-glass-interactive'
                  }`}
                >
                  {/* Top Step Pill & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg ${
                      isLight 
                        ? 'bg-slate-200 text-slate-700' 
                        : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      STAGE {step.step}
                    </span>
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${step.bgGlow} border ${step.borderColor} shadow-[0_0_12px_rgba(6,182,212,0.25)]`}>
                      <Icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="text-[10px] font-mono font-bold text-cyan-400/80 uppercase tracking-wider mb-1">
                    {step.badge}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold tracking-tight mb-2 flex items-center space-x-2 font-display-tactical text-white">
                    <span>{step.title}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Core Capabilities Section */}
      <section id="capabilities" className={`px-4 sm:px-8 py-16 sm:py-20 border-b relative z-10 ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#010307]/80 border-cyan-500/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 matrix-glow-text">
              MILITARY-GRADE DEFENSE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display-tactical">
              Core Intelligence Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-mono">
              Engineered specifically for the National Technical Research Organisation (NTRO) threat matrix requirements.
            </p>
          </div>

          {/* Capabilities 3x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border space-y-3 glitch-hover ${
                    isLight 
                      ? 'bg-white border-slate-200 shadow-xs' 
                      : 'matrix-glass-interactive'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold tracking-tight font-display-tactical text-white">{cap.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack Section */}
      <section id="architecture" className={`px-4 sm:px-8 py-16 border-b relative z-10 ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#02050c]/80 border-cyan-500/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 matrix-glow-text">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-display-tactical">Hybrid Relational & Graph Intelligence</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
            <div className={`p-5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive'}`}>
              <Server className="w-6 h-6 text-cyan-400 mx-auto mb-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <div className="text-sm font-bold text-white">FastAPI + Python 3.13</div>
              <div className="text-xs text-slate-400 mt-1">High-Throughput ML Engine</div>
            </div>
            <div className={`p-5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive'}`}>
              <Database className="w-6 h-6 text-emerald-400 mx-auto mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <div className="text-sm font-bold text-white">Relational + Graph Store</div>
              <div className="text-xs text-slate-400 mt-1">SQLite / PostgreSQL + Neo4j</div>
            </div>
            <div className={`p-5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'matrix-glass-interactive'}`}>
              <Globe2 className="w-6 h-6 text-teal-300 mx-auto mb-2 drop-shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
              <div className="text-sm font-bold text-white">React 19 + Three.js WebGL</div>
              <div className="text-xs text-slate-400 mt-1">3D Topological Visualization</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className={`px-4 sm:px-8 py-16 text-center relative z-10 ${
        isLight ? 'bg-cyan-50/60' : 'bg-gradient-to-t from-cyan-950/40 via-[#02050c]/80 to-transparent backdrop-blur-sm'
      }`}>
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display-tactical text-white">
            Ready to Investigate or Report an Incident?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-mono">
            Experience the complete end-to-end incident response flow. Submit a report securely to trigger automated AI triage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToReport}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                isLight 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm' 
                  : 'matrix-button-primary'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Submit a Cyber Threat Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-4 sm:px-8 border-t text-xs relative z-10 ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#010307]/90 border-cyan-500/20 text-slate-400 backdrop-blur-md'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="#/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity focus:outline-none" title="UNMASK - Return to Home">
            <img src="/unmask-logo.png" alt="UNMASK" className="h-8 w-auto object-contain" />
            <span className="font-mono text-xs text-slate-300">NTRO Cyber Threat Intelligence Platform</span>
          </a>
          <div className="font-mono text-[11px] text-slate-400">Synthetic & Simulated Dark Web Intelligence Data • For Authorized Defense & Cyber Agency Operations Only</div>
          <div className="flex items-center space-x-4 font-mono">
            <button onClick={onNavigateToReport} className="hover:text-cyan-300 cursor-pointer transition-colors">Report Portal</button>
            <button onClick={onNavigateToAdminLogin} className="hover:text-cyan-300 cursor-pointer transition-colors">Admin Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
