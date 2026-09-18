import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  UserCheck, 
  Network, 
  Search, 
  BellRing, 
  BarChart3, 
  FileText, 
  Shield,
  ShieldAlert,
  Database,
  Radio
} from 'lucide-react';

export type AppModule = 
  | 'COMMAND_CENTER'
  | 'COMPLAINTS'
  | 'DATASETS'
  | 'NETWORK_THREATS'
  | 'INVESTIGATIONS'
  | 'ACTOR_INTELLIGENCE'
  | 'THREAT_GRAPH'
  | 'SEARCH'
  | 'ALERTS'
  | 'ANALYTICS'
  | 'REPORTS'
  | 'AUDIT_LOGS'
  | 'PROFILE';

interface TacticalSidebarProps {
  currentModule: AppModule;
  onSelectModule: (module: AppModule) => void;
  activeAlertsCount: number;
  activeInvestigationsCount: number;
  complaintsCount?: number;
  theme?: 'dark' | 'light';
}

export const TacticalSidebar: React.FC<TacticalSidebarProps> = ({
  currentModule,
  onSelectModule,
  activeAlertsCount,
  activeInvestigationsCount,
  complaintsCount = 5,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const navItems = [
    {
      id: 'COMMAND_CENTER' as AppModule,
      label: 'Command center',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'COMPLAINTS' as AppModule,
      label: 'Citizen complaints',
      icon: ShieldAlert,
      badge: `${complaintsCount || 5}`,
      badgeColor: isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#181f2e] text-slate-300 border-[#2b374e]'
    },
    {
      id: 'DATASETS' as AppModule,
      label: 'Dataset management',
      icon: Database,
      badge: 'ASYNC',
      badgeColor: isLight ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-[#081a38] text-[#93c5fd] border-[#1e90ff]/40 shadow-[0_0_8px_rgba(30,144,255,0.2)]'
    },
    {
      id: 'NETWORK_THREATS' as AppModule,
      label: 'Network threat intel',
      icon: Radio,
      badge: 'UNSW',
      badgeColor: isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-[#042018] text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
    },
    {
      id: 'INVESTIGATIONS' as AppModule,
      label: 'Investigations',
      icon: FolderGit2,
      badge: '4',
      badgeColor: isLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#081a38] text-[#93c5fd] border-[#1e90ff]/30'
    },
    {
      id: 'ACTOR_INTELLIGENCE' as AppModule,
      label: 'Suspects & attribution',
      icon: UserCheck,
      badge: 'TARGETS',
      badgeColor: isLight ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-[#2a0814] text-rose-400 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
    },
    {
      id: 'THREAT_GRAPH' as AppModule,
      label: 'Threat graph',
      icon: Network,
      badge: '3D',
      badgeColor: isLight ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-[#0e2a5c] text-[#60a5fa] border-[#1e90ff]/50 shadow-[0_0_10px_rgba(30,144,255,0.3)]'
    },
    {
      id: 'SEARCH' as AppModule,
      label: 'Intelligence search',
      icon: Search,
      badge: null
    },
    {
      id: 'ALERTS' as AppModule,
      label: 'Alerts & triage',
      icon: BellRing,
      badge: '2',
      badgeColor: isLight ? 'bg-red-50 text-red-700 border-red-300' : 'bg-red-950/70 text-red-400 border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
    },
    {
      id: 'ANALYTICS' as AppModule,
      label: 'Threat analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'REPORTS' as AppModule,
      label: 'Dossier reports',
      icon: FileText,
      badge: null
    },
    {
      id: 'AUDIT_LOGS' as AppModule,
      label: 'Security audit logs',
      icon: Shield,
      badge: 'AUDIT',
      badgeColor: isLight ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-rose-950/70 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
    }
  ];

  return (
    <aside className={`w-60 flex flex-col justify-between p-3 shrink-0 select-none z-20 transition-colors relative ${
      isLight 
        ? 'bg-white border-r border-slate-200' 
        : 'bg-[#020713]/35 backdrop-blur-md border-r border-[#1e90ff]/20 shadow-[4px_0_24px_rgba(2,8,22,0.35)]'
    }`}>
      {/* Navigation List */}
      <div className="space-y-1 pt-1 relative z-10">
        <div className="px-3 pb-2 text-[11px] font-semibold text-[#60a5fa] tracking-wider uppercase font-mono flex items-center justify-between">
          <span>Operational HUD</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e90ff] animate-pulse" />
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-all group cursor-pointer ${
                isActive
                  ? (isLight
                      ? 'bg-blue-50 text-blue-900 font-semibold shadow-xs border border-blue-200'
                      : 'hud-active-nav')
                  : (isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#081530]/60 hover:border-l-2 hover:border-[#1e90ff]/60')
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive 
                    ? (isLight ? 'text-blue-700' : 'text-[#38bdf8] drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]')
                    : (isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-slate-400 group-hover:text-[#60a5fa]')
                }`} />
                <span className="truncate text-xs font-medium">{item.label}</span>
              </div>

              {isActive && !isLight && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF] shrink-0" />
              )}

              {item.badge && !isActive && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border shrink-0 ${
                  item.badgeColor || (isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-[#081a38] text-slate-300 border-[#1e90ff]/30')
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Status Card */}
      <div className={`p-3 rounded-lg border space-y-1.5 text-xs relative z-10 ${
        isLight 
          ? 'bg-slate-50 border-slate-200' 
          : 'hud-card border-[#1e90ff]/30'
      }`}>
        <div className={`flex items-center justify-between font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          <span className="flex items-center gap-1.5 text-slate-200">
            <Shield className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="font-semibold">NTRO Secure Node</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </span>
        </div>
        <div className={`text-[10px] flex items-center justify-between font-mono ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <span>Telemetry: 12ms</span>
          <span className="text-[#60a5fa]">#IN-DL-09</span>
        </div>
      </div>
    </aside>
  );
};


