// ============================================================
// UNMASK // NTRO CYBER INTELLIGENCE PLATFORM
// Master Application Orchestrator & Protected Gateway Router
// ============================================================

import React, { useState, useEffect } from 'react';
import { TacticalHeader } from './components/Layout/TacticalHeader';
import { TacticalSidebar, type AppModule } from './components/Layout/TacticalSidebar';
import { CommandPalette } from './components/Layout/CommandPalette';
import { AIAnalystDrawer } from './components/AIAnalyst/AIAnalystDrawer';
import { FuturisticHudBackground } from './components/Layout/FuturisticHudBackground';

// Views
import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { AdminLoginView } from './views/AdminLoginView';
import { CreateAccountView } from './views/CreateAccountView';
import { UserProfileView } from './views/UserProfileView';
import { AdminAuditLogsView } from './views/AdminAuditLogsView';
import { CitizenPortalView } from './views/CitizenPortalView';
import { CommandCenterView } from './views/CommandCenterView';
import { InvestigationsView } from './views/InvestigationsView';
import { ActorIntelligenceView } from './views/ActorIntelligenceView';
import { ThreatGraphView } from './views/ThreatGraphView';
import { IntelligenceSearchView } from './views/IntelligenceSearchView';
import { AlertsView } from './views/AlertsView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReportsView } from './views/ReportsView';
import { AdminComplaintsView } from './views/AdminComplaintsView';
import { DatasetManagement } from './components/Admin/DatasetManagement';
import { NetworkThreatView } from './views/NetworkThreatView';

import { THREAT_ALERTS, INVESTIGATIONS } from './data/mockIntelligence';
import { ComplaintService } from './services/complaintStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatasetProvider } from './context/DatasetContext';
import { DatasetUploadModal } from './components/ThreatGraph/DatasetUploadModal';

type NavigationRoute = 
  | 'HOME' 
  | 'REPORT' 
  | 'LOGIN' 
  | 'ADMIN_LOGIN'
  | 'CREATE_ACCOUNT' 
  | 'PROFILE' 
  | 'ADMIN_DASHBOARD' 
  | 'ADMIN_AUDIT_LOGS';

function AppContent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Master Router State based on URL Hash
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(() => {
    if (typeof window === 'undefined') return 'HOME';
    const hash = window.location.hash.toLowerCase();
    if (hash === '#/report' || hash === '#/complaint') return 'REPORT';
    if (hash === '#/admin/login') return 'ADMIN_LOGIN';
    if (hash === '#/login') return 'LOGIN';
    if (hash === '#/create-account' || hash === '#/register') return 'CREATE_ACCOUNT';
    if (hash === '#/profile') return 'PROFILE';
    if (hash === '#/admin/audit-logs') return 'ADMIN_AUDIT_LOGS';
    if (hash === '#/admin' || hash === '#/admin/dashboard') {
      return 'ADMIN_DASHBOARD';
    }
    return 'HOME';
  });

  const [currentModule, setCurrentModule] = useState<AppModule>('COMMAND_CENTER');
  const [selectedActorName, setSelectedActorName] = useState<string>('shadowfox');
  const [focusedGraphActor, setFocusedGraphActor] = useState<string | null>('shadowfox');
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Unread Alerts & Active Investigations Count
  const unreadAlertsCount = THREAT_ALERTS.filter(a => a.status === 'NEW').length;
  const activeInvestigationsCount = INVESTIGATIONS.filter(i => i.status === 'ACTIVE').length;

  // Unresolved Citizen Complaints Count
  const [unresolvedComplaintsCount, setUnresolvedComplaintsCount] = useState<number>(() => {
    const all = ComplaintService.getComplaints();
    return all.filter(c => c.status !== 'RESOLVED' && c.status !== 'DISMISSED').length;
  });

  useEffect(() => {
    const unsub = ComplaintService.subscribe(all => {
      setUnresolvedComplaintsCount(all.filter(c => c.status !== 'RESOLVED' && c.status !== 'DISMISSED').length);
    });
    return unsub;
  }, []);

  // Sync master router with browser window hash & enforce authentication protection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#/report' || hash === '#/complaint') {
        setCurrentRoute('REPORT');
      } else if (hash === '#/admin/login') {
        setCurrentRoute('ADMIN_LOGIN');
      } else if (hash === '#/login') {
        setCurrentRoute('LOGIN');
      } else if (hash === '#/create-account' || hash === '#/register') {
        setCurrentRoute('CREATE_ACCOUNT');
      } else if (hash === '#/profile') {
        setCurrentRoute('PROFILE');
      } else if (hash === '#/admin/audit-logs') {
        setCurrentRoute('ADMIN_AUDIT_LOGS');
      } else if (hash === '#/admin' || hash === '#/admin/dashboard') {
        setCurrentRoute('ADMIN_DASHBOARD');
      } else {
        setCurrentRoute('HOME');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: NavigationRoute) => {
    setCurrentRoute(route);
    switch (route) {
      case 'HOME':
        window.location.hash = '#/';
        break;
      case 'REPORT':
        window.location.hash = '#/report';
        break;
      case 'LOGIN':
        window.location.hash = '#/login';
        break;
      case 'ADMIN_LOGIN':
        window.location.hash = '#/admin/login';
        break;
      case 'CREATE_ACCOUNT':
        window.location.hash = '#/create-account';
        break;
      case 'PROFILE':
        window.location.hash = '#/profile';
        break;
      case 'ADMIN_AUDIT_LOGS':
        window.location.hash = '#/admin/audit-logs';
        break;
      case 'ADMIN_DASHBOARD':
        window.location.hash = '#/admin';
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('LOGIN');
  };

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('unmask_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.body.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('unmask_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ============================================================
  // ROUTE 1: PUBLIC LANDING PAGE (#/ or #/home)
  // ============================================================
  if (currentRoute === 'HOME') {
    return (
      <LandingPageView
        onNavigateToReport={() => navigateTo('REPORT')}
        onNavigateToLogin={() => navigateTo('LOGIN')}
        onNavigateToAdminLogin={() => navigateTo('ADMIN_LOGIN')}
        onNavigateToRegister={() => navigateTo('CREATE_ACCOUNT')}
        onNavigateToProfile={() => navigateTo('PROFILE')}
        onNavigateToDashboard={() => navigateTo('ADMIN_DASHBOARD')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ============================================================
  // ROUTE 2: DEDICATED CYBER THREAT REPORTING PORTAL (#/report)
  // ============================================================
  if (currentRoute === 'REPORT') {
    return (
      <CitizenPortalView
        onNavigateToAdmin={() => navigateTo('ADMIN_LOGIN')}
        onNavigateToHome={() => navigateTo('HOME')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ============================================================
  // ROUTE 3: CITIZEN / USER LOGIN VIEW (#/login)
  // ============================================================
  if (currentRoute === 'LOGIN') {
    return (
      <LoginView
        onLoginSuccess={(loggedUser) => {
          if (loggedUser?.role === 'ADMIN') {
            navigateTo('ADMIN_DASHBOARD');
          } else {
            navigateTo('PROFILE');
          }
        }}
        onNavigateToRegister={() => navigateTo('CREATE_ACCOUNT')}
        onNavigateToAdminLogin={() => navigateTo('ADMIN_LOGIN')}
        onNavigateHome={() => navigateTo('HOME')}
        theme={theme}
      />
    );
  }

  // ============================================================
  // ROUTE 3B: DEFENSE COMMAND ADMIN LOGIN VIEW (#/admin/login)
  // ============================================================
  if (currentRoute === 'ADMIN_LOGIN') {
    return (
      <AdminLoginView
        onLoginSuccess={() => {
          navigateTo('ADMIN_DASHBOARD');
        }}
        onNavigateToUserLogin={() => navigateTo('LOGIN')}
        onNavigateHome={() => navigateTo('HOME')}
        theme={theme}
      />
    );
  }

  // ============================================================
  // ROUTE 4: CREATE ACCOUNT VIEW (#/create-account or #/register)
  // ============================================================
  if (currentRoute === 'CREATE_ACCOUNT') {
    return (
      <CreateAccountView
        onRegisterSuccess={() => navigateTo('PROFILE')}
        onNavigateToLogin={() => navigateTo('LOGIN')}
        onNavigateHome={() => navigateTo('HOME')}
        theme={theme}
      />
    );
  }

  // ============================================================
  // ROUTE 5: USER PROFILE VIEW (#/profile)
  // ============================================================
  if (currentRoute === 'PROFILE') {
    return (
      <div className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 ${
        theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#050811] text-slate-100'
      }`}>
        <TacticalHeader
          onOpenSearch={() => { navigateTo('ADMIN_DASHBOARD'); setCurrentModule('SEARCH'); }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleAIAnalyst={() => setIsAIOpen(prev => !prev)}
          isAIOpen={isAIOpen}
          unreadAlertsCount={unreadAlertsCount}
          activeInvestigationCount={activeInvestigationsCount}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateToCitizenPortal={() => navigateTo('REPORT')}
          onNavigateToHome={() => navigateTo('HOME')}
          onNavigateToProfile={() => navigateTo('PROFILE')}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
          <UserProfileView
            onNavigateHome={() => navigateTo('HOME')}
            onNavigateToDashboard={() => navigateTo('ADMIN_DASHBOARD')}
            theme={theme}
          />
        </main>
      </div>
    );
  }

  // ============================================================
  // ROUTE 6: ADMIN AUDIT LOGS (#/admin/audit-logs)
  // ============================================================
  if (currentRoute === 'ADMIN_AUDIT_LOGS') {
    if (!isAuthenticated) {
      navigateTo('LOGIN');
      return null;
    }
    return (
      <div className={`min-h-screen flex flex-col font-sans relative selection:bg-blue-500/30 selection:text-blue-200 ${
        theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020713] text-slate-100'
      }`}>
        <FuturisticHudBackground theme={theme} />
        <TacticalHeader
          onOpenSearch={() => { navigateTo('ADMIN_DASHBOARD'); setCurrentModule('SEARCH'); }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleAIAnalyst={() => setIsAIOpen(prev => !prev)}
          isAIOpen={isAIOpen}
          unreadAlertsCount={unreadAlertsCount}
          activeInvestigationCount={activeInvestigationsCount}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateToCitizenPortal={() => navigateTo('REPORT')}
          onNavigateToHome={() => navigateTo('HOME')}
          onNavigateToProfile={() => navigateTo('PROFILE')}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto relative z-10">
          <AdminAuditLogsView
            onNavigateBack={() => navigateTo('ADMIN_DASHBOARD')}
            theme={theme}
          />
        </main>
      </div>
    );
  }

  // ============================================================
  // ROUTE 7: PROTECTED ADMIN DASHBOARD WORKSPACE (#/admin)
  // ============================================================
  if (!isAuthenticated) {
    navigateTo('LOGIN');
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200 ${
      theme === 'light' ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#020713] text-slate-100'
    }`}>
      {/* Sci-Fi Futuristic HUD Background Canvas + Rotating Dial */}
      <FuturisticHudBackground theme={theme} />

      {/* Top HUD Header Bar */}
      <TacticalHeader
        onOpenSearch={() => setCurrentModule('SEARCH')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleAIAnalyst={() => setIsAIOpen(prev => !prev)}
        isAIOpen={isAIOpen}
        unreadAlertsCount={unreadAlertsCount}
        activeInvestigationCount={activeInvestigationsCount}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateToCitizenPortal={() => navigateTo('REPORT')}
        onNavigateToHome={() => navigateTo('HOME')}
        onNavigateToProfile={() => navigateTo('PROFILE')}
        onLogout={handleLogout}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Persistent Left Tactical Sidebar */}
        <TacticalSidebar
          currentModule={currentModule}
          onSelectModule={(mod) => {
            if (mod === 'AUDIT_LOGS') {
              navigateTo('ADMIN_AUDIT_LOGS');
            } else if (mod === 'PROFILE') {
              navigateTo('PROFILE');
            } else {
              setCurrentModule(mod);
            }
          }}
          activeAlertsCount={unreadAlertsCount}
          activeInvestigationsCount={activeInvestigationsCount}
          complaintsCount={unresolvedComplaintsCount}
          theme={theme}
        />

        {/* Dynamic Center Viewport */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {currentModule === 'COMMAND_CENTER' && (
            <CommandCenterView
              onNavigateToModule={setCurrentModule}
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onFocusGraphActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
            />
          )}

          {currentModule === 'COMPLAINTS' && (
            <AdminComplaintsView
              onFocusThreatGraph={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'DATASETS' && (
            <div className="p-4 md:p-6">
              <DatasetManagement
                onNavigateToThreatGraph={() => setCurrentModule('THREAT_GRAPH')}
                theme={theme}
              />
            </div>
          )}

          {currentModule === 'NETWORK_THREATS' && (
            <NetworkThreatView
              onNavigateToActorProfile={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
                setCurrentModule('ACTOR_INTELLIGENCE');
              }}
              onNavigateToThreatGraph={() => setCurrentModule('THREAT_GRAPH')}
            />
          )}

          {currentModule === 'INVESTIGATIONS' && (
            <InvestigationsView
              onNavigateToModule={setCurrentModule}
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onFocusGraphActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
            />
          )}

          {currentModule === 'ACTOR_INTELLIGENCE' && (
            <ActorIntelligenceView
              selectedActorName={selectedActorName}
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onFocusThreatGraph={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'THREAT_GRAPH' && (
            <ThreatGraphView
              focusedActorName={focusedGraphActor}
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'SEARCH' && (
            <IntelligenceSearchView
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onFocusThreatGraph={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'ALERTS' && (
            <AlertsView
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onFocusThreatGraph={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'ANALYTICS' && (
            <AnalyticsView
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}

          {currentModule === 'REPORTS' && (
            <ReportsView
              selectedActorName={selectedActorName}
              onSelectActor={(actor) => {
                setSelectedActorName(actor);
                setFocusedGraphActor(actor);
              }}
              onNavigateToModule={setCurrentModule}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentModule}
        onSelectActor={(actor) => {
          setSelectedActorName(actor);
          setFocusedGraphActor(actor);
        }}
        onFocusThreatGraph={(actor) => {
          if (actor) {
            setSelectedActorName(actor);
            setFocusedGraphActor(actor);
          }
        }}
      />

      {/* Persistent AI Analyst Drawer */}
      <AIAnalystDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onNavigateToModule={(mod) => setCurrentModule(mod as AppModule)}
        onFocusGraphActor={(actor) => {
          setSelectedActorName(actor);
          setFocusedGraphActor(actor);
        }}
      />

      {/* Global Dataset Upload & Processing Stepper Modal */}
      <DatasetUploadModal 
        onInspectSuspect={(actor) => {
          setSelectedActorName(actor);
          setFocusedGraphActor(actor);
          setCurrentModule('ACTOR_INTELLIGENCE');
        }}
        onExploreGraph={(actor) => {
          setSelectedActorName(actor);
          setFocusedGraphActor(actor);
          setCurrentModule('THREAT_GRAPH');
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <DatasetProvider>
        <AppContent />
      </DatasetProvider>
    </AuthProvider>
  );
}

export default App;
