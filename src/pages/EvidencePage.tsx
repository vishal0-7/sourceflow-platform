import React from 'react';
import { useAppStore } from '../store/AppContext';
import { EvidenceHeader } from '../components/evidence/EvidenceHeader';
import { ClaimCard } from '../components/evidence/ClaimCard';
import { DocumentViewerPane } from '../components/evidence/DocumentViewerPane';

export const EvidencePage: React.FC = () => {
  const {
    claimsList,
    selectedClaim,
    setSelectedClaim,
    flaggedOnlyFilter
  } = useAppStore();

  const filteredClaims = flaggedOnlyFilter
    ? claimsList.filter(c => c.status === 'NEEDS_REVIEW')
    : claimsList;

  const currentIdx = selectedClaim
    ? filteredClaims.findIndex(c => c.id === selectedClaim.id)
    : 0;

  const handlePrevClaim = () => {
    if (filteredClaims.length === 0) return;
    const nextIdx = currentIdx > 0 ? currentIdx - 1 : filteredClaims.length - 1;
    setSelectedClaim(filteredClaims[nextIdx]);
  };

  const handleNextClaim = () => {
    if (filteredClaims.length === 0) return;
    const nextIdx = currentIdx < filteredClaims.length - 1 ? currentIdx + 1 : 0;
    setSelectedClaim(filteredClaims[nextIdx]);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface">
      {/* Evidence Top Header with Navigator and Filters */}
      <EvidenceHeader
        onPrevClaim={handlePrevClaim}
        onNextClaim={handleNextClaim}
      />

      {/* 50/50 Split Verification Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* Left Pane (50%): Generated Claims List */}
        <div className="w-full lg:w-1/2 p-space-lg overflow-y-auto space-y-space-md bg-surface">
          <div className="flex items-center justify-between pb-1">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
              Claims ({filteredClaims.length})
            </span>
            <span className="font-code-sm text-[11px] text-on-surface-variant">
              Select claim to view evidence passage
            </span>
          </div>

          {filteredClaims.map(claim => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              isSelected={selectedClaim?.id === claim.id}
              onSelect={() => setSelectedClaim(claim)}
            />
          ))}

          {filteredClaims.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant font-body-sm">
              No claims match the active filter criteria.
            </div>
          )}
        </div>

        {/* Right Pane (50%): Simulated PDF Document Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <DocumentViewerPane />
        </div>

      </div>
    </div>
  );
};
