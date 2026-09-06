import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { ChevronLeft, ChevronRight, Flag, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

interface EvidenceHeaderProps {
  onPrevClaim: () => void;
  onNextClaim: () => void;
}

export const EvidenceHeader: React.FC<EvidenceHeaderProps> = ({ onPrevClaim, onNextClaim }) => {
  const {
    claimsList,
    selectedClaim,
    flaggedOnlyFilter,
    toggleFlaggedFilter,
    activeJob,
    navigate
  } = useAppStore();

  const flaggedCount = claimsList.filter(c => c.status === 'NEEDS_REVIEW').length;
  const supportedCount = claimsList.filter(c => c.status === 'SUPPORTED' || c.status === 'HUMAN_APPROVED').length;

  return (
    <div className="bg-surface-container-lowest border-b border-outline-variant px-console-margin py-3 flex flex-wrap items-center justify-between gap-space-md select-none">
      {/* Left Info: Claims Summary */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('#/output-studio')}
          className="p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Back to Output Studio"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Studio</span>
        </button>

        <div>
          <h2 className="font-headline-md text-base font-bold text-on-surface">
            Source Evidence & Verification
          </h2>
          <div className="flex items-center gap-3 text-xs font-code-sm mt-0.5">
            <span className="font-semibold text-on-surface">{claimsList.length} Claims</span>
            <span className="text-on-surface-variant">•</span>
            <span className="text-emerald-800 font-semibold">{supportedCount} Supported</span>
            <span className="text-on-surface-variant">•</span>
            {flaggedCount > 0 ? (
              <span className="text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                {flaggedCount} Needs Review
              </span>
            ) : (
              <span className="text-emerald-800 font-semibold">
                0 Needs Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Controls: Navigation and Filter Toggle */}
      <div className="flex items-center gap-2">
        {/* Toggle Flagged Filter */}
        <button
          onClick={toggleFlaggedFilter}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-xs font-semibold transition-colors border ${
            flaggedOnlyFilter
              ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-xs'
              : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant border-outline-variant/60'
          }`}
        >
          <Flag className={`w-3.5 h-3.5 ${flaggedOnlyFilter ? 'text-amber-700' : 'text-on-surface-variant'}`} />
          <span>Show Flagged ({flaggedCount})</span>
        </button>

        {/* Claim Navigation Buttons */}
        <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/60 p-0.5">
          <button
            onClick={onPrevClaim}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
            title="Previous Claim"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-code-sm text-xs text-on-surface font-semibold">
            Claim {selectedClaim ? selectedClaim.claimIndex : 1} / {claimsList.length}
          </span>
          <button
            onClick={onNextClaim}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded transition-colors"
            title="Next Claim"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

