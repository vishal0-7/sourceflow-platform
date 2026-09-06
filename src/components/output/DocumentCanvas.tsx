import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PresentationSlide, SocialMediaPost } from '../../types/output';
import { Shield, AlertTriangle, CheckCircle2, ArrowRight, ExternalLink, FileSpreadsheet } from 'lucide-react';

interface DocumentCanvasProps {
  viewMode: 'studio' | 'diff' | 'executive';
  isEditing: boolean;
}

export const DocumentCanvas: React.FC<DocumentCanvasProps> = ({ viewMode: _viewMode, isEditing: _isEditing }) => {
  const { outputDossier, activeStudioTab, navigate, setSelectedClaim, claimsList } = useAppStore();

  const handleClaimClick = (claimIndex: number) => {
    const claim = claimsList.find(c => c.claimIndex === claimIndex);
    if (claim) {
      setSelectedClaim(claim);
      navigate('#/source-evidence');
    }
  };

  const flaggedClaim = claimsList.find(c => c.id === 'CLM-005');

  return (
    <div className="flex-1 bg-surface p-4 lg:p-6 overflow-y-auto flex flex-col items-center">
      {/* Official Institutional Memorandum Paper Sheet */}
      <div className="w-full max-w-4xl bg-surface-container-lowest border border-outline-variant rounded-xl shadow-paper p-8 lg:p-12 transition-all">
        
        {/* Institutional Memorandum Top Header */}
        <div className="border-b-2 border-primary pb-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary text-tertiary-fixed flex items-center justify-center font-bold text-xs">
                  SF
                </div>
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold tracking-wider">
                  SourceFlow Content Transformation Platform
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-2 tracking-tight">
                {outputDossier.title}
              </h1>
            </div>
            <div className="text-right font-code-sm text-xs text-on-surface-variant flex-shrink-0">
              <p className="font-mono font-semibold text-on-surface">{outputDossier.referenceNumber}</p>
              <p>{outputDossier.date}</p>
            </div>
          </div>

          {/* Attestation / Grounding Ribbon */}
          <div className="mt-4 p-2 rounded bg-surface-container-low border border-outline-variant/60 flex flex-wrap items-center justify-between gap-2 text-xs font-code-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-on-surface">SOURCE GROUNDING:</span>
              <span className="text-on-surface-variant">22/23 Claims Supported</span>
              {flaggedClaim?.status === 'NEEDS_REVIEW' ? (
                <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  1 Requires Review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  100% Attested
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-on-surface-variant">
              <span>Grounding: <strong className="text-on-surface">{outputDossier.groundingScore}%</strong></span>
              <span>Consistency: <strong className="text-on-surface">{outputDossier.consistencyScore}%</strong></span>
            </div>
          </div>
        </div>

        {/* Tab 1: Advisory */}
        {activeStudioTab === 'advisory' && (
          <div className="space-y-6">
            {/* Section 1: Executive Summary */}
            <section className="space-y-2">
              <h2 className="font-headline-md text-headline-md font-bold text-primary border-b border-outline-variant/40 pb-1">
                1.0 Executive Operational Summary
              </h2>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {outputDossier.advisoryText.executiveSummary}
              </p>
            </section>

            {/* Section 2: Technical Assessment */}
            <section className="space-y-2">
              <h2 className="font-headline-md text-headline-md font-bold text-primary border-b border-outline-variant/40 pb-1">
                2.0 Infrastructure Performance & Telemetry Assessment
              </h2>
              <div className="font-body-md text-body-md text-on-surface leading-relaxed space-y-3">
                <p>
                  Telemetry logs confirm that during the designated audit window (02:00 to 06:00 IST), all seventeen 765kV interconnect substations maintained thermal equilibrium within statutory limits. Standby reserve was clocked at 4,120 MW across combined cycle units.
                </p>

                {/* Flagged Section with Highlight */}
                <div className={`p-3 rounded-lg border-2 transition-all ${
                  flaggedClaim?.status === 'NEEDS_REVIEW'
                    ? 'border-amber-400 bg-amber-50/50'
                    : 'border-emerald-300 bg-emerald-50/30'
                }`}>
                  <div className="flex items-center justify-between text-xs font-code-sm mb-1.5">
                    <span className="font-bold flex items-center gap-1">
                      {flaggedClaim?.status === 'NEEDS_REVIEW' ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span className="text-amber-950 font-bold">Citation Anchor [Claim #5] — Contradiction Flagged</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-emerald-950 font-bold">Citation Anchor [Claim #5] — Verified</span>
                        </>
                      )}
                    </span>
                    <button
                      onClick={() => handleClaimClick(5)}
                      className="text-secondary hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View Source Page 19</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-on-surface text-sm">
                    {flaggedClaim?.claimText}
                  </p>

                  {flaggedClaim?.status === 'NEEDS_REVIEW' && (
                    <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-center justify-between">
                      <span className="text-amber-900 text-xs font-body-sm">
                        Assertion of "zero deviation" contradicts observed 49.88 Hz - 50.04 Hz excursion.
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleClaimClick(5)}
                        className="bg-secondary hover:bg-secondary/90 text-xs font-bold"
                      >
                        Inspect & Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Statutory Compliance */}
            <section className="space-y-2">
              <h2 className="font-headline-md text-headline-md font-bold text-primary border-b border-outline-variant/40 pb-1">
                3.0 Statutory Standards Compliance
              </h2>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                {outputDossier.advisoryText.statutoryCompliance}
              </p>
            </section>

            {/* Section 4: Recommendations */}
            <section className="space-y-2">
              <h2 className="font-headline-md text-headline-md font-bold text-primary border-b border-outline-variant/40 pb-1">
                4.0 Strategic Governance Directives
              </h2>
              <ul className="space-y-2 text-body-md text-on-surface list-disc pl-5">
                {outputDossier.advisoryText.recommendedActions.map((action: string, i: number) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* Tab 2: Executive Summary */}
        {activeStudioTab === 'summary' && (
          <div className="space-y-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary pb-2 border-b border-outline-variant">
              Executive Briefing Document
            </h2>
            <div className="bg-surface-container-low p-6 rounded-lg font-mono text-xs whitespace-pre-wrap leading-relaxed border border-outline-variant">
              {outputDossier.summaryText}
            </div>
          </div>
        )}

        {/* Tab 3: Presentation Slides */}
        {activeStudioTab === 'presentation' && (
          <div className="space-y-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary pb-2 border-b border-outline-variant">
              Executive Presentation Slide Deck ({outputDossier.slides.length} Slides)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {outputDossier.slides.map((slide: PresentationSlide) => (
                <div key={slide.slideNumber} className="bg-surface-container-low p-5 rounded-lg border border-outline-variant flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-code-sm text-xs font-bold text-secondary">
                        SLIDE {slide.slideNumber}
                      </span>
                      <span className="font-code-sm text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                        {slide.groundedClaimIds.length} Grounded Claims
                      </span>
                    </div>
                    <h3 className="font-headline-sm font-bold text-on-surface mb-3">
                      {slide.title}
                    </h3>
                    <ul className="space-y-1.5 text-body-sm text-on-surface-variant list-disc pl-4">
                      {slide.bulletPoints.map((pt: string, i: number) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Social Media Advisory */}
        {activeStudioTab === 'social' && (
          <div className="space-y-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary pb-2 border-b border-outline-variant">
              Public Sector Communication & Advisory Posts
            </h2>
            <div className="space-y-4">
              {outputDossier.socialPosts.map((post: SocialMediaPost, idx: number) => (
                <div key={idx} className="bg-surface-container-low p-5 rounded-lg border border-outline-variant">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-code-sm text-xs font-bold text-secondary">
                      {post.platform}
                    </span>
                    <span className="font-code-sm text-[10px] text-on-surface-variant">
                      {post.characterCount} characters
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface bg-surface-container-lowest p-3.5 rounded border border-outline-variant/60">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
