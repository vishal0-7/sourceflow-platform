import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ShieldCheck, AlertTriangle, CheckCircle2, Columns, ArrowRight, Award } from 'lucide-react';

interface GroundingMetricsPaneProps {
  onApprove: () => void;
}

export const GroundingMetricsPane: React.FC<GroundingMetricsPaneProps> = ({ onApprove }) => {
  const { outputDossier, claimsList, navigate, setSelectedClaim, activeJob } = useAppStore();

  const flaggedClaims = claimsList.filter(c => c.status === 'NEEDS_REVIEW');
  const isApproved = activeJob.status === 'HUMAN_APPROVED' || activeJob.status === 'EXPORTED';

  return (
    <div className="w-full lg:w-[360px] bg-surface-container-lowest border-l border-outline-variant p-space-lg overflow-y-auto space-y-6 flex-shrink-0">
      
      {/* Content Integrity Score */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
            Content Integrity
          </span>
          <span className="font-code-sm text-xs text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
            High Quality
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="font-headline-xl text-3xl font-bold tracking-tight text-on-surface">
            {outputDossier.integrityScore}
          </span>
          <span className="text-on-surface-variant font-body-sm text-xs">/ 100</span>
        </div>

        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-700 h-full rounded-full transition-all duration-500"
            style={{ width: `${outputDossier.integrityScore}%` }}
          ></div>
        </div>
      </div>

      {/* 4 Streamlined Metric Tiles */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
          <span className="font-body-sm text-[11px] text-on-surface-variant">Source Support</span>
          <p className="font-headline-md text-lg font-bold text-on-surface mt-0.5">
            {outputDossier.groundingScore}%
          </p>
        </div>

        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
          <span className="font-body-sm text-[11px] text-on-surface-variant">Consistency</span>
          <p className="font-headline-md text-lg font-bold text-on-surface mt-0.5">
            {outputDossier.consistencyScore}%
          </p>
        </div>

        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
          <span className="font-body-sm text-[11px] text-on-surface-variant">Claims</span>
          <p className="font-headline-md text-lg font-bold text-on-surface mt-0.5">
            {claimsList.length}
          </p>
        </div>

        <div className={`p-3 rounded-lg border transition-all ${
          flaggedClaims.length > 0 ? 'bg-amber-50 border-amber-300' : 'bg-surface-container-low border-outline-variant/60'
        }`}>
          <span className="font-body-sm text-[11px] text-on-surface-variant">Needs Review</span>
          <p className={`font-headline-md text-lg font-bold mt-0.5 ${
            flaggedClaims.length > 0 ? 'text-amber-950 font-bold' : 'text-on-surface'
          }`}>
            {flaggedClaims.length}
          </p>
        </div>
      </div>

      {/* Flagged Item Action Prompt */}
      {flaggedClaims.length > 0 ? (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>1 Claim Requires Review</span>
          </div>
          <p className="text-body-sm text-xs text-amber-950 leading-relaxed">
            Claim #5 contains an apparent contradiction with source telemetry on Page 19.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedClaim(flaggedClaims[0]);
              navigate('#/source-evidence');
            }}
            icon={<Columns className="w-3.5 h-3.5 text-secondary" />}
            className="w-full justify-center bg-white border-amber-300 font-bold text-amber-950 hover:bg-amber-100/50"
          >
            Review Evidence Now
          </Button>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center gap-2 text-emerald-900 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>All 23 claims verified and supported by source evidence.</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2 border-t border-outline-variant/60">
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('#/source-evidence')}
          icon={<Columns className="w-4 h-4 text-secondary" />}
          className="w-full justify-center"
        >
          View Evidence (Split)
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onApprove}
          icon={isApproved ? <CheckCircle2 className="w-4 h-4 text-tertiary-fixed" /> : <ShieldCheck className="w-4 h-4 text-tertiary-fixed" />}
          className="w-full justify-center shadow-xs font-semibold"
        >
          {isApproved ? 'Approved ✓' : 'Approve for Export'}
        </Button>
      </div>

    </div>
  );
};
