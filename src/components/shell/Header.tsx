import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { UserRole } from '../../types/user';
import {
  Search,
  Bell,
  ChevronDown,
  UserCheck,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  Layers,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRoute,
    navigate,
    userSession,
    setUserRole,
    setIsSearchPaletteOpen,
    setIsSettingsModalOpen,
    unsupportedClaimsCount,
    transformation
  } = useAppStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', route: '#/dashboard' },
    { label: 'Transform', route: '#/transform' },
    { label: 'Documents', route: '#/documents' },
    {
      label: 'Review',
      route: '#/review',
      badge: unsupportedClaimsCount > 0 ? unsupportedClaimsCount : undefined
    },
    { label: 'Audit', route: '#/audit' },
  ];

  const roles: UserRole[] = ['Content Operator', 'Reviewer', 'Approver'];

  return (
    <header className="h-14 w-full px-4 lg:px-8 flex items-center justify-between gap-4 bg-surface-container-lowest border-b border-outline-variant/80 select-none z-30">
      
      {/* Left: Brand Identity & Primary Nav */}
      <div className="flex items-center gap-6 lg:gap-8">
        <div
          onClick={() => navigate('#/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-xs">
            <svg className="w-5 h-5 text-tertiary-fixed" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <span className="font-headline-md text-base font-bold text-on-surface tracking-tight leading-none block">
              SourceFlow
            </span>
            <span className="font-body-sm text-[10px] text-on-surface-variant leading-tight block">
              One source. Many trusted outputs.
            </span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => {
            const isActive = currentRoute === item.route || (item.route === '#/transform' && currentRoute === '#/new-transformation');
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-body-sm text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-surface-container text-on-surface font-semibold shadow-2xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Search, Notifications, Settings, User */}
      <div className="flex items-center gap-2.5">
        
        {/* Search Trigger */}
        <button
          onClick={() => setIsSearchPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-md border border-outline-variant/60 font-body-sm text-xs transition-colors"
          title="Search (Press ⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-surface-container-lowest border border-outline-variant rounded text-on-surface-variant">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-md transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unsupportedClaimsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-surface-container-lowest"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/60 font-bold text-on-surface">
                <span>Notifications</span>
                <span className="font-code-sm text-[10px] text-on-surface-variant">
                  {unsupportedClaimsCount > 0 ? `${unsupportedClaimsCount} pending` : 'All caught up'}
                </span>
              </div>
              <div className="py-2 space-y-2">
                {unsupportedClaimsCount > 0 ? (
                  <div
                    onClick={() => {
                      navigate('#/transform');
                      setIsNotificationsOpen(false);
                    }}
                    className="p-2 rounded bg-amber-50 hover:bg-amber-100/60 border border-amber-200 cursor-pointer"
                  >
                    <p className="font-bold text-amber-950 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Action Required: {unsupportedClaimsCount} Claims
                    </p>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Unsupported assertions in {transformation.title} require human review before approval.
                    </p>
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-center py-2">
                    No pending review alerts.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-md transition-colors"
          title="Platform Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile & Role Selector */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-2 py-1 bg-surface-container-low hover:bg-surface-container rounded-md border border-outline-variant/60 transition-colors"
          >
            <div className="w-6 h-6 rounded bg-primary text-tertiary-fixed flex items-center justify-center font-bold text-xs">
              {userSession.name[0]}
            </div>
            <span className="hidden sm:inline font-body-sm text-xs font-semibold text-on-surface">
              {userSession.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-60 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-xl py-1.5 z-50">
              <div className="px-3 py-2 border-b border-outline-variant/60">
                <p className="font-semibold text-on-surface text-xs">{userSession.name}</p>
                <p className="text-[11px] text-secondary font-medium">{userSession.designation}</p>
              </div>

              <div className="py-1">
                <p className="px-3 py-1 font-label-caps text-[10px] uppercase text-on-surface-variant font-bold">
                  Switch Active Role:
                </p>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                      userSession.role === r ? 'text-secondary font-bold bg-surface-container/50' : 'text-on-surface'
                    }`}
                  >
                    <span>{r}</span>
                    {userSession.role === r && <UserCheck className="w-3.5 h-3.5 text-secondary" />}
                  </button>
                ))}
              </div>

              <div className="px-3 py-1.5 border-t border-outline-variant/60 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    navigate('#/login');
                    setIsUserMenuOpen(false);
                  }}
                  className="text-on-surface-variant hover:text-on-surface flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Switch Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
