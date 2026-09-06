import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import { Plus, ShieldCheck, Activity, FileCheck, Layers } from 'lucide-react';

export const ExecutiveSummaryBar: React.FC = () => {
  const { navigate, userSession } = useAppStore();

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-space-lg flex flex-wrap items-center justify-between gap-space-md shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
            SOURCEFLOW COMMAND OVERVIEW
          </span>
          <span className="font-code-sm text-xs bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-semibold">
            SECURE ACTIVE SESSION
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
          Institutional Document Intelligence & Content Transformation
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
          Logged in as <strong>{userSession.name}</strong> ({userSession.designation}).
        </p>
      </div>

      <div className="flex items-center gap-space-sm">
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('#/source-evidence')}
          icon={<ShieldCheck className="w-4 h-4 text-secondary" />}
        >
          Inspect Evidence (23 Claims)
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('#/new-transformation')}
          icon={<Plus className="w-4 h-4 text-tertiary-fixed" />}
          className="shadow-sm"
        >
          New Content Transformation
        </Button>
      </div>
    </div>
  );
};
