import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { PipelineStage } from '../../types/pipeline';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export const WorkflowStepper: React.FC = () => {
  const { activeJob, advanceWorkflowStage, navigate, currentRoute } = useAppStore();

  const stages: { stage: PipelineStage; label: string; route: string }[] = [
    { stage: 1, label: '01 SOURCE', route: '#/new-transformation' },
    { stage: 2, label: '02 ANALYSIS', route: '#/new-transformation' },
    { stage: 3, label: '03 CONFIGURE', route: '#/new-transformation' },
    { stage: 4, label: '04 REVIEW', route: '#/output-studio' },
  ];

  const handleStageClick = async (s: { stage: PipelineStage; label: string; route: string }) => {
    if (activeJob.stage < s.stage) {
      await advanceWorkflowStage(s.stage);
    }
    navigate(s.route);
  };

  return (
    <div className="h-10 w-full px-console-margin bg-surface-container-low border-b border-outline-variant/80 flex items-center justify-between select-none overflow-x-auto text-xs">
      <div className="flex items-center gap-space-sm min-w-max py-1">
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold pr-2 border-r border-outline-variant/80">
          Pipeline Flow:
        </span>

        {stages.map((s, idx) => {
          const isCompleted = activeJob.stage > s.stage;
          const isCurrent = activeJob.stage === s.stage;
          const isMatchingRoute = currentRoute === s.route && isCurrent;

          return (
            <React.Fragment key={s.stage}>
              <button
                onClick={() => handleStageClick(s)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                  isMatchingRoute
                    ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                    : isCurrent
                    ? 'bg-secondary-fixed text-on-secondary-fixed font-bold border border-secondary/30'
                    : isCompleted
                    ? 'text-emerald-800 hover:bg-emerald-50 font-semibold'
                    : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                ) : (
                  <Circle className={`w-3.5 h-3.5 ${isCurrent ? 'text-secondary fill-secondary/20' : 'text-slate-400'}`} />
                )}
                <span className="font-code-sm text-[11px] tracking-tight">{s.label}</span>
              </button>

              {idx < stages.length - 1 && (
                <ArrowRight className="w-3 h-3 text-outline-variant/80 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current Job Reference Stamp */}
      <div className="hidden md:flex items-center gap-2 font-code-sm text-[11px] text-on-surface-variant">
        <span>Active Dossier:</span>
        <span className="font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/60 font-mono">
          {activeJob.id}
        </span>
      </div>
    </div>
  );
};
