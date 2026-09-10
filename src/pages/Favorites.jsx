import React from 'react';
import { useModels } from '../context/ModelContext.jsx';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Star, Download, Search, Sparkles } from 'lucide-react';
import { ModelCard } from '../components/models/ModelCard.jsx';

export function Favorites() {
  const { favorites, exportAllModelsJson } = useModels();
  const { onInspectModel } = useOutletContext() || {};
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
              Personal Collection
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span>Saved Favorite Models ({favorites.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bookmarked models stored securely in IndexedDB persistence for rapid access, evaluation, and CLI downloads.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={() => exportAllModelsJson()}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export Favorites JSON</span>
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-4">
            <Star className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No saved models yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
            Click the star icon on any Hugging Face model in the catalog to pin it here for one-click access.
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/models')}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Browse Model Catalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((model) => (
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
