import React from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { SpectrumBadge } from '../common/SpectrumBadge.jsx';

export function ActiveFilterChips() {
  const { filterState, updateFilter, setSafetensorRange, clearFilters, activeFilterCount } = useModels();

  if (activeFilterCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mr-1">
        Active Filters:
      </span>

      {/* Pipeline tags */}
      {filterState.pipelineTags?.map((tag) => (
        <SpectrumBadge
          key={`pipe-${tag}`}
          variant="info"
          removable
          onRemove={() => updateFilter('pipelineTags', tag)}
        >
          {tag}
        </SpectrumBadge>
      ))}

      {/* Family tags */}
      {filterState.familyTags?.map((tag) => (
        <SpectrumBadge
          key={`fam-${tag}`}
          variant="positive"
          removable
          onRemove={() => updateFilter('familyTags', tag)}
        >
          {tag}
        </SpectrumBadge>
      ))}

      {/* Architecture tags */}
      {filterState.architectureTags?.map((tag) => (
        <SpectrumBadge
          key={`arch-${tag}`}
          variant="notice"
          removable
          onRemove={() => updateFilter('architectureTags', tag)}
        >
          {tag}
        </SpectrumBadge>
      ))}

      {/* Weight tags */}
      {filterState.weightTags?.map((tag) => (
        <SpectrumBadge
          key={`wt-${tag}`}
          variant="neutral"
          removable
          onRemove={() => updateFilter('weightTags', tag)}
        >
          {tag}
        </SpectrumBadge>
      ))}

      {/* Safetensors min/max */}
      {(filterState.safetensorMin !== '' || filterState.safetensorMax !== '') && (
        <SpectrumBadge
          variant="neutral"
          removable
          onRemove={() => setSafetensorRange('', '')}
        >
          Safetensors: {filterState.safetensorMin || '0'} – {filterState.safetensorMax || 'Max'}
        </SpectrumBadge>
      )}

      <button
        type="button"
        onClick={clearFilters}
        className="text-xs text-[#1473e6] hover:underline font-medium ml-2 cursor-pointer"
      >
        Clear all ({activeFilterCount})
      </button>
    </div>
  );
}
