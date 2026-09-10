/**
 * NetworkManager
 * Monitors network events (online/offline), measures API connectivity,
 * and allows simulated offline/slow modes to test the assessment requirement:
 * "app will be switched to online and offline mode randomly and the UI has to tell the user about the current internet connection"
 */

export class NetworkManager {
  constructor() {
    this.listeners = new Set();
    this.isSimulatedOffline = false;
    this.lastPingMs = 0;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleStatusChange());
      window.addEventListener('offline', () => this.handleStatusChange());
    }
  }

  /**
   * Checks real and simulated network status
   * @returns {boolean} True if online
   */
  isOnline() {
    if (this.isSimulatedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  /**
   * Toggles simulated offline state for testing evaluation scenarios
   */
  toggleSimulatedOffline(forceValue) {
    this.isSimulatedOffline = typeof forceValue === 'boolean' ? forceValue : !this.isSimulatedOffline;
    this.notify();
    return this.isSimulatedOffline;
  }

  /**
   * Subscribes to connectivity status updates
   * @param {Function} callback 
   * @returns {Function} unsubscribe function
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback({
      isOnline: this.isOnline(),
      isSimulatedOffline: this.isSimulatedOffline,
      lastPingMs: this.lastPingMs
    });
    return () => this.listeners.delete(callback);
  }

  handleStatusChange() {
    this.notify();
  }

  notify() {
    const state = {
      isOnline: this.isOnline(),
      isSimulatedOffline: this.isSimulatedOffline,
      lastPingMs: this.lastPingMs
    };
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('Error in network subscriber:', err);
      }
    });
  }

  /**
   * Pings the API healthcheck to verify real internet connectivity
   * @returns {Promise<number>} Latency in milliseconds
   */
  ping(endpoint = '/api/health') {
    if (!this.isOnline()) {
      return Promise.reject(new Error('Cannot ping while offline.'));
    }
    const start = performance.now();
    return fetch(endpoint, { method: 'GET', cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Health check returned ${res.status}`);
        this.lastPingMs = Math.round(performance.now() - start);
        this.notify();
        return this.lastPingMs;
      })
      .catch((err) => {
        this.lastPingMs = -1;
        this.notify();
        throw err;
      });
  }
}

export const networkManager = new NetworkManager();
