import React from 'react';
import { useAppStore } from '../../store/AppContext';
import { OutputVariant } from '../../types/output';
import { FileText, AlignLeft, Presentation, Share2 } from 'lucide-react';

export const ArtifactTabs: React.FC = () => {
  const { activeStudioTab, setActiveStudioTab } = useAppStore();

  const tabs: { id: OutputVariant; label: string; icon: React.ReactNode }[] = [
    { id: 'advisory', label: '1. Official Advisory', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'summary', label: '2. Executive Summary', icon: <AlignLeft className="w-3.5 h-3.5" /> },
    { id: 'presentation', label: '3. Presentation Slides', icon: <Presentation className="w-3.5 h-3.5" /> },
    { id: 'social', label: '4. Social Media Advisory', icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-surface-container-low px-console-margin border-b border-outline-variant/80 flex items-center justify-between overflow-x-auto select-none">
      <div className="flex items-center gap-1 py-1">
        {tabs.map(tab => {
          const isActive = activeStudioTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStudioTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-body-sm text-xs transition-all ${
                isActive
                  ? 'border-secondary text-secondary font-bold bg-surface-container-lowest shadow-xs'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

