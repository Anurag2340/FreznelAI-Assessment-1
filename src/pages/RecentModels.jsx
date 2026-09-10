import React from 'react';
import { useModels } from '../context/ModelContext.jsx';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { History, Trash2, Search } from 'lucide-react';
import { ModelCard } from '../components/models/ModelCard.jsx';
import { useToast } from '../context/ToastContext.jsx';

export function RecentModels() {
  const { recentModels } = useModels();
  const { onInspectModel } = useOutletContext() || {};
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleClearHistory = () => {
    localStorage.removeItem('modelhub_recent_models');
    addToast('Cleared recently viewed history.', 'info');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Session Audit Trail
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" />
            <span>Recently Inspected Models ({recentModels.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit trail of foundation models inspected in detail during your recent development sessions.
          </p>
        </div>

        {recentModels.length > 0 && (
          <button
            type="button"
            onClick={handleClearHistory}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No recently inspected models
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Click on any model's "Inspect Specs" button in the catalog to view its parameters, VRAM sizing, and CLI commands.
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/models')}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Explore Model Catalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onViewDetails={onInspectModel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
