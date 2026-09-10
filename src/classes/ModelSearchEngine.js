/**
 * ModelSearchEngine
 * Object-Oriented Search Engine implementing case-insensitive substring searching
 * from start or middle of strings across:
 * - Model Name: display_name, id
 * - Model Family: family
 * 
 * Includes debouncing and throttling utilities.
 */

export class ModelSearchEngine {
  constructor() {
    this.defaultField = 'all'; // 'all', 'name', or 'family'
  }

  /**
   * Performs case-insensitive substring matching across real API fields:
   * Model Name: display_name, id
   * Model Family: family
   * Matches whether the substring is at the beginning, middle, or end of the string.
   * 
   * @param {Array<Object>} models - Array of model objects
   * @param {string} query - Search term entered by user
   * @param {string|Array<string>} [field='all'] - 'all', 'name', or 'family'
   * @returns {Array<Object>} Matching models
   */
  search(models, query, field = 'all') {
    if (!Array.isArray(models)) return [];
    if (!query || typeof query !== 'string') return models;

    const cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.length === 0) return models;

    return models.filter((model) => {
      if (!model) return false;

      const displayName = String(model.display_name || model.name || model.displayName || '').toLowerCase();
      const id = String(model.id || model.huggingface_repo || '').toLowerCase();
      const family = String(model.family || model.model_family || '').toLowerCase();

      const searchMode = Array.isArray(field)
        ? (field.length === 1 ? field[0] : 'all')
        : field;

      if (searchMode === 'name') {
        return displayName.includes(cleanQuery) || id.includes(cleanQuery);
      }

      if (searchMode === 'family') {
        return family.includes(cleanQuery);
      }

      // Default / 'all': match any of display_name, id, or family
      return displayName.includes(cleanQuery) || id.includes(cleanQuery) || family.includes(cleanQuery);
    });
  }

  /**
   * Utility: Debounce function execution
   * Delays invocation until after delayMs has elapsed since last call.
   */
  static debounce(fn, delayMs = 300) {
    let timer = null;
    const debounced = function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delayMs);
    };
    debounced.cancel = () => {
      if (timer) clearTimeout(timer);
    };
    return debounced;
  }

  /**
   * Utility: Throttle function execution
   * Enforces a maximum execution rate of once per limitMs.
   */
  static throttle(fn, limitMs = 300) {
    let inThrottle = false;
    let lastArgs = null;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
          if (lastArgs) {
            fn.apply(this, lastArgs);
            lastArgs = null;
          }
        }, limitMs);
      } else {
        lastArgs = args;
      }
    };
  }
}
