import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { truncateHash } from '../utils/hash';
import { JobStatus } from '../types/pipeline';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { jobsList, setActiveJob, navigate } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | JobStatus>('ALL');

  const filteredJobs = jobsList.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenJob = (job: any, targetRoute: string) => {
    setActiveJob(job);
    navigate(targetRoute);
  };

  return (
    <div className="flex-1 bg-surface p-console-margin overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 py-2">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/60">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
              Projects
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm mt-0.5">
              All transformed documents, verification records, and generated outputs.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('#/new-transformation')}
            icon={<Plus className="w-4 h-4 text-tertiary-fixed" />}
            className="shadow-xs font-semibold px-4"
          >
            New Transformation
          </Button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-surface-container-lowest border border-outline-variant/80 rounded-lg px-3 py-1.5 shadow-2xs">
            <Search className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
            <input
              type="text"
              placeholder="Search documents by title or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/60 font-body-sm text-xs">
            {[
              { id: 'ALL', label: 'All Documents' },
              { id: 'NEEDS_REVIEW', label: 'Needs Review' },
              { id: 'READY_FOR_APPROVAL', label: 'Ready for Approval' },
              { id: 'HUMAN_APPROVED', label: 'Approved' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-2xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low font-label-caps text-[11px] uppercase text-on-surface-variant border-b border-outline-variant/60">
                <tr>
                  <th className="px-4 py-3">Document Title</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Claims Verified</th>
                  <th className="px-4 py-3">Last Modified</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredJobs.map(job => (
                  <tr
                    key={job.id}
                    onClick={() => handleOpenJob(job, '#/output-studio')}
                    className="hover:bg-surface-container-low/60 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded bg-surface-container text-secondary flex-shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface text-xs leading-snug">
                            {job.title}
                          </p>
                          <p className="font-code-sm text-[10px] text-on-surface-variant font-mono">
                            ID: {job.id} • SHA-256: {truncateHash(job.sha256, 6, 6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-code-sm text-[11px] text-on-surface-variant">
                      {job.fileType} ({job.fileSize})
                    </td>

                    <td className="px-4 py-3.5">
                      <Badge status={job.status} />
                    </td>

                    <td className="px-4 py-3.5 font-code-sm text-[11px]">
                      <span className="text-on-surface font-semibold">{job.claimsVerified}</span> / {job.claimsTotal} verified
                      {job.claimsFlagged > 0 && (
                        <span className="ml-1.5 text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                          1 flagged
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 font-body-sm text-on-surface-variant text-[11px]">
                      {new Date(job.updatedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {job.claimsFlagged > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenJob(job, '#/source-evidence')}
                            className="border-amber-300 text-amber-950 hover:bg-amber-50"
                          >
                            Review
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenJob(job, '#/output-studio')}
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Studio
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-sm">
                      No documents match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
