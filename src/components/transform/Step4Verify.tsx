import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { GroundingClaim } from '../../types/claim';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { DocumentViewerPane } from '../evidence/DocumentViewerPane';
import {
  CheckCircle2,
  AlertTriangle,
  Flag,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface Step4VerifyProps {
  onBack: () => void;
  onContinue: () => void;
}

export const Step4Verify: React.FC<Step4VerifyProps> = ({ onBack, onContinue }) => {
  const {
    transformation,
    selectedClaim,
    setSelectedClaim,
    flaggedOnlyFilter,
    toggleFlaggedFilter,
    supportedClaimsCount,
    unsupportedClaimsCount,
    resolvedClaimsCount,
    isApprovalBlocked,
    updateClaimStatus,
    editClaimPhrasing,
    deleteClaim
  } = useAppStore();

  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>('');

  const filteredClaims = flaggedOnlyFilter
    ? transformation.claims.filter(c => c.status === 'NEEDS_REVIEW' || c.status === 'UNSUPPORTED')
    : transformation.claims;

  const handleStartEdit = (claim: GroundingClaim) => {
    setEditingClaimId(claim.id);
    setEditedText(
      claim.id === 'CLM-005'
        ? 'Forensic memory dumps revealed that the adversary leveraged modified commodity Cobalt Strike beacons and PowerShell scripts alongside a single chained CVE-2025-4127 privilege escalation flaw.'
        : claim.id === 'CLM-017'
        ? 'Adversary dwell time inside the isolated honeypot perimeter was measured at exactly 4 hours and 18 minutes before automated heuristic rules triggered quarantine.'
        : claim.anchorPassage || claim.claimText
    );
  };

  const handleSaveEdit = async (claimId: string) => {
    await editClaimPhrasing(claimId, editedText);
    setEditingClaimId(null);
  };

  const handleAccept = async (claimId: string) => {
    await updateClaimStatus(claimId, 'SUPPORTED', 'Verified against primary source document.');
  };

  const handleReject = async (claimId: string) => {
    await updateClaimStatus(claimId, 'REJECTED', 'Marked rejected during human review.');
  };

  return (
    <div className="space-y-4">
      
      {/* Metrics Banner */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-base font-bold text-on-surface">
              Claim Verification & Grounding
            </h2>
            <span className="font-code-sm text-xs font-semibold px-2 py-0.5 rounded bg-primary text-on-primary">
              {transformation.claims.length} claims checked
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-code-sm mt-1">
            <span className="text-emerald-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              {supportedClaimsCount} Supported
            </span>
            <span className="text-on-surface-variant">•</span>
            <span className={`font-bold flex items-center gap-1 ${
              unsupportedClaimsCount > 0 ? 'text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded' : 'text-slate-500'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              {unsupportedClaimsCount} Need Review
            </span>
            <span className="text-on-surface-variant">•</span>
            <span className="text-on-surface-variant">
              {resolvedClaimsCount} Resolved Issues
            </span>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFlaggedFilter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body-sm text-xs font-semibold transition-colors border ${
              flaggedOnlyFilter
                ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-xs'
                : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border-outline-variant/60'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${flaggedOnlyFilter ? 'text-amber-700' : 'text-on-surface-variant'}`} />
            <span>Show Flagged Only ({unsupportedClaimsCount})</span>
          </button>
        </div>
      </div>

      {/* 50/50 Verification Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[580px] min-h-0">
        
        {/* Left Column: Claims List */}
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-outline-variant/60 text-xs font-label-caps uppercase text-on-surface-variant font-bold">
            <span>Derived Claims Matrix ({filteredClaims.length})</span>
            <span className="text-[10px] font-mono normal-case font-normal text-on-surface-variant">
              Click to jump to highlighted source passage
            </span>
          </div>

          {filteredClaims.map(claim => {
            const isSelected = selectedClaim?.id === claim.id;
            const isUnsupported = claim.status === 'NEEDS_REVIEW' || claim.status === 'UNSUPPORTED';
            const isEditing = editingClaimId === claim.id;

            return (
              <div
                key={claim.id}
                onClick={() => setSelectedClaim(claim)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                  isSelected
                    ? isUnsupported
                      ? 'border-2 border-amber-500 bg-amber-50/40 shadow-xs'
                      : 'border-2 border-secondary bg-surface-container-low shadow-xs'
                    : isUnsupported
                    ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
                    : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
                }`}
              >
                {/* Top Row: Claim Index & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-xs font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded font-mono">
                      Claim #{claim.claimIndex}
                    </span>
                    <span className="font-code-sm text-[11px] text-on-surface-variant font-medium">
                      Page {claim.pageNumber} • {claim.sectionTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge status={claim.status} />
                    <span className="font-code-sm text-[10px] text-on-surface-variant font-medium">
                      {claim.confidenceScore}% match
                    </span>
                  </div>
                </div>

                {/* Claim Text or Edit Form */}
                {isEditing ? (
                  <div className="space-y-2 pt-1" onClick={e => e.stopPropagation()}>
                    <label className="font-label-caps text-[10px] text-secondary uppercase font-bold">
                      Edit Claim Phrasing:
                    </label>
                    <textarea
                      value={editedText}
                      onChange={e => setEditedText(e.target.value)}
                      rows={3}
                      className="w-full bg-surface-container-lowest border-2 border-secondary rounded-lg p-2.5 text-xs text-on-surface focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingClaimId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveEdit(claim.id)}
                        icon={<Check className="w-3.5 h-3.5" />}
                      >
                        Save & Resolve
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="font-body-md text-xs text-on-surface leading-relaxed">
                    "{claim.claimText}"
                  </p>
                )}

                {/* Flagged Alert Box */}
                {isUnsupported && !isEditing && (
                  <div className="p-3 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span>Action Required: Contradiction Detected</span>
                    </div>
                    <p className="text-[11px] leading-normal font-sans">
                      {claim.flagReason}
                    </p>
                  </div>
                )}

                {/* Evidence Passage Anchor */}
                <div className="pt-2 border-t border-outline-variant/60 flex items-start gap-2 bg-surface-container-low/50 p-2 rounded">
                  <Bookmark className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] font-sans text-slate-700 leading-normal">
                    <span className="font-semibold text-on-surface">Evidence (Page {claim.pageNumber}):</span> "{claim.anchorPassage}"
                  </div>
                </div>

                {/* Action Buttons for Selected / Flagged Claims */}
                {isSelected && !isEditing && (
                  <div
                    className="pt-2 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1.5">
                      {isUnsupported && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStartEdit(claim)}
                          icon={<Edit2 className="w-3 h-3 text-tertiary-fixed" />}
                          className="bg-secondary text-on-secondary hover:bg-secondary/90 font-bold"
                        >
                          Replace with Exact Phrasing
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAccept(claim.id)}
                        icon={<Check className="w-3 h-3 text-emerald-700" />}
                      >
                        {claim.status === 'SUPPORTED' ? 'Supported ✓' : 'Accept & Verify'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(claim.id)}
                        icon={<X className="w-3 h-3 text-rose-700" />}
                      >
                        Reject
                      </Button>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteClaim(claim.id)}
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredClaims.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant font-body-sm text-xs">
              No claims match the active filter.
            </div>
          )}
        </div>

        {/* Right Column: PDF Source Document Viewer */}
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden flex flex-col min-h-0">
          <DocumentViewerPane />
        </div>

      </div>

      {/* Governance & Continue Bar */}
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isApprovalBlocked ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>{unsupportedClaimsCount} unsupported claims must be resolved before outputs can be approved.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Verification complete • All {transformation.claims.length} claims verified & ready for approval.</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            onClick={onBack}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Back to Configure
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onContinue}
            icon={<ArrowRight className="w-4 h-4 text-tertiary-fixed" />}
            className="shadow-xs font-semibold px-5"
          >
            Review Deliverables & Approve
          </Button>
        </div>
      </div>

    </div>
  );
};
