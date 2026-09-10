import React, { useState } from 'react';
import { useModels } from '../context/ModelContext.jsx';
import { useOutletContext } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar.jsx';
import { FilterSidebar } from '../components/filters/FilterSidebar.jsx';
import { ActiveFilterChips } from '../components/filters/ActiveFilterChips.jsx';
import { ModelGrid } from '../components/models/ModelGrid.jsx';
import { Download, SlidersHorizontal, Layers, Sparkles } from 'lucide-react';

export function ModelsCatalog() {
  const { onInspectModel } = useOutletContext() || {};
  const { 
    filteredCount, 
    totalModelCount,
    activeFilterCount, 
    exportAllModelsJson 
  } = useModels();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      await exportAllModelsJson();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Search & Actions Bar */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                Live Hugging Face Catalog
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing {filteredCount} of {totalModelCount || 161} models
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Neural Models Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Filter by Safetensors shards, architecture, and pipeline tags. Copy CLI download commands and calculate VRAM.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={exporting}
              onClick={handleExportAll}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
              title="Download entire filtered dataset as verified JSON"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>{exporting ? 'Exporting...' : `Export JSON (${filteredCount})`}</span>
            </button>
          </div>
        </div>

        {/* Debounced Search Bar */}
        <SearchBar
          onToggleMobileFilters={() => setMobileFiltersOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Active Filter Chips */}
        <ActiveFilterChips />
      </div>

      {/* Main Workspace Layout: Filter Sidebar + Model Grid */}
      <div className="flex gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <FilterSidebar
            isMobile
            onClose={() => setMobileFiltersOpen(false)}
          />
        )}

        {/* Models Grid Canvas */}
        <div className="flex-1 min-w-0">
          <ModelGrid onViewDetails={onInspectModel} />
        </div>
      </div>
    </div>
  );
}
