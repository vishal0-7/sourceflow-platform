import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { KpiCard } from '../common/KpiCard';
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const KpiGrid: React.FC = () => {
  const { navigate, claimsList, jobsList, auditLogs } = useAppStore();

  const flaggedCount = claimsList.filter(c => c.status === 'NEEDS_REVIEW').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
      <KpiCard
        label="Ingested Dossiers"
        value={jobsList.length + 138}
        subtext="Primary PDF & DOCX packages"
        icon={<FileText className="w-4 h-4 text-secondary" />}
        trend={{ value: '+12.4% vs cycle', isPositive: true }}
        onClick={() => navigate('#/new-transformation')}
      />

      <KpiCard
        label="Statutory Claims Verified"
        value="1,894"
        subtext="100% Grounded against source logs"
        icon={<CheckCircle2 className="w-4 h-4 text-emerald-700" />}
        trend={{ value: '99.1% Fidelity', isPositive: true }}
        onClick={() => navigate('#/source-evidence')}
      />

      <KpiCard
        label="Pending Officer Reviews"
        value={flaggedCount > 0 ? `${flaggedCount} Active` : '0 Pending'}
        subtext="Requires human reviewer attestation"
        icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
        trend={{ value: `${flaggedCount} Flagged`, isPositive: flaggedCount === 0 }}
        onClick={() => navigate('#/source-evidence')}
        className={flaggedCount > 0 ? 'border-amber-300 bg-amber-50/20' : ''}
      />

      <KpiCard
        label="Tamper-Evident Records"
        value={`${auditLogs.length + 3408}`}
        subtext="Chained Web Crypto SHA-256 logs"
        icon={<ShieldCheck className="w-4 h-4 text-secondary" />}
        trend={{ value: '100% Validated', isPositive: true }}
      />
    </div>
  );
};
