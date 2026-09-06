import React from 'react';
import { useAppStore } from '../store/AppContext';
import {
  Sparkles,
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  FolderKanban,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { transformation, unsupportedClaimsCount, navigate } = useAppStore();

  return (
    <div className="flex-1 bg-[#FAFAF9] overflow-y-auto px-6 py-10 lg:px-14 lg:py-14">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Clean Modern Hero */}
        <section className="space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
            <span>GenAI Transformation Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 tracking-tight leading-[1.15] font-sans">
            Turn complex information into communication-ready content.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed font-normal">
            Upload one source and generate tailored outputs for every audience. Fully grounded, claim-verified, and human-approved.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('#/transform')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium text-sm transition-all shadow-subtle hover:shadow-card cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start a transformation</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => navigate('#/library')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm transition-colors border border-stone-200 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-stone-500" />
              <span>Browse library</span>
            </button>
          </div>
        </section>

        {/* Needs Your Attention Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Needs your attention
            </h2>
            {unsupportedClaimsCount > 0 && (
              <span className="text-xs font-medium text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                {unsupportedClaimsCount} items awaiting verification
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {/* Active Transformation Attention Item */}
            {unsupportedClaimsCount > 0 ? (
              <div 
                onClick={() => navigate('#/transform')}
                className="bg-white hover:bg-amber-50/30 border border-amber-200/80 rounded-2xl p-4 transition-all shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-950 transition-colors">
                      {transformation.source.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                      <span className="text-amber-900 font-semibold font-mono">
                        {unsupportedClaimsCount} claims require verification
                      </span>
                      <span>•</span>
                      <span>Page 14 & Page 19 discrepancies</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white group-hover:bg-amber-700 transition-colors">
                    Review Claims →
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      All active claims verified
                    </h3>
                    <p className="text-xs text-stone-500">
                      23 of 23 assertions anchored to source document with zero discrepancies.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('#/transform')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline px-2 py-1"
                >
                  View Workspace
                </button>
              </div>
            )}

            {/* Additional Secondary Demo Review Item */}
            <div 
              onClick={() => navigate('#/reviews')}
              className="bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl p-4 transition-all shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-teal-950 transition-colors">
                    Vendor Risk Assessment — Q2
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span className="text-stone-700 font-medium font-mono">
                      1 claim requires verification
                    </span>
                    <span>•</span>
                    <span>Secondary Queue</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 group-hover:border-stone-300 transition-colors">
                  Review →
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Work Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Recent work
            </h2>
            <button
              onClick={() => navigate('#/library')}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
            >
              View all ({3})
            </button>
          </div>

          <div className="space-y-2">
            
            {/* Primary Project Row */}
            <div
              onClick={() => navigate('#/transform')}
              className="bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl p-4 transition-all shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 border border-teal-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-teal-800 transition-colors truncate">
                    {transformation.source.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>{transformation.outputs.length} outputs</span>
                    <span>•</span>
                    <span>{transformation.profiles.length} audiences</span>
                    <span>•</span>
                    <span className={`font-medium ${
                      transformation.delivery.status === 'SENT'
                        ? 'text-emerald-700'
                        : transformation.review.status === 'APPROVED'
                        ? 'text-teal-700'
                        : unsupportedClaimsCount > 0
                        ? 'text-amber-800'
                        : 'text-stone-600'
                    }`}>
                      {transformation.delivery.status === 'SENT'
                        ? 'Delivered'
                        : transformation.review.status === 'APPROVED'
                        ? 'Approved'
                        : unsupportedClaimsCount > 0
                        ? 'Verification in progress'
                        : 'Ready for approval'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-400 self-end sm:self-center flex-shrink-0">
                <span className="font-mono">10:42 AM</span>
                <span className="inline-flex items-center gap-1 font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Additional Project Row */}
            <div
              onClick={() => navigate('#/library')}
              className="bg-white hover:bg-stone-50 border border-stone-200/80 rounded-2xl p-4 transition-all shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-stone-50 text-stone-600 flex items-center justify-center flex-shrink-0 border border-stone-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-stone-950 transition-colors truncate">
                    Zero Trust Network Architecture Compliance Appraisal.pdf
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>2 outputs</span>
                    <span>•</span>
                    <span>2 audiences</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">Completed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-stone-400 self-end sm:self-center flex-shrink-0">
                <span className="font-mono">Yesterday</span>
                <span className="inline-flex items-center gap-1 font-medium text-stone-600 group-hover:translate-x-0.5 transition-transform">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
