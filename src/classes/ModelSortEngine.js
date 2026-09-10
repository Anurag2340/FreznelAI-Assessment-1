/**
 * ModelSortEngine
 * Object-Oriented Sorting Engine.
 * Supports:
 * - Safetensor: Low -> High, High -> Low (strictly numeric, never lexicographic)
 * - Model name: A -> Z, Z -> A (case-insensitive alphabetical)
 * - Optional: Popularity (Downloads)
 */

export class ModelSortEngine {
  constructor() {
    this.SORT_KEYS = {
      SAFETENSOR_ASC: 'safetensors-asc',
      SAFETENSOR_DESC: 'safetensors-desc',
      NAME_ASC: 'name-asc',
      NAME_DESC: 'name-desc',
      DOWNLOADS_DESC: 'downloads-desc',
    };
  }

  /**
   * Safely extracts safetensor_file_count as a number or null
   */
  getSafetensorCount(m) {
    const raw = m.safetensor_file_count !== undefined 
      ? m.safetensor_file_count 
      : (m.safetensors_file_count !== undefined 
          ? m.safetensors_file_count 
          : m.safetensorCount);

    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    const num = Number(raw);
    return !isNaN(num) && isFinite(num) ? num : null;
  }

  /**
   * Safely extracts model display name
   */
  getModelName(m) {
    return String(m.display_name || m.name || m.displayName || m.id || '').trim();
  }

  /**
   * Sorts models array based on selected key.
   * Safetensor sorting MUST be numeric, not lexicographic.
   * 
   * @param {Array<Object>} models - Filtered/searched models
   * @param {string} sortKey - One of the defined SORT_KEYS
   * @returns {Array<Object>} Sorted shallow copy
   */
  sort(models, sortKey = 'name-asc') {
    if (!Array.isArray(models) || models.length <= 1) return models;

    const list = [...models];

    switch (sortKey) {
      case 'safetensors-asc':
      case 'safetensor-asc':
        return list.sort((a, b) => {
          const numA = this.getSafetensorCount(a);
          const numB = this.getSafetensorCount(b);
          if (numA === null && numB === null) return 0;
          if (numA === null) return 1; // null values placed at end
          if (numB === null) return -1;
          return numA - numB; // strictly numeric comparison
        });

      case 'safetensors-desc':
      case 'safetensor-desc':
        return list.sort((a, b) => {
          const numA = this.getSafetensorCount(a);
          const numB = this.getSafetensorCount(b);
          if (numA === null && numB === null) return 0;
          if (numA === null) return 1; // null values placed at end
          if (numB === null) return -1;
          return numB - numA; // strictly numeric comparison
        });

      case 'name-desc':
        return list.sort((a, b) => 
          this.getModelName(b).localeCompare(this.getModelName(a), undefined, { sensitivity: 'base' })
        );

      case 'downloads-desc':
        return list.sort((a, b) => (Number(b.downloads) || 0) - (Number(a.downloads) || 0));

      case 'name-asc':
      default:
        return list.sort((a, b) => 
          this.getModelName(a).localeCompare(this.getModelName(b), undefined, { sensitivity: 'base' })
        );
    }
  }

  /**
   * Helper to describe available sort options for UI dropdown
   */
  getOptions() {
    return [
      { id: 'name-asc', label: 'Model name: A → Z' },
      { id: 'name-desc', label: 'Model name: Z → A' },
      { id: 'safetensors-asc', label: 'Safetensors: Low → High' },
      { id: 'safetensors-desc', label: 'Safetensors: High → Low' },
      { id: 'downloads-desc', label: 'Popularity: Most Downloaded' },
    ];
  }
}
