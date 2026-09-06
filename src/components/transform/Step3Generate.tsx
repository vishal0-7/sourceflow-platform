import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface Step3GenerateProps {
  onComplete: () => void;
}

export const Step3Generate: React.FC<Step3GenerateProps> = ({ onComplete }) => {
  const { transformation, generateDeliverables } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: 'Source analyzed', desc: 'Extracted 18 entities and 23 verifiable assertions from PDF' },
    { title: 'Audience requirements mapped', desc: 'Configured Executive, Technical, and Plain-language tone models' },
    { title: 'Executive Brief generated', desc: 'Synthesized high-level decision memorandum with statutory anchors' },
    { title: 'Technical Advisory generated', desc: 'Synthesized deep telemetry analysis and remediation directives' },
    { title: 'Communication Package generated', desc: 'Generated public safety bulletin and stakeholder notices' },
    { title: 'Verification pending', desc: 'Cross-referencing 23 generated claims against source document' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 450);

    return () => clearInterval(timer);
  }, [steps.length]);

  // Once all steps are marked, automatically complete or show proceed CTA
  const isFinished = currentStepIndex >= steps.length;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center mx-auto">
          {isFinished ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : <Loader2 className="w-6 h-6 animate-spin text-secondary" />}
        </div>
        <h2 className="font-headline-md text-xl font-bold text-on-surface">
          {isFinished ? 'Transformation Pipeline Complete' : 'Executing Transformation Pipeline...'}
        </h2>
        <p className="font-body-md text-xs text-on-surface-variant">
          Transforming source intelligence into tailored deliverables with strict provenance tracking.
        </p>
      </div>

      {/* Progress Box */}
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-6 shadow-2xs space-y-4">
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isDone = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-surface-container-low/60 border-outline-variant/40'
                    : isCurrent
                    ? 'bg-secondary-fixed/20 border-secondary shadow-2xs'
                    : 'bg-surface-container-lowest border-transparent opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    ) : (
                      <Clock className="w-4 h-4 text-on-surface-variant/40" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-on-surface">
                      {step.title}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 font-body-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-code-sm font-bold px-2 py-0.5 rounded ${
                  isDone
                    ? 'bg-emerald-100 text-emerald-800'
                    : isCurrent
                    ? 'bg-secondary text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {isDone ? 'COMPLETE ✓' : isCurrent ? 'PROCESSING' : 'QUEUED'}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="pt-4 border-t border-outline-variant/60 flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={onComplete}
            disabled={!isFinished}
            icon={<ArrowRight className="w-4 h-4 text-tertiary-fixed" />}
            className="shadow-xs font-semibold px-6"
          >
            Open Claim Verification Workbench
          </Button>
        </div>
      </div>

    </div>
  );
};
