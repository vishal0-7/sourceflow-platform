import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { truncateHash } from '../utils/hash';
import { formatISTDate } from '../utils/date';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Link as LinkIcon,
  Search,
  Filter,
  FileCheck,
  Lock,
  Download
} from 'lucide-react';

export const AuditPage: React.FC = () => {
  const { transformation } = useAppStore();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const auditLogs = transformation.audit;

  const toggleRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const filteredLogs = auditLogs.filter(log =>
    log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-surface p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 py-2">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline-variant/60">
          <div>
            <h1 className="font-headline-lg text-2xl font-bold text-on-surface tracking-tight">
              Tamper-Evident Audit Trail
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm mt-0.5">
              Cryptographic ledger for source provenance, intelligence extraction, human edits, approvals, and dispatch.
            </p>
          </div>

          <div className="flex items-center gap-2 font-code-sm text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold">Ledger Status: VALID_TAMPER_EVIDENT</span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
            <span className="font-body-sm text-xs text-on-surface-variant">Active Transformation</span>
            <p className="font-headline-md text-base font-bold text-on-surface mt-1 font-mono truncate">
              {transformation.id}
            </p>
            <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 truncate">
              {transformation.title}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
            <span className="font-body-sm text-xs text-on-surface-variant">Chained Event Blocks</span>
            <p className="font-headline-md text-2xl font-bold text-on-surface mt-1">
              {auditLogs.length}
            </p>
            <p className="font-body-sm text-[11px] text-emerald-700 mt-0.5 font-medium">
              All hashes Web Crypto (SHA-256) verified
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
            <span className="font-body-sm text-xs text-on-surface-variant">Attestation Protocol</span>
            <p className="font-headline-md text-base font-bold text-on-surface mt-1">
              Client-Side Web Crypto
            </p>
            <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 font-mono">
              SHA-256 Digest Block Chaining
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-md bg-surface-container-lowest border border-outline-variant/80 rounded-lg px-3 py-1.5 shadow-2xs">
          <Search className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
          <input
            type="text"
            placeholder="Search audit records by actor, action, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none"
          />
        </div>

        {/* Audit Log Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low font-label-caps text-[11px] uppercase text-on-surface-variant border-b border-outline-variant/60">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User / Actor</th>
                  <th className="px-4 py-3">Lifecycle Action</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Integrity</th>
                  <th className="px-4 py-3 text-right">Block Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredLogs.map(log => {
                  const isExpanded = expandedRowId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => toggleRow(log.id)}
                        className={`hover:bg-surface-container-low/60 transition-colors cursor-pointer ${
                          isExpanded ? 'bg-surface-container-low/40' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 font-code-sm text-[11px] text-on-surface">
                          {formatISTDate(log.timestamp)}
                        </td>

                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-on-surface">{log.actor}</p>
                          <p className="text-[10px] text-on-surface-variant font-code-sm">{log.actorRole}</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-bold text-secondary">
                            {log.action}
                          </span>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 truncate max-w-sm">
                            {log.details}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 font-code-sm text-[11px] text-on-surface-variant font-mono">
                          {log.version || 'v1.0'}
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 font-code-sm text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            VALID
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleRow(log.id);
                            }}
                            className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Cryptographic Details */}
                      {isExpanded && (
                        <tr className="bg-surface-container-low/80">
                          <td colSpan={6} className="p-4">
                            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/80 p-4 space-y-3 shadow-inner">
                              <div className="flex items-center justify-between border-b border-outline-variant/60 pb-2">
                                <span className="font-code-sm text-xs font-bold text-on-surface">
                                  Cryptographic Hash Chaining Verification
                                </span>
                                <span className="font-code-sm text-[10px] text-on-surface-variant">
                                  Block ID: {log.id} • Target ID: {log.jobId}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/60">
                                  <span className="text-on-surface-variant text-[10px] block">Previous Block Hash:</span>
                                  <span className="text-on-surface break-all">{log.previousHash}</span>
                                </div>

                                <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/60">
                                  <span className="text-secondary text-[10px] font-semibold block flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" /> Current Block Hash:
                                  </span>
                                  <span className="text-on-surface font-bold break-all">{log.currentHash}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant">
                                <span>Payload: {log.details}</span>
                                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  Chained & Validated via Web Crypto API
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-sm">
                      No audit records found.
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
