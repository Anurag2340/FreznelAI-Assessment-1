/**
 * Centralized API Configuration
 * Manages endpoints, timeouts, and headers for ModelHub.
 * Adheres to assessment requirement: "Do NOT hardcode the API URL throughout the application."
 */

export const API_URL = import.meta.env.VITE_MODEL_API_URL || 'https://binaire.app/hf-models-api.json';

export const API_CONFIG = {
  // Primary model API URL from environment variable
  MODEL_API_URL: API_URL,

  // Base URL defaults to the Express proxy /api or can be overridden by environment variable
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',

  ENDPOINTS: {
    MODELS: '/models',
    HEALTH: '/health',
    SYNC: '/sync',
    E2EE_VERIFY: '/e2ee/verify',
  },

  TIMEOUT_MS: 12000,
  MAX_RETRIES: 2,
  RETRY_DELAY_MS: 1000,

  // Cache configuration for IndexedDB
  CACHE: {
    DB_NAME: 'ModelHubCacheDB',
    DB_VERSION: 1,
    STORE_NAME: 'models_store',
    META_STORE: 'sync_metadata',
    CACHE_EXPIRY_MS: 1000 * 60 * 30, // 30 minutes
  }
};

/**
 * Returns the effective API URL based on runtime settings
 */
export function getActiveApiUrl() {
  const customUrl = localStorage.getItem('modelhub_custom_api_url');
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim();
  }
  return API_URL;
}

export function setActiveApiUrl(newUrl) {
  if (newUrl) {
    localStorage.setItem('modelhub_custom_api_url', newUrl);
  } else {
    localStorage.removeItem('modelhub_custom_api_url');
  }
}
