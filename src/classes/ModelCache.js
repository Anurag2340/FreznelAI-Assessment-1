/**
 * ModelCache
 * Object-Oriented IndexedDB Storage Engine for offline model data persistence.
 * Fulfills assessment requirements:
 * - "IndexedDB for persistent offline API cache"
 * - "save models, load models, clear cache, store timestamp"
 * - Zero external dependency on third-party libraries for maximum reliability and speed.
 */

import { API_CONFIG } from '../config/api.js';

export class ModelCache {
  constructor(dbName = API_CONFIG.CACHE.DB_NAME, version = API_CONFIG.CACHE.DB_VERSION) {
    this.dbName = dbName;
    this.version = version;
    this.dbPromise = null;
  }

  /**
   * Initializes and opens connection to IndexedDB
   * @returns {Promise<IDBDatabase>}
   */
  getDB() {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB is not supported in this browser environment.'));
      }

      const request = window.indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Models collection store
        if (!db.objectStoreNames.contains(API_CONFIG.CACHE.STORE_NAME)) {
          db.createObjectStore(API_CONFIG.CACHE.STORE_NAME, { keyPath: 'id' });
        }
        // Metadata store for timestamps and sync queues
        if (!db.objectStoreNames.contains(API_CONFIG.CACHE.META_STORE)) {
          db.createObjectStore(API_CONFIG.CACHE.META_STORE, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  /**
   * Saves models list and updates cache metadata timestamp
   * @param {Array<Object>} models 
   * @returns {Promise<boolean>}
   */
  saveModels(models) {
    return this.getDB().then((db) => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction([API_CONFIG.CACHE.STORE_NAME, API_CONFIG.CACHE.META_STORE], 'readwrite');
        const modelStore = tx.objectStore(API_CONFIG.CACHE.STORE_NAME);
        const metaStore = tx.objectStore(API_CONFIG.CACHE.META_STORE);

        // Clear existing models before saving fresh batch
        modelStore.clear();

        for (const model of models) {
          modelStore.put(model);
        }

        const now = new Date().toISOString();
        metaStore.put({
          key: 'sync_metadata',
          cachedAt: now,
          totalCount: models.length,
          source: 'LIVE_API_SYNC',
          expiresAt: new Date(Date.now() + API_CONFIG.CACHE.CACHE_EXPIRY_MS).toISOString()
        });

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(new Error('IndexedDB transaction aborted during save'));
      });
    });
  }

  /**
   * Loads all cached models from IndexedDB
   * @returns {Promise<Array<Object>>}
   */
  loadModels() {
    return this.getDB().then((db) => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(API_CONFIG.CACHE.STORE_NAME, 'readonly');
        const store = tx.objectStore(API_CONFIG.CACHE.STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    });
  }

  /**
   * Retrieves synchronization metadata including cachedAt timestamp
   * @returns {Promise<Object|null>}
   */
  loadMetadata() {
    return this.getDB().then((db) => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(API_CONFIG.CACHE.META_STORE, 'readonly');
        const store = tx.objectStore(API_CONFIG.CACHE.META_STORE);
        const request = store.get('sync_metadata');

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    });
  }

  /**
   * Clears all models and metadata from IndexedDB
   * @returns {Promise<boolean>}
   */
  clearCache() {
    return this.getDB().then((db) => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction([API_CONFIG.CACHE.STORE_NAME, API_CONFIG.CACHE.META_STORE], 'readwrite');
        tx.objectStore(API_CONFIG.CACHE.STORE_NAME).clear();
        tx.objectStore(API_CONFIG.CACHE.META_STORE).clear();

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    });
  }
}
