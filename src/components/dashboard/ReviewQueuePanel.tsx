import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AlertTriangle, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export const ReviewQueuePanel: React.FC = () => {
  const { claimsList, navigate, setSelectedClaim } = useAppStore();

  const flaggedClaims = claimsList.filter(c => c.status === 'NEEDS_REVIEW');

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg space-y-3">
      <div className="flex items-center justify-between border-b border-outline-variant pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="font-headline-md text-sm font-bold text-on-surface">
            Pending Officer Review Queue ({flaggedClaims.length})
          </h3>
        </div>
        <span className="font-code-sm text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
          ACTION REQUIRED
        </span>
      </div>

      {flaggedClaims.length > 0 ? (
        <div className="space-y-2">
          {flaggedClaims.map(claim => (
            <div
              key={claim.id}
              onClick={() => {
                setSelectedClaim(claim);
                navigate('#/source-evidence');
              }}
              className="p-3 rounded-lg bg-amber-50/50 hover:bg-amber-100/60 border border-amber-300 transition-colors cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-code-sm font-bold text-amber-950 font-mono">
                  CLAIM #{claim.claimIndex} • Page {claim.pageNumber}
                </span>
                <span className="font-code-sm text-[10px] text-amber-900 font-semibold">
                  Low Confidence: {claim.confidenceScore}%
                </span>
              </div>
              <p className="font-body-sm text-xs text-amber-950 line-clamp-2">
                "{claim.claimText}"
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] font-code-sm">
                <span className="text-amber-800 text-[10px]">
                  Reason: Contradiction with source evidence
                </span>
                <span className="text-secondary font-bold hover:underline flex items-center gap-1">
                  Inspect in Evidence Verifier <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-on-surface-variant text-xs space-y-1">
          <ShieldCheck className="w-6 h-6 text-emerald-700 mx-auto" />
          <p className="font-bold text-on-surface">All Claims Verified & Approved</p>
          <p className="text-[11px]">No items pending officer review in active queue.</p>
        </div>
      )}
    </div>
  );
};
