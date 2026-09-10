import React, { useState, useEffect, useMemo } from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { ModelSearchEngine } from '../../classes/ModelSearchEngine.js';
import { Search, X, History, SlidersHorizontal } from 'lucide-react';
import { SpectrumBadge } from '../common/SpectrumBadge.jsx';

export function SearchBar({ onToggleMobileFilters, activeFilterCount = 0 }) {
  const {
    searchQuery,
    setSearchQuery,
    searchField,
    setSearchField,
    filteredCount,
    totalModelCount,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useModels();

  const [localInput, setLocalInput] = useState(searchQuery);

  // Synchronize local input if query changed externally (e.g. clear filters)
  useEffect(() => {
    setLocalInput(searchQuery);
  }, [searchQuery]);

  // Debounced search trigger (300ms)
  const debouncedSearch = useMemo(
    () =>
      ModelSearchEngine.debounce((val) => {
        setSearchQuery(val);
        if (val && val.trim().length > 1) {
          addRecentSearch(val.trim());
        }
      }, 250),
    [setSearchQuery, addRecentSearch]
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setLocalInput(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setLocalInput('');
    setSearchQuery('');
  };

  const handleRecentClick = (term) => {
    setLocalInput(term);
    setSearchQuery(term);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2 w-full">
        {/* Search input field */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            id="model-search-input"
            type="text"
            value={localInput}
            onChange={handleInputChange}
            placeholder="Search models by name or family (e.g. 'llama', '70b', 'mistral')..."
            className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-[#383838] rounded focus:outline-none focus:border-[#1473e6] focus:ring-1 focus:ring-[#1473e6] transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />

          {localInput && (
            <button
              onClick={handleClear}
              className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded focus:outline-none"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Field Target Selector */}
        <div className="hidden sm:flex items-center text-xs bg-neutral-100 dark:bg-[#252525] border border-neutral-300 dark:border-[#383838] rounded p-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setSearchField('all')}
            className={`px-2 py-1 rounded transition-colors ${
              searchField === 'all'
                ? 'bg-white dark:bg-[#333] text-[#1473e6] font-medium shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            All Fields
          </button>
          <button
            type="button"
            onClick={() => setSearchField('name')}
            className={`px-2 py-1 rounded transition-colors ${
              searchField === 'name'
                ? 'bg-white dark:bg-[#333] text-[#1473e6] font-medium shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Model Name
          </button>
          <button
            type="button"
            onClick={() => setSearchField('family')}
            className={`px-2 py-1 rounded transition-colors ${
              searchField === 'family'
                ? 'bg-white dark:bg-[#333] text-[#1473e6] font-medium shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            Model Family
          </button>
        </div>

        {/* Mobile Filter Drawer Button */}
        {onToggleMobileFilters && (
          <button
            type="button"
            onClick={onToggleMobileFilters}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-neutral-100 dark:bg-[#252525] border border-neutral-300 dark:border-[#383838] rounded text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-[#303030]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#1473e6] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Result Count and Recent Searches Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-0.5">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{filteredCount}</span>
          <span>{filteredCount === 1 ? 'model matches' : 'models found'}</span>
          {filteredCount !== totalModelCount && (
            <span className="text-neutral-400 dark:text-neutral-500">
              (of {totalModelCount} total)
            </span>
          )}
        </div>

        {recentSearches.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <History className="w-3 h-3" />
              <span>Recent:</span>
            </span>
            {recentSearches.slice(0, 4).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleRecentClick(term)}
                className="text-[11px] px-2 py-0.5 bg-neutral-100 dark:bg-[#252525] hover:bg-neutral-200 dark:hover:bg-[#333] text-neutral-700 dark:text-neutral-300 rounded transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 underline ml-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
