import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  CheckSquare,
  Clock,
  Sliders,
  Settings,
  Shield,
  ChevronRight,
  Menu,
  X,
  User,
  ArrowUpRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRoute, navigate, userSession, setUserRole, unsupportedClaimsCount } = useAppStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const workspaceNav = [
    { label: 'Overview', route: '#/overview', icon: LayoutDashboard },
    { label: 'Transform', route: '#/transform', icon: Sparkles, badge: '6 Stages' },
    { label: 'Library', route: '#/library', icon: FolderKanban },
    {
      label: 'Reviews',
      route: '#/reviews',
      icon: CheckSquare,
      count: unsupportedClaimsCount > 0 ? unsupportedClaimsCount : undefined,
      alert: unsupportedClaimsCount > 0
    },
    { label: 'Activity', route: '#/activity', icon: Clock },
  ];

  const secondaryNav = [
    { label: 'Communication Profiles', route: '#/profiles', icon: Sliders },
    { label: 'Settings', route: '#/settings', icon: Settings },
  ];

  const isCurrent = (route: string) => {
    if (route === '#/overview' && (currentRoute === '#/dashboard' || currentRoute === '#/' || currentRoute === '')) return true;
    if (route === '#/transform' && (currentRoute === '#/new-transformation' || currentRoute === '#/output-studio')) return true;
    if (route === '#/library' && (currentRoute === '#/documents' || currentRoute === '#/projects')) return true;
    if (route === '#/reviews' && (currentRoute === '#/review' || currentRoute === '#/source-evidence')) return true;
    if (route === '#/activity' && (currentRoute === '#/audit')) return true;
    return currentRoute === route;
  };

  const handleNavigate = (route: string) => {
    navigate(route);
    setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200/80 w-64 select-none">
      
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
        <div 
          onClick={() => handleNavigate('#/overview')} 
          className="cursor-pointer flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-subtle group-hover:bg-teal-900 transition-colors">
            SF
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] tracking-tight text-stone-900 font-sans">
                SourceFlow
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-200/60 font-mono">
                v2.6
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate max-w-[150px] font-normal leading-tight">
              One source. Many trusted outputs.
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        
        {/* Workspace Nav */}
        <div>
          <div className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Workspace
          </div>
          <nav className="space-y-0.5">
            {workspaceNav.map(item => {
              const active = isCurrent(item.route);
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavigate(item.route)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-stone-100 text-teal-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-teal-700' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.alert
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {item.count}
                    </span>
                  )}

                  {item.badge && !active && (
                    <span className="text-[10px] text-stone-600 font-normal">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Secondary Nav */}
        <div>
          <div className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Configuration
          </div>
          <nav className="space-y-0.5">
            {secondaryNav.map(item => {
              const active = isCurrent(item.route);
              const Icon = item.icon;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavigate(item.route)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-stone-100 text-teal-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Guide Pill */}
        <div className="mx-1 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-teal-900 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-teal-950 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Interactive Demo Ready</span>
          </div>
          <p className="text-[11px] text-teal-800 leading-snug">
            Transform cybersecurity intelligence into verified executive, technical, and media artefacts.
          </p>
        </div>

      </div>

      {/* User Footer Profile & Role Switcher */}
      <div className="p-3 border-t border-stone-100 bg-stone-50/50 relative">
        <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
          <div 
            onClick={() => setShowRoleMenu(prev => !prev)}
            className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
          >
            <div className="w-7 h-7 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-700 text-xs font-bold">
              {userSession.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-stone-900 truncate">
                {userSession.name}
              </div>
              <div className="text-[10px] text-stone-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{userSession.role}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRoleMenu(prev => !prev)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded"
            title="Switch User Role"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showRoleMenu ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Floating Role Switcher Menu */}
        {showRoleMenu && (
          <div className="absolute bottom-16 left-3 right-3 bg-white rounded-xl shadow-floating border border-stone-200 p-2 z-50 space-y-1 text-xs animate-in fade-in zoom-in-95">
            <div className="px-2 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
              Switch Session Role
            </div>
            {(['Reviewer', 'Approver', 'Content Operator'] as const).map(r => (
              <button
                key={r}
                onClick={() => {
                  setUserRole(r);
                  setShowRoleMenu(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                  userSession.role === r
                    ? 'bg-teal-50 text-teal-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex flex-col flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile Top Header with Hamburger */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
            SF
          </div>
          <span className="font-bold text-sm tracking-tight text-stone-900">
            SourceFlow
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md border border-stone-200"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
