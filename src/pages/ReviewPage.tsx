import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ClaimCard } from '../components/evidence/ClaimCard';
import { DocumentViewerPane } from '../components/evidence/DocumentViewerPane';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  ShieldCheck,
  Search,
  Layers,
  FileText
} from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const {
    transformation,
    selectedClaim,
    setSelectedClaim,
    unsupportedClaimsCount,
    supportedClaimsCount,
    isApprovalBlocked,
    navigate
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL' | 'RESOLVED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const claims = transformation.claims;

  const filteredClaims = claims.filter(claim => {
    const matchesSearch =
      claim.claimText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.sectionTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'PENDING') {
      return claim.status === 'NEEDS_REVIEW' || claim.status === 'UNSUPPORTED';
    }
    if (activeTab === 'RESOLVED') {
      return claim.status === 'SUPPORTED' || claim.status === 'RESOLVED' || claim.status === 'EDITED' || claim.status === 'HUMAN_APPROVED';
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-surface overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="p-4 lg:px-8 bg-surface-container-lowest border-b border-outline-variant/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline-md text-xl font-bold text-on-surface">
              Verification & Review Queue
            </h1>
            {unsupportedClaimsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-code-sm text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                {unsupportedClaimsCount} Pending Human Review
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-code-sm text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                All {claims.length} Claims Verified
              </span>
            )}
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
            Active Document: <span className="font-semibold text-on-surface">{transformation.title}</span> ({transformation.source.pages} pages)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('#/transform')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-semibold"
          >
            Open 5-Step Workflow
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="px-4 lg:px-8 py-2.5 bg-surface-container-low border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {[
            { id: 'PENDING', label: `Needs Review (${unsupportedClaimsCount})` },
            { id: 'RESOLVED', label: `Supported / Resolved (${supportedClaimsCount})` },
            { id: 'ALL', label: `All Claims (${claims.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 text-xs font-body-sm rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-xs bg-surface-container-lowest border border-outline-variant/80 rounded-md px-2.5 py-1 text-xs">
          <Search className="w-3.5 h-3.5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
        </div>
      </div>

      {/* 50/50 Split Review Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* Left 50%: Claim Cards List */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 overflow-y-auto space-y-3 bg-surface">
          <div className="flex items-center justify-between pb-1">
            <span className="font-label-caps text-[11px] uppercase text-on-surface-variant font-bold">
              Claims Matrix ({filteredClaims.length})
            </span>
            <span className="font-code-sm text-[11px] text-on-surface-variant">
              Click claim to view highlighted source evidence
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
            <div className="p-12 text-center text-on-surface-variant font-body-sm bg-surface-container-lowest rounded-xl border border-outline-variant/60">
              {activeTab === 'PENDING' && unsupportedClaimsCount === 0 ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold text-lg">
                    ✓
                  </div>
                  <p className="font-bold text-on-surface text-sm">All claims have been verified!</p>
                  <p className="text-xs text-on-surface-variant">
                    No items require human intervention. You may proceed to approval.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('#/transform')}
                    className="mt-3"
                  >
                    Go to Final Approval
                  </Button>
                </div>
              ) : (
                <p>No claims match the active filter criteria.</p>
              )}
            </div>
          )}
        </div>

        {/* Right 50%: Highlighted Source Document Viewer */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0 border-l border-outline-variant/60">
          <DocumentViewerPane />
        </div>

      </div>

    </div>
  );
};
