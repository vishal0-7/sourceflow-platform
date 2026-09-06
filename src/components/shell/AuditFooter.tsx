import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { truncateHash } from '../../utils/hash';
import { ShieldCheck, Lock, FileCheck } from 'lucide-react';

export const AuditFooter: React.FC = () => {
  const { activeJob, auditLogs, userSession, setIsAuditDrawerOpen } = useAppStore();
  const latestAudit = auditLogs[auditLogs.length - 1];

  return (
    <footer className="h-8 w-full bg-primary text-on-primary px-console-margin flex items-center justify-between text-[11px] font-code-sm select-none border-t border-slate-800">
      <div className="flex items-center gap-space-md text-slate-300">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-tertiary-fixed inline" />
          <span className="font-semibold text-tertiary-fixed">TAMPER-EVIDENT AUDIT RECORD</span>
          <span className="text-slate-400 font-mono">[{auditLogs.length} Events Chained]</span>
        </div>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <button
          onClick={() => setIsAuditDrawerOpen(true)}
          className="text-slate-300 hover:text-white underline hidden sm:inline font-mono"
        >
          Head Digest: {truncateHash(latestAudit ? latestAudit.currentHash : activeJob.sha256, 6, 6)}
        </button>
      </div>

      <div className="flex items-center gap-space-md text-slate-400">
        <span className="hidden md:inline text-[10px] text-slate-400">
          Institutional Content Platform • Fictional Research Data
        </span>
        <div className="flex items-center gap-1 text-slate-300">
          <Lock className="w-3 h-3 text-tertiary-fixed" />
          <span>{userSession.name} ({userSession.role})</span>
        </div>
      </div>
    </footer>
  );
};
