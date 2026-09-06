import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Columns, Edit3, RefreshCw, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface StudioHeaderProps {
  viewMode: 'studio' | 'diff' | 'executive';
  setViewMode: (mode: 'studio' | 'diff' | 'executive') => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onApprove: () => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  viewMode,
  setViewMode,
  isEditing,
  setIsEditing,
  onApprove
}) => {
  const { activeJob, navigate, outputDossier, claimsList } = useAppStore();

  const flaggedCount = claimsList.filter(c => c.status === 'NEEDS_REVIEW').length;
  const isApproved = activeJob.status === 'HUMAN_APPROVED' || activeJob.status === 'EXPORTED';
  const isReady = flaggedCount === 0 && !isApproved;

  return (
    <div className="bg-surface-container-lowest border-b border-outline-variant/80 px-console-margin py-3 flex flex-wrap items-center justify-between gap-space-md">
      {/* Title & Status */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-headline-md text-lg font-bold text-on-surface">
            {outputDossier.title}
          </h2>
          <Badge status={activeJob.status}>
            {isApproved ? 'HUMAN APPROVED' : isReady ? 'READY FOR APPROVAL' : 'REVIEW REQUIRED'}
          </Badge>
        </div>
        <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
          Document ID: <strong className="text-on-surface font-mono">{activeJob.id}</strong> • Date: {outputDossier.date}
        </p>
      </div>

      {/* Main Action Buttons */}
      <div className="flex items-center flex-wrap gap-2">
        {/* View Mode */}
        <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/60 font-body-sm text-xs">
          <button
            onClick={() => setViewMode('studio')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'studio' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-2xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setViewMode('executive')}
            className={`px-3 py-1 rounded-md transition-colors ${
              viewMode === 'executive' ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-2xs' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Executive Read
          </button>
        </div>

        {/* View Evidence CTA */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('#/source-evidence')}
          icon={<Columns className="w-3.5 h-3.5 text-secondary" />}
          className={flaggedCount > 0 ? 'border-amber-400 bg-amber-50 text-amber-950 font-bold' : ''}
        >
          {flaggedCount > 0 ? `View Evidence (1 Review)` : 'View Evidence'}
        </Button>

        {/* Edit Action */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          icon={<Edit3 className="w-3.5 h-3.5" />}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>

        {/* Approve Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onApprove}
          icon={isApproved ? <CheckCircle2 className="w-3.5 h-3.5 text-tertiary-fixed" /> : <ShieldCheck className="w-3.5 h-3.5 text-tertiary-fixed" />}
          className="shadow-2xs font-semibold px-4"
        >
          {isApproved ? 'Approved ✓' : 'Approve'}
        </Button>
      </div>
    </div>
  );
};
