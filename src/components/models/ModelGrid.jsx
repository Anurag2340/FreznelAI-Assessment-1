import React from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { ModelCard } from './ModelCard.jsx';
import { LoadingSkeleton } from '../common/LoadingSkeleton.jsx';
import { SearchX, ArrowUpDown } from 'lucide-react';
import { SpectrumButton } from '../common/SpectrumButton.jsx';

export function ModelGrid({ onViewDetails }) {
  const {
    displayedModels,
    loading,
    error,
    clearFilters,
    sortKey,
    setSortKey,
    sortOptions,
    filteredCount,
    totalModelCount,
  } = useModels();

  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-[#2e2e2e] rounded-md">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Unable to Load Models
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
          {error}
        </p>
        <SpectrumButton variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </SpectrumButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Grid Sorting Header */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-neutral-200 dark:border-[#2a2a2a] text-xs">
        <span className="text-neutral-500 dark:text-neutral-400">
          Showing <strong className="text-neutral-800 dark:text-neutral-200">{filteredCount}</strong> of {totalModelCount} models
        </span>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline">Sort:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="text-xs bg-white dark:bg-[#222222] border border-neutral-300 dark:border-[#383838] rounded px-2.5 py-1 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#1473e6]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Empty State */}
      {displayedModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#1c1c1c] border border-neutral-200 dark:border-[#2e2e2e] rounded-md">
          <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-[#282828] text-neutral-400 flex items-center justify-center mb-3">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            No models match your search or filters.
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
            Try loosening search terms, adjusting safetensors range, or clearing tags.
          </p>
          <SpectrumButton variant="primary" onClick={clearFilters}>
            Clear All Filters
          </SpectrumButton>
        </div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
