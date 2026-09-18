// ============================================================
// DARKTRACE AI ANALYST (Explainable Cyber Intelligence RAG Assistant)
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  ShieldCheck, 
  HelpCircle, 
  Terminal, 
  ArrowRight,
  Database,
  Lock,
  Cpu
} from 'lucide-react';
import { THREAT_ACTORS, INVESTIGATIONS, THREAT_ALERTS, INITIAL_GRAPH_LINKS } from '../../data/mockIntelligence';

interface ChatMessage {
  id: string;
  sender: 'AI' | 'USER';
  timestamp: string;
  text: string;
  evidenceTags?: string[];
  suggestedAction?: {
    label: string;
    actionType: string;
    payload?: any;
  };
}

interface AIAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentActorName?: string;
  onNavigateToModule?: (module: string) => void;
  onFocusGraphActor?: (actorName: string) => void;
}

export const AIAnalystDrawer: React.FC<AIAnalystDrawerProps> = ({
  isOpen,
  onClose,
  currentActorName = 'shadowfox',
  onNavigateToModule,
  onFocusGraphActor
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'AI',
      timestamp: '10:30 UTC',
      text: 'Greetings Analyst. I am UNMASK ANALYST AI, connected to the UNMASK v2.3 intelligence dataset repository. I can evaluate correlation evidence, explain risk score weights, inspect multi-hop blockchain transactions, and summarize active investigation dossiers.',
      evidenceTags: ['Dataset Context Active', 'Explainable Risk Model', 'Defense-Grade Verification']
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let aiResponseText = '';
      let tags: string[] = ['Dataset Intelligence Record'];
      let suggestedAction: any = undefined;

      if (q.includes('why is shadowfox high risk') || q.includes('why was this actor flagged') || (q.includes('shadowfox') && q.includes('risk'))) {
        aiResponseText = `shadowfox received a calculated risk rating of 92/100 (VERY HIGH RISK) because multiple authentic signals correlate across the dataset profile:
1. **Cryptographic Identity Link**: Exact PGP Public Key match (0xDD31FFB107B3DD6287955B57D6AD04797FBCF96A) shared directly with 'shadow_fox'.
2. **Shared Controlled Wallet**: Co-occurring deposit address 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a across Dread and BreachForums escrow posts.
3. **Forum Cross-Presence**: Active posting history across Dread and BreachForums with 18 confirmed posts and stealth escrow offerings.
4. **Blockchain Transaction Network**: 14 incoming and outgoing transfers totaling over 38.5 ETH across connected counterparty wallets.

Current multi-signal correlation confidence is evaluated at **98% (Very High Confidence)**.`;
        tags = ['PGP Match 100%', 'Shared Wallet 0xdd31...', 'Dataset Verified'];
        suggestedAction = {
          label: 'View shadowfox 3D Graph Topology',
          actionType: 'FOCUS_GRAPH',
          payload: 'shadowfox'
        };
      } else if (q.includes('shadow_fox') || q.includes('correlated') || q.includes('two actors')) {
        aiResponseText = `The correlation between **shadowfox** and **shadow_fox** is established with an evaluated confidence of **98%** based on 4 evidentiary pillars:
- **Exact PGP Key Sub-fingerprint (100% Match)**: Key 0xDD31FFB107B3DD6287955B57D6AD04797FBCF96A is claimed and verified on both account profiles.
- **Shared Deposit Address (98% Match)**: Wallet 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a co-referenced in marketplace posts.
- **Stylometric & Linguistic Overlap (92% Match)**: Identical crypto-escrow vernacular, Oxford comma avoidance, and clean UTXO terminology.
- **Temporal Alignment (94% Match)**: Coincident active hours across Dread and BreachForums during 18:00 - 23:00 UTC.

*Classification Note: Strong evidentiary support indicates these accounts represent the same threat operator across multiple underground forums.*`;
        tags = ['PGP Identity Confluence', 'Shared Wallet 0xdd31...', 'Stylometrics 92%'];
      } else if (q.includes('entities connected') || q.includes('connected to this actor') || q.includes('shadowfox entities')) {
        aiResponseText = `shadowfox is currently connected to **14 distinct entities** in the threat dataset graph:
- **1 Correlated Alias**: shadow_fox (98% Confidence)
- **1 PGP Public Key**: 0xDD31FFB107B3DD6287955B57D6AD04797FBCF96A
- **1 Controlled Wallet**: 0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a
- **2 Underground Forums**: Dread, BreachForums
- **9 Multi-Hop Transaction Counterparties**: Linked through on-chain transfers`;
        tags = ['Graph Degree 14', 'Dataset Verified'];
      } else if (q.includes('alert') || q.includes('coordinated activity')) {
        aiResponseText = `Critical Alert **ALT-4402** was triggered due to a **Coordinated Syndicate Pattern**:
- **Trigger**: Cross-forum credential dump and escrow activity spike detected across shadowfox and correlated accounts.
- **Indicators**: Exact PGP key sharing and synchronized blockchain transfers.
- **Confidence**: 98% correlation confidence.`;
        tags = ['Alert ALT-4402', 'Cross-Forum PGP Share', 'Dataset Confirmed'];
      } else if (q.includes('summarize') || q.includes('investigation') || q.includes('inv-1027')) {
        aiResponseText = `**Investigation Summary: INV-1027 (Operation Shadow Veil)**
- **Target**: shadowfox (Primary Threat Actor)
- **Status**: ACTIVE | Lead: Investigator K. Raman
- **Key Finding**: De-anonymization trail confirmed through authentic dataset evidence: Forum Profile (shadowfox on Dread) → PGP Key (0xDD31FFB1...) → Shared Wallet (0xdd31ffb107b3dd6287955b57d6ad04797fbcf96a) → Correlated Alias (shadow_fox on BreachForums).`;
        tags = ['INV-1027 Dossier', 'Dataset De-anonymization Lead'];
      } else {
        aiResponseText = `Based on current intelligence data in the UNMASK v2.3 repository for query "${query}":
Multiple authentic correlations exist across observed forum posts, cryptocurrency transaction trails, and infrastructure telemetry. The system identifies strong operational indicators for **shadowfox** (Risk: 92/100, Confidence: 98%) and **darkwolf** (Risk: 88/100). All findings represent algorithmic investigative leads subject to analyst verification.`;
        tags = ['Grounded Query Result', 'Dataset v2.3 Active'];
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'AI',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC',
        text: aiResponseText,
        evidenceTags: tags,
        suggestedAction
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 650);
  };

  const samplePrompts = [
    'Why is shadowfox high risk?',
    'Why are shadowfox and shadow_fox correlated?',
    'What entities are connected to shadowfox?',
    'Summarize active investigation INV-1027',
    'What caused the critical coordinated activity alert?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-[#030918]/65 backdrop-blur-2xl border-l border-[#1e90ff]/40 shadow-[-20px_0_50px_rgba(0,0,0,0.85)] flex flex-col font-mono-code animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-16 px-5 border-b border-[#1e90ff]/25 flex items-center justify-between bg-[#020612]/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-auto flex items-center justify-center shrink-0 relative">
            <div className="absolute -inset-1 rounded-full border border-blue-400/40 border-dashed animate-[rotate-hud-cw_20s_linear_infinite]" />
            <img src="/unmask-logo.png" alt="UNMASK ANALYST AI" className="h-10 w-auto object-contain relative z-10" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-sm tracking-wide font-display-tactical drop-shadow-[0_0_10px_rgba(30,144,255,0.7)]">
                UNMASK ANALYST AI
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#081a38] text-[#93c5fd] border border-[#1e90ff]/50 font-semibold shadow-[0_0_8px_rgba(30,144,255,0.3)]">
                RAG v4.1
              </span>
            </div>
            <span className="text-[10px] text-[#38bdf8]">
              Explainable Evidentiary Reasoning Engine
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-[#07132a]/60 text-slate-400 hover:text-white border border-[#1e3a6a] hover:border-[#1e90ff]/50 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col space-y-1.5 ${
              msg.sender === 'USER' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 px-1">
              <span>{msg.sender === 'AI' ? 'UNMASK ANALYST AI' : 'ANALYST'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed backdrop-blur-md ${
                msg.sender === 'USER'
                  ? 'bg-[#0e2a5c]/80 border border-[#1e90ff]/60 text-white rounded-tr-none shadow-[0_0_15px_rgba(30,144,255,0.25)]'
                  : 'bg-[#040c1e]/70 border border-[#1e3a6a] text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line text-xs font-mono-code">
                {msg.text}
              </div>

              {/* Evidence Tags */}
              {msg.evidenceTags && msg.evidenceTags.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1e3a6a]/60 flex flex-wrap gap-1.5">
                  {msg.evidenceTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-[#081a38] text-[#93c5fd] border border-[#1e90ff]/40 font-bold flex items-center gap-1 shadow-[0_0_6px_rgba(30,144,255,0.2)]"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#38bdf8]" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Suggested One-Click Action */}
              {msg.suggestedAction && (
                <div className="mt-3 pt-2">
                  <button
                    onClick={() => {
                      if (msg.suggestedAction?.actionType === 'FOCUS_GRAPH' && onFocusGraphActor) {
                        onFocusGraphActor(msg.suggestedAction.payload);
                      }
                      if (onNavigateToModule) onNavigateToModule('THREAT_GRAPH');
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-lg hud-button-primary text-xs font-bold flex items-center justify-between transition-all"
                  >
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 p-3 bg-[#040c1e]/70 rounded-xl border border-[#1e90ff]/40 max-w-[70%] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#1E90FF] animate-ping"></span>
            <span className="text-[11px] text-[#93c5fd] animate-pulse">
              Correlating synthetic intelligence evidence...
            </span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggested Fast Prompts */}
      <div className="p-3 border-t border-[#1e90ff]/20 bg-[#020612]/50 backdrop-blur-md">
        <span className="text-[10px] text-[#60a5fa] uppercase tracking-wider block mb-1.5 font-bold">
          Suggested Evidence Queries
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] px-2.5 py-1 rounded bg-[#07132a]/70 hover:bg-[#0c1f44] border border-[#1e3a6a] hover:border-[#1e90ff]/60 text-slate-300 hover:text-white transition-all text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-[#1e90ff]/25 bg-[#030816]/60 backdrop-blur-md">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask AI Analyst about correlation, risk, or evidence..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            className="flex-1 bg-[#07132a]/70 border border-[#1e3a6a] focus:border-[#1e90ff] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono-code focus:shadow-[0_0_15px_rgba(30,144,255,0.25)]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="p-2.5 rounded-xl hud-button-primary text-white disabled:opacity-40 transition-all shadow-[0_0_14px_rgba(30,144,255,0.4)] cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[9px] text-slate-400 text-center block mt-1.5">
          All conclusions strictly formulated as Potential Correlations and Investigative Leads.
        </span>
      </div>
    </div>
  );
};
