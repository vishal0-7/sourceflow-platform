import React, { useState } from 'react';
import { useAppStore } from '../../store/AppContext';
import { TransformationJob } from '../../types/pipeline';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { truncateHash } from '../../utils/hash';
import { formatISTDate } from '../../utils/date';
import { Search, ArrowRight, Eye, MoreHorizontal, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export const PipelinesTable: React.FC = () => {
  const { jobsList, navigate, activeJob } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobsList.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.sha256.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs space-y-3">
      {/* Table Header & Search Filter */}
      <div className="p-4 border-b border-outline-variant flex flex-wrap items-center justify-between gap-space-md">
        <div>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            Active Content Transformation Pipelines
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Live ingestion dossiers, stage telemetry, and grounding matrix status.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter pipelines by name or hash..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg font-code-sm text-xs text-on-surface focus:outline-none focus:border-secondary"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead className="bg-surface-container font-label-caps text-label-caps uppercase text-on-surface-variant border-b border-outline-variant select-none">
            <tr>
              <th className="px-4 py-2.5">Job Reference</th>
              <th className="px-4 py-2.5">Source Dossier</th>
              <th className="px-4 py-2.5">SHA-256 Digest</th>
              <th className="px-4 py-2.5">Pipeline Stage</th>
              <th className="px-4 py-2.5">Claims Verified</th>
              <th className="px-4 py-2.5">Review Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 font-body-md text-xs">
            {filteredJobs.map(job => {
              const isSelected = activeJob.id === job.id;
              return (
                <tr
                  key={job.id}
                  onClick={() => navigate('#/output-studio')}
                  className={`hover:bg-surface-container-low transition-colors cursor-pointer ${
                    isSelected ? 'bg-surface-container/60' : ''
                  }`}
                >
                  {/* Job ID */}
                  <td className="px-4 py-3 font-code-sm font-bold text-on-surface whitespace-nowrap">
                    {job.id}
                  </td>

                  {/* Title & File Type */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-on-surface text-xs leading-snug">
                          {job.title}
                        </p>
                        <p className="font-code-sm text-[10px] text-on-surface-variant">
                          {job.fileType} • {job.fileSize}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SHA-256 */}
                  <td className="px-4 py-3 font-code-sm text-[11px] text-on-surface-variant font-mono whitespace-nowrap">
                    {truncateHash(job.sha256, 6, 6)}
                  </td>

                  {/* Progress & Stage */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className="font-code-sm text-[11px] font-bold text-secondary">
                        {job.stageLabel}
                      </span>
                      <div className="w-24 bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-secondary h-full rounded-full"
                          style={{ width: `${job.progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Claims */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-code-sm text-xs">
                      <span className="text-emerald-800 font-bold">
                        {job.claimsVerified} Verified
                      </span>
                      {job.claimsFlagged > 0 && (
                        <span className="text-amber-800 font-bold bg-amber-100 px-1 py-0.2 rounded">
                          ({job.claimsFlagged} flagged)
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge status={job.status} />
                  </td>

                  {/* Action Link */}
                  <td className="px-4 py-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="chip"
                        size="sm"
                        onClick={() => navigate('#/output-studio')}
                        icon={<ArrowRight className="w-3.5 h-3.5 text-secondary" />}
                      >
                        Studio
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
