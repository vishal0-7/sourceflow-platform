import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { Button } from '../common/Button';
import {
  Users,
  Shield,
  MessageSquare,
  FileText,
  FileCode,
  Share2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';

interface Step2ConfigureProps {
  onBack: () => void;
  onGenerate: () => void;
}

export const Step2Configure: React.FC<Step2ConfigureProps> = ({ onBack, onGenerate }) => {
  const { transformation, toggleProfile } = useAppStore();

  const selectedProfiles = transformation.profiles.filter(p => p.isSelected);

  const getProfileIcon = (id: string) => {
    switch (id) {
      case 'prof-exec':
        return <Shield className="w-5 h-5 text-secondary" />;
      case 'prof-cyber':
        return <FileCode className="w-5 h-5 text-indigo-700" />;
      case 'prof-media':
      default:
        return <MessageSquare className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="font-headline-md text-xl font-bold text-on-surface">
          Configure communication
        </h2>
        <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
          Select target audience profiles. SourceFlow will tailor phrasing, detail depth, and deliverables.
        </p>
      </div>

      {/* Audience Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transformation.profiles.map(profile => {
          const isSelected = profile.isSelected;
          return (
            <div
              key={profile.id}
              onClick={() => toggleProfile(profile.id)}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-secondary bg-surface-container-low shadow-sm'
                  : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline-variant'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-surface-container text-secondary">
                    {getProfileIcon(profile.id)}
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer accent-secondary"
                  />
                </div>

                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    {profile.name}
                  </h3>
                  <p className="text-[11px] font-code-sm text-secondary font-semibold mt-0.5">
                    {profile.tone}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-outline-variant/60 text-xs">
                  <div className="flex items-start justify-between">
                    <span className="text-on-surface-variant text-[11px]">Detail Depth:</span>
                    <span className="font-medium text-on-surface text-[11px] text-right">{profile.detailLevel}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-on-surface-variant text-[11px]">Language:</span>
                    <span className="font-medium text-on-surface text-[11px] text-right">{profile.language}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-on-surface-variant text-[11px]">Objective:</span>
                    <span className="font-medium text-on-surface text-[11px] text-right">{profile.objective}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between">
                <span className="text-[11px] font-code-sm font-bold text-secondary bg-surface-container px-2 py-0.5 rounded">
                  {profile.deliverableType}
                </span>
                <span className="text-[10px] text-on-surface-variant font-code-sm">
                  {profile.defaultRecipients.length} recipients
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-Populated Deliverables Checklist */}
      <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-secondary" />
            <h4 className="font-headline-md text-sm font-bold text-on-surface">
              Configured Deliverables ({selectedProfiles.length} Outputs Active)
            </h4>
          </div>
          <span className="text-xs font-code-sm text-emerald-800 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
            AUTOMATICALLY MAPPED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {selectedProfiles.map(p => (
            <div
              key={p.id}
              className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <div>
                <p className="font-bold text-on-surface text-xs">{p.deliverableType}</p>
                <p className="text-[10px] text-on-surface-variant font-code-sm">Target: {p.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="md"
          onClick={onBack}
          icon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back to Source
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onGenerate}
          disabled={selectedProfiles.length === 0}
          icon={<Sparkles className="w-4 h-4 text-tertiary-fixed" />}
          className="shadow-xs font-semibold px-5"
        >
          Generate Deliverables
        </Button>
      </div>

    </div>
  );
};
