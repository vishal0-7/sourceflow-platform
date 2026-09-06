import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sparkles, Terminal, CheckCircle2, ArrowRight, Layers, FileCheck, ShieldCheck } from 'lucide-react';

interface IngestionTelemetryProps {
  onGenerate: () => void;
}

export const IngestionTelemetry: React.FC<IngestionTelemetryProps> = ({ onGenerate }) => {
  const { activeJob, advanceWorkflowStage, navigate } = useAppStore();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await advanceWorkflowStage(3);
    await advanceWorkflowStage(4);
    setIsGenerating(false);
    navigate('#/output-studio');
  };

  return (
    <div className="space-y-space-md bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
      
      {/* Header & Stage Badge */}
      <div className="flex items-center justify-between border-b border-outline-variant/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 font-code-sm text-code-sm bg-secondary-fixed text-on-secondary-fixed font-bold rounded">
              STAGE 02: EXTRACTION TELEMETRY
            </span>
            <span className="font-code-sm text-xs text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
              PARSING COMPLETE
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
            Automated Document Intelligence & Extraction
          </h3>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleGenerateClick}
          disabled={isGenerating}
          icon={<Sparkles className="w-4 h-4 text-tertiary-fixed" />}
          className="shadow-sm"
        >
          {isGenerating ? 'Generating Outputs...' : 'Generate 4 Multi-Outputs (Studio)'}
        </Button>
      </div>

      {/* Semantic Metadata Classification Table */}
      <div className="space-y-2">
        <h4 className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
          Extracted Semantic Metadata & Taxonomy
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
            <span className="text-on-surface-variant font-code-sm text-[10px] uppercase">Document Type</span>
            <p className="font-bold text-on-surface text-sm mt-0.5">Technical Appraisal</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
            <span className="text-on-surface-variant font-code-sm text-[10px] uppercase">Domain Sector</span>
            <p className="font-bold text-on-surface text-sm mt-0.5">Energy & Grid Infra</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
            <span className="text-on-surface-variant font-code-sm text-[10px] uppercase">Entities Detected</span>
            <p className="font-bold text-on-surface text-sm mt-0.5">17 Sub-Stations</p>
          </div>
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
            <span className="text-on-surface-variant font-code-sm text-[10px] uppercase">Directives Parsed</span>
            <p className="font-bold text-on-surface text-sm mt-0.5">4 Statutory Mandates</p>
          </div>
        </div>
      </div>

      {/* Live Extraction Stream Logs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-secondary" />
            Live Processing Stream & Optical Layout Logs
          </span>
          <span className="font-code-sm text-[10px] text-slate-500 font-mono">100% Processed</span>
        </div>

        <div className="bg-primary text-slate-200 rounded-lg p-4 font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto border border-slate-800">
          <p className="text-emerald-400 font-semibold">[00.12s] File SHA-256 Web Crypto verification: MATCHED ({activeJob.sha256.slice(0, 16)}...)</p>
          <p className="text-slate-300">[00.45s] Layout Optical Engine: Extracted 24 page frames with dual-column tabular structures.</p>
          <p className="text-slate-300">[01.10s] Entity Recognition: Identified 17 Ultra-High-Voltage (UHV) interconnect nodes.</p>
          <p className="text-slate-300">[01.85s] Grounding Engine: Triangulated 23 verifiable statutory assertions.</p>
          <p className="text-amber-400 font-semibold">[02.40s] Flagged Warning: Claim #5 (Page 19) frequency assertion marked for human review.</p>
          <p className="text-emerald-400 font-semibold">[02.95s] Artifact Generation Ready: Advisory, Executive Summary, Slides, Social Alert.</p>
        </div>
      </div>

      {/* Grounded Transformation Configuration Summary */}
      <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-on-surface font-bold">
            Configured Output Artifacts (4 MVP Deliverables)
          </span>
          <Badge variant="verified">READY FOR WORKBENCH</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-body-sm">
          <div className="flex items-center gap-2 p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>1. Official Institutional Advisory (Memorandum)</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>2. Executive Summary Briefing</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>3. Executive Presentation Slide Deck</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-surface-container-lowest border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>4. Public Advisory Social Posts</span>
          </div>
        </div>
      </div>

    </div>
  );
};
