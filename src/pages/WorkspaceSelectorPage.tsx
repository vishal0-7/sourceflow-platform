import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { CreateWorkspaceModal } from '../components/workspace/CreateWorkspaceModal';
import {
  Layers,
  ArrowRight,
  Plus,
  ShieldCheck,
  FileText,
  Users,
  Calendar,
  LogOut,
  ChevronRight,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

export const WorkspaceSelectorPage: React.FC = () => {
  const {
    workspaces,
    selectWorkspace,
    currentUser,
    logout
  } = useAppStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900 antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Simple Navigation */}
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Layers className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900 tracking-tight leading-none">
                SourceFlow
              </div>
              <div className="text-[11px] text-stone-500 font-medium tracking-tight mt-0.5">
                Institutional Workspace Selector
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200/70">
              <div className="w-6 h-6 rounded-full bg-teal-800 text-teal-100 text-[10px] font-bold flex items-center justify-center">
                {currentUser?.avatar || 'KV'}
              </div>
              <div className="text-xs font-semibold text-stone-700">
                {currentUser?.name || 'K. Varma'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Sign out of SourceFlow"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Verified Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Select an Active Workspace
            </h1>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Choose an organizational workspace to manage document transformations, verification pipelines, and audience-tailored releases.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => {
            const isOperations = ws.id === 'workspace-001';
            const dashboardCount = ws.dashboards?.length || 0;
            const transformationCount = ws.transformations?.length || 0;

            return (
              <div
                key={ws.id}
                onClick={() => selectWorkspace(ws.id)}
                className="group relative bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-stone-100 group-hover:bg-teal-50 group-hover:text-teal-700 text-stone-700 flex items-center justify-center border border-stone-200 transition-colors">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    {isOperations && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active Demo
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-teal-900 transition-colors mb-1.5">
                    {ws.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-6">
                    {ws.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="text-xs font-bold text-stone-800">{dashboardCount}</div>
                      <div className="text-[10px] text-stone-400 font-medium">Dashboards</div>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="text-xs font-bold text-stone-800">{transformationCount}</div>
                      <div className="text-[10px] text-stone-400 font-medium">Pipelines</div>
                    </div>
                    <div className="p-2 rounded-lg bg-stone-50 border border-stone-100">
                      <div className="text-xs font-bold text-stone-800">{ws.members}</div>
                      <div className="text-[10px] text-stone-400 font-medium">Members</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-teal-800 group-hover:text-teal-950">
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          <div
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-dashed border-stone-200 hover:border-teal-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer bg-stone-50/50 hover:bg-teal-50/20 transition-all min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-teal-100 text-stone-400 group-hover:text-teal-700 flex items-center justify-center border border-stone-200 shadow-xs transition-colors mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-stone-800 group-hover:text-stone-900">
              Create New Workspace
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mt-1">
              Add a dedicated domain for distinct departments, research projects, or compliance audits.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/70 bg-white py-4 px-6 text-center text-xs text-stone-500">
        SourceFlow &bull; One source. Many trusted outputs. &bull; Secure Institutional Session
      </footer>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
