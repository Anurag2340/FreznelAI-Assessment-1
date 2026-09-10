/**
 * ModelRepository
 * Central Domain Repository coordinating API Client, IndexedDB Cache, and Network State.
 * Implements the offline-first fallback strategy:
 * - Online: Fetches live data from API, caches to IndexedDB, dispatches live data
 * - Offline / Error: Falls back seamlessly to IndexedDB cached models
 * - Offline Startup: Loads IndexedDB cache immediately, alerts user if cache is missing
 * - Background Refresh: Background polling and auto-sync when network returns
 */

import { ModelApiClient } from './ModelApiClient.js';
import { ModelCache } from './ModelCache.js';
import { networkManager } from './NetworkManager.js';

export class ModelRepository {
  constructor(apiClient = new ModelApiClient(), cache = new ModelCache()) {
    this.apiClient = apiClient;
    this.cache = cache;
    this.networkManager = networkManager;
    this.models = [];
    this.metadata = null;
    this.isUsingCache = false;
    this.listeners = new Set();
    this.refreshIntervalId = null;

    // Listen to network transitions: automatically re-sync when coming back online
    this.networkManager.subscribe((status) => {
      if (status.isOnline && this.isUsingCache) {
        this.refreshModels().catch((err) => {
          console.warn('Auto-reconnection sync failed:', err);
        });
      }
    });
  }

  /**
   * Subscribes to repository state changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    this.listeners.forEach((fn) => {
      try {
        fn(event, data);
      } catch (err) {
        console.error('Repository listener error:', err);
      }
    });
  }

  /**
   * Initializes model dataset.
   * Checks network; if online attempts API; on failure or offline loads cache.
   * @returns {Promise<{ models: Array<Object>, isUsingCache: boolean, metadata: Object|null }>}
   */
  getModels(forceRefresh = false) {
    const isOnline = this.networkManager.isOnline();

    // If already in memory and not forcing refresh, return in-memory
    if (this.models.length > 0 && !forceRefresh) {
      return Promise.resolve({
        models: this.models,
        isUsingCache: this.isUsingCache,
        metadata: this.metadata
      });
    }

    // If offline, bypass network call directly and retrieve IndexedDB cache
    if (!isOnline) {
      return this.loadFromCacheOnly('You are offline. Showing cached model data.');
    }

    // When online, call live API using pure Promise chaining
    return this.apiClient.fetchModels()
      .then((liveModels) => {
        if (!liveModels || liveModels.length === 0) {
          throw new Error('API returned an empty model list');
        }

        this.models = liveModels;
        this.isUsingCache = false;

        // Persist to IndexedDB asynchronously
        this.cache.saveModels(liveModels).catch((cacheErr) => {
          console.warn('Failed to persist models to IndexedDB:', cacheErr);
        });

        this.metadata = {
          cachedAt: new Date().toISOString(),
          totalCount: liveModels.length,
          source: 'LIVE_API'
        };

        this.notify('DATA_UPDATED', {
          models: this.models,
          isUsingCache: false,
          metadata: this.metadata
        });

        return {
          models: this.models,
          isUsingCache: false,
          metadata: this.metadata
        };
      })
      .catch((apiErr) => {
        console.warn('API error encountered, activating cache fallback:', apiErr.message);
        // Seamless fallback to IndexedDB cache
        return this.loadFromCacheOnly(`API unavailable (${apiErr.message}). Using cached data.`);
      });
  }

  /**
   * Helper to load purely from IndexedDB cache
   */
  loadFromCacheOnly(reasonMessage = '') {
    return this.cache.loadModels()
      .then((cachedModels) => {
        return this.cache.loadMetadata().then((meta) => {
          if (cachedModels && cachedModels.length > 0) {
            this.models = cachedModels;
            this.isUsingCache = true;
            this.metadata = meta || {
              cachedAt: new Date().toISOString(),
              totalCount: cachedModels.length,
              source: 'INDEXED_DB_CACHE'
            };

            this.notify('CACHE_FALLBACK', {
              models: this.models,
              isUsingCache: true,
              metadata: this.metadata,
              reason: reasonMessage
            });

            return {
              models: this.models,
              isUsingCache: true,
              metadata: this.metadata
            };
          } else {
            // No cache exists yet
            const emptyError = new Error(
              'No cached model data is available yet. Connect to the internet once to initialize the model catalog.'
            );
            emptyError.isMissingCache = true;
            throw emptyError;
          }
        });
      });
  }

  /**
   * Explicitly triggers a live refresh from API
   */
  refreshModels() {
    return this.getModels(true);
  }

  /**
   * Fetches single model details from memory, API, or cache
   */
  getModelDetails(modelId) {
    const memoryHit = this.models.find((m) => m.id === modelId);
    if (memoryHit) {
      return Promise.resolve(memoryHit);
    }

    if (this.networkManager.isOnline()) {
      return this.apiClient.fetchModelDetails(modelId)
        .catch(() => this.findInCache(modelId));
    }

    return this.findInCache(modelId);
  }

  findInCache(modelId) {
    return this.cache.loadModels().then((cachedList) => {
      const match = (cachedList || []).find((m) => m.id === modelId);
      if (match) return match;
      throw new Error(`Model '${modelId}' not found in cache.`);
    });
  }

  /**
   * Starts periodic background refresh when online (every 5 minutes)
   */
  startBackgroundSync(intervalMs = 300000) {
    if (this.refreshIntervalId) clearInterval(this.refreshIntervalId);
    this.refreshIntervalId = setInterval(() => {
      if (this.networkManager.isOnline()) {
        this.refreshModels().catch(() => {});
      }
    }, intervalMs);
  }

  stopBackgroundSync() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }
}

export const modelRepository = new ModelRepository();
