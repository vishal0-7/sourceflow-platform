import React, { useState } from 'react';
import { GroundingClaim } from '../../types/claim';
import { useAppStore } from '../../store/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Check,
  X,
  FileText,
  CornerDownRight,
  ArrowDown
} from 'lucide-react';

interface ClaimCardProps {
  claim: GroundingClaim;
  isSelected: boolean;
  onSelect: () => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, isSelected, onSelect }) => {
  const { updateClaimStatus, editClaimPhrasing, deleteClaim } = useAppStore();
  const [isEditingPhrasing, setIsEditingPhrasing] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>(
    claim.id === 'CLM-005'
      ? 'Forensic memory dumps revealed that the adversary leveraged modified commodity Cobalt Strike beacons and PowerShell scripts alongside a single chained CVE-2025-4127 privilege escalation flaw.'
      : claim.id === 'CLM-017'
      ? 'Adversary dwell time inside the isolated honeypot perimeter was measured at exactly 4 hours and 18 minutes before automated heuristic rules triggered quarantine.'
      : claim.anchorPassage || claim.claimText
  );
  const [reviewerRemark, setReviewerRemark] = useState<string>(claim.reviewerNote || '');

  const isFlagged = claim.status === 'NEEDS_REVIEW' || claim.status === 'UNSUPPORTED';

  const handleSavePhrasing = async () => {
    await editClaimPhrasing(claim.id, editedText, reviewerRemark || 'Corrected phrasing to reflect source passage.');
    setIsEditingPhrasing(false);
  };

  const handleAccept = async () => {
    await updateClaimStatus(claim.id, 'SUPPORTED', reviewerRemark || 'Verified against primary source document.');
  };

  const handleReject = async () => {
    await updateClaimStatus(claim.id, 'REJECTED', reviewerRemark || 'Rejected claim during human review.');
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg border p-4 transition-all cursor-pointer ${
        isSelected
          ? isFlagged
            ? 'border-2 border-amber-500 bg-amber-50/40 shadow-xs'
            : 'border-2 border-secondary bg-surface-container-low shadow-xs'
          : isFlagged
          ? 'border-amber-300 bg-amber-50/20 hover:border-amber-400'
          : 'border-outline-variant/80 bg-surface-container-lowest hover:border-secondary/60'
      }`}
    >
      {/* Header: Claim Index & Status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-code-sm text-xs font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded font-mono">
            Claim #{claim.claimIndex}
          </span>
          <span className="font-code-sm text-[11px] text-on-surface-variant">
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

      {/* Generated Claim */}
      {isEditingPhrasing ? (
        <div className="space-y-2 mt-2" onClick={e => e.stopPropagation()}>
          <label className="font-label-caps text-[10px] text-secondary uppercase font-bold">
            Edit Phrasing:
          </label>
          <textarea
            value={editedText}
            onChange={e => setEditedText(e.target.value)}
            rows={3}
            className="w-full bg-surface-container-lowest border-2 border-secondary rounded p-2 text-body-sm text-on-surface focus:outline-none"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingPhrasing(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSavePhrasing}
              icon={<Check className="w-3.5 h-3.5" />}
            >
              Save & Resolve
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-1">
          <p className="font-body-md text-xs text-on-surface leading-relaxed">
            "{claim.claimText}"
          </p>
        </div>
      )}

      {/* Selected Detailed Flow */}
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-outline-variant/60 space-y-2.5 text-xs">
          {/* Source Reference */}
          <div className="flex items-start gap-2 text-on-surface-variant">
            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant font-semibold w-24 flex-shrink-0">
              Source Ref:
            </span>
            <span className="text-on-surface font-medium font-code-sm text-[11px]">
              Page {claim.pageNumber} • {claim.sourceReference}
            </span>
          </div>

          {/* Evidence Quote */}
          <div className="flex items-start gap-2 bg-surface-container/60 p-2.5 rounded border border-outline-variant/40">
            <span className="font-label-caps text-[10px] uppercase text-secondary font-bold w-24 flex-shrink-0">
              Evidence:
            </span>
            <span className="text-slate-800 text-[11px] italic leading-relaxed">
              "{claim.anchorPassage}"
            </span>
          </div>

          {/* Flagged Alert if any */}
          {isFlagged && !isEditingPhrasing && (
            <div className="p-2.5 rounded bg-amber-100 border border-amber-300 text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                <span>Action Required: Contradiction Detected</span>
              </div>
              <p className="text-[11px] leading-normal font-sans">
                {claim.flagReason}
              </p>
            </div>
          )}

          {/* Reviewer Note if any */}
          {claim.reviewerNote && !isEditingPhrasing && (
            <div className="text-[11px] text-on-surface-variant pt-1">
              <strong>Reviewer Note:</strong> {claim.reviewerNote}
            </div>
          )}

          {/* Actions */}
          <div
            className="pt-2 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5">
              {isFlagged && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsEditingPhrasing(true)}
                  icon={<Edit2 className="w-3 h-3 text-tertiary-fixed" />}
                  className="bg-secondary text-on-secondary hover:bg-secondary/90 font-bold"
                >
                  Replace with Exact Phrasing
                </Button>
              )}

              <Button
                variant="secondary"
                size="sm"
                onClick={handleAccept}
                icon={<Check className="w-3 h-3 text-emerald-700" />}
              >
                {claim.status === 'SUPPORTED' || claim.status === 'RESOLVED' ? 'Supported ✓' : 'Accept & Verify'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
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
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
