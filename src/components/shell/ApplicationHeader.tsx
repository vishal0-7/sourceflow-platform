import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/AppContext';
import { CreateWorkspaceModal } from '../workspace/CreateWorkspaceModal';
import { CreateDashboardModal } from '../workspace/CreateDashboardModal';
import {
  Layers,
  ChevronDown,
  Plus,
  Search,
  Settings,
  LogOut,
  Shield,
  Check,
  LayoutGrid,
  FileText,
  Sliders,
  Sparkles,
  ExternalLink,
  FolderOpen
} from 'lucide-react';
import { UserRole } from '../../types/user';

export const ApplicationHeader: React.FC = () => {
  const {
    currentRoute,
    navigate,
    workspaces,
    currentWorkspace,
    currentDashboard,
    selectWorkspace,
    selectDashboard,
    currentUser,
    setUserRole,
    setIsSearchPaletteOpen,
    setIsSettingsModalOpen,
    logout
  } = useAppStore();

  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateWsOpen, setIsCreateWsOpen] = useState(false);
  const [isCreateDashOpen, setIsCreateDashOpen] = useState(false);

  const wsMenuRef = useRef<HTMLDivElement>(null);
  const dashMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wsMenuRef.current && !wsMenuRef.current.contains(e.target as Node)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (dashMenuRef.current && !dashMenuRef.current.contains(e.target as Node)) {
        setIsDashboardMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', route: '#/overview' },
    { id: 'transform', label: 'Transform', route: '#/transform' },
    { id: 'library', label: 'Library', route: '#/library' },
    { id: 'reviews', label: 'Reviews', route: '#/reviews' },
    { id: 'activity', label: 'Activity', route: '#/activity' }
  ];

  const roles: UserRole[] = ['Content Operator', 'Reviewer', 'Approver'];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Left: Brand & Workspace Switcher */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate('#/overview')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-teal-900 transition-colors">
                <Layers className="w-4 h-4 text-teal-200" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-bold text-stone-900 tracking-tight leading-none">
                  SourceFlow
                </div>
                <div className="text-[10px] text-stone-500 font-medium tracking-tight mt-0.5">
                  One source. Many trusted outputs.
                </div>
              </div>
            </button>

            <div className="h-5 w-[1px] bg-stone-200 hidden sm:block" />

            {/* Workspace Switcher */}
            <div className="relative" ref={wsMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen);
                  setIsDashboardMenuOpen(false);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200/70 border border-stone-200/60 transition-all cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-teal-700" />
                <span className="max-w-[140px] truncate">
                  {currentWorkspace?.name || 'Select Workspace'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Workspace Dropdown */}
              {isWorkspaceMenuOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-floating border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Switch Workspace
                  </div>
                  {workspaces.map(ws => {
                    const isSelected = ws.id === currentWorkspace?.id;
                    return (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => {
                          selectWorkspace(ws.id);
                          setIsWorkspaceMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors text-left cursor-pointer"
                      >
                        <div className="truncate">
                          <div className="font-semibold">{ws.name}</div>
                          <div className="text-[10px] text-stone-400 truncate">{ws.description}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                  <div className="border-t border-stone-100 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsWorkspaceMenuOpen(false);
                      setIsCreateWsOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors text-left cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Workspace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsWorkspaceMenuOpen(false);
                      navigate('#/workspaces');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors text-left cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-stone-400" />
                    <span>All Workspaces</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dashboard Switcher */}
            {currentWorkspace && (
              <div className="relative hidden md:block" ref={dashMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsDashboardMenuOpen(!isDashboardMenuOpen);
                    setIsWorkspaceMenuOpen(false);
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-stone-400" />
                  <span className="max-w-[130px] truncate">
                    {currentDashboard?.name || 'Dashboard'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {/* Dashboard Dropdown */}
                {isDashboardMenuOpen && (
                  <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-floating border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Dashboards in {currentWorkspace.name}
                    </div>
                    {currentWorkspace.dashboards.map(dash => {
                      const isSelected = dash.id === currentDashboard?.id;
                      return (
                        <button
                          key={dash.id}
                          type="button"
                          onClick={() => {
                            selectDashboard(dash.id);
                            setIsDashboardMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors text-left cursor-pointer"
                        >
                          <span className="truncate">{dash.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                    <div className="border-t border-stone-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsDashboardMenuOpen(false);
                        setIsCreateDashOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 transition-colors text-left cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Dashboard</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive =
                currentRoute === item.route ||
                (item.id === 'overview' && (currentRoute === '#/dashboard' || currentRoute === '#/' || currentRoute === ''));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-teal-900 bg-teal-50/80 border border-teal-200/50'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Search, Settings, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Palette */}
            <button
              type="button"
              onClick={() => setIsSearchPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200/60 transition-colors cursor-pointer"
              title="Global Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Search...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[9px] font-mono bg-stone-100 border border-stone-200 rounded text-stone-400">
                ⌘K
              </kbd>
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Workspace Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile & Role Switcher */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsWorkspaceMenuOpen(false);
                  setIsDashboardMenuOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full border border-stone-200 hover:border-stone-300 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-teal-800 text-teal-100 text-[10px] font-bold flex items-center justify-center">
                  {currentUser?.avatar || 'KV'}
                </div>
                <span className="text-xs font-semibold text-stone-800 hidden sm:inline">
                  {currentUser?.name?.split(' ')[0] || 'Operator'}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-floating border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-stone-100">
                    <div className="font-bold text-xs text-stone-900">{currentUser?.name}</div>
                    <div className="text-[11px] text-stone-500 truncate">{currentUser?.email}</div>
                    <div className="text-[10px] text-teal-700 font-semibold mt-0.5">{currentUser?.designation}</div>
                  </div>

                  <div className="px-3.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Switch Active Role
                  </div>
                  {roles.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setUserRole(role);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 transition-colors text-left cursor-pointer"
                    >
                      <span className={currentUser?.role === role ? 'font-bold text-teal-800' : ''}>
                        {role}
                      </span>
                      {currentUser?.role === role && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </button>
                  ))}

                  <div className="border-t border-stone-100 my-1.5" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <CreateWorkspaceModal
        isOpen={isCreateWsOpen}
        onClose={() => setIsCreateWsOpen(false)}
      />

      <CreateDashboardModal
        isOpen={isCreateDashOpen}
        onClose={() => setIsCreateDashOpen(false)}
      />
    </>
  );
};
