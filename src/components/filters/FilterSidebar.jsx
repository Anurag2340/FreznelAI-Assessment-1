import React, { useState } from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { ChevronDown, ChevronUp, X, Filter, RotateCcw } from 'lucide-react';

export function FilterSidebar({ isMobile = false, onClose }) {
  const {
    filterState,
    updateFilter,
    setSafetensorRange,
    clearFilters,
    activeFilterCount,
    dynamicFacets,
  } = useModels();

  // Collapsible accordion sections
  const [openSections, setOpenSections] = useState({
    pipeline: true,
    family: true,
    architecture: true,
    weight: true,
    safetensors: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Dynamic filter options generated directly from the API data
  const pipelines = dynamicFacets.pipelines || [];
  const families = dynamicFacets.families || [];
  const architectures = dynamicFacets.architectures || [];
  const weights = dynamicFacets.weights || [];

  const content = (
    <div className="flex flex-col gap-4 text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Filter Specifications
          </span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Pipeline tags -> hf_tags.pipeline_tag */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => toggleSection('pipeline')}
          className="flex items-center justify-between w-full font-bold text-slate-800 dark:text-slate-200 py-1"
        >
          <span>Pipeline Tasks</span>
          {openSections.pipeline ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.pipeline && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {pipelines.length === 0 ? (
              <span className="text-slate-400 text-[11px] italic">Loading pipelines...</span>
            ) : (
              pipelines.map(({ name, count }) => {
                const active = filterState.pipelineTags.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateFilter('pipelineTags', name)}
                    className={`px-2.5 py-1 rounded-xl text-xs transition-colors border cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-blue-400'
                    }`}
                  >
                    <span>{name}</span>
                    <span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 2. Family tags -> family */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => toggleSection('family')}
          className="flex items-center justify-between w-full font-bold text-slate-800 dark:text-slate-200 py-1"
        >
          <span>Model Family</span>
          {openSections.family ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.family && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {families.length === 0 ? (
              <span className="text-slate-400 text-[11px] italic">Loading families...</span>
            ) : (
              families.map(({ name, count }) => {
                const active = filterState.familyTags.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateFilter('familyTags', name)}
                    className={`px-2.5 py-1 rounded-xl text-xs transition-colors border cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-blue-400'
                    }`}
                  >
                    <span>{name}</span>
                    <span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 3. Architecture tags -> hf_tags.architecture / architecture_category */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => toggleSection('architecture')}
          className="flex items-center justify-between w-full font-bold text-slate-800 dark:text-slate-200 py-1"
        >
          <span>Architecture Type</span>
          {openSections.architecture ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.architecture && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {architectures.length === 0 ? (
              <span className="text-slate-400 text-[11px] italic">Loading architectures...</span>
            ) : (
              architectures.map(({ name, count }) => {
                const active = filterState.architectureTags.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateFilter('architectureTags', name)}
                    className={`px-2.5 py-1 rounded-xl text-xs transition-colors border cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-blue-400'
                    }`}
                  >
                    <span>{name}</span>
                    <span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 4. Weight tags -> weight_format */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => toggleSection('weight')}
          className="flex items-center justify-between w-full font-bold text-slate-800 dark:text-slate-200 py-1"
        >
          <span>Weight Format</span>
          {openSections.weight ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.weight && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {weights.length === 0 ? (
              <span className="text-slate-400 text-[11px] italic">Loading weights...</span>
            ) : (
              weights.map(({ name, count }) => {
                const active = filterState.weightTags.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateFilter('weightTags', name)}
                    className={`px-2.5 py-1 rounded-xl text-xs transition-colors border cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-blue-400'
                    }`}
                  >
                    <span>{name}</span>
                    <span className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 5. Safetensors file count range -> safetensor_file_count */}
      <div className="pb-3">
        <button
          type="button"
          onClick={() => toggleSection('safetensors')}
          className="flex items-center justify-between w-full font-bold text-slate-800 dark:text-slate-200 py-1"
        >
          <span>Safetensors Shards</span>
          {openSections.safetensors ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {openSections.safetensors && (
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">
                  Min Shards
                </label>
                <input
                  type="number"
                  min="0"
                  value={filterState.safetensorMin}
                  onChange={(e) => setSafetensorRange(e.target.value, filterState.safetensorMax)}
                  placeholder="Min"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1 font-medium">
                  Max Shards
                </label>
                <input
                  type="number"
                  min="0"
                  value={filterState.safetensorMax}
                  onChange={(e) => setSafetensorRange(filterState.safetensorMin, e.target.value)}
                  placeholder="Max"
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Presets for Safetensors */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setSafetensorRange(1, 4)}
                className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
              >
                1–4
              </button>
              <button
                type="button"
                onClick={() => setSafetensorRange(5, 15)}
                className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
              >
                5–15
              </button>
              <button
                type="button"
                onClick={() => setSafetensorRange(16, 100)}
                className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors"
              >
                16+
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="p-4 bg-white dark:bg-slate-900 overflow-y-auto max-h-[85vh]">
        {content}
      </div>
    );
  }

  return (
    <aside className="w-64 shrink-0 p-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs h-fit sticky top-20 transition-colors">
      {content}
    </aside>
  );
}
