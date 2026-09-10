import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { modelRepository } from '../classes/ModelRepository.js';
import { ModelSearchEngine } from '../classes/ModelSearchEngine.js';
import { ModelFilterEngine } from '../classes/ModelFilterEngine.js';
import { ModelSortEngine } from '../classes/ModelSortEngine.js';
import { ModelExportManager } from '../classes/ModelExportManager.js';
import { E2EEncryptionService } from '../classes/E2EEncryptionService.js';
import { networkManager } from '../classes/NetworkManager.js';
import { useToast } from './ToastContext.jsx';

const ModelContext = createContext(null);

export function ModelProvider({ children }) {
  const { addToast } = useToast();

  // Instantiated OOP service engines
  const searchEngine = useMemo(() => new ModelSearchEngine(), []);
  const filterEngine = useMemo(() => new ModelFilterEngine(), []);
  const sortEngine = useMemo(() => new ModelSortEngine(), []);

  // Raw dataset and state
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingCache, setIsUsingCache] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Network State
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: networkManager.isOnline(),
    isSimulatedOffline: networkManager.isSimulatedOffline,
    lastPingMs: 0
  });

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all'); // 'all', 'name', 'family'
  const [filterState, setFilterState] = useState({
    pipelineTags: [],
    familyTags: [],
    architectureTags: [],
    weightTags: [],
    safetensorMin: '',
    safetensorMax: '',
  });

  // Sorting State
  const [sortKey, setSortKey] = useState('name-asc');

  // Persistence: Selected Model
  const [selectedModel, setSelectedModel] = useState(() => {
    try {
      const saved = localStorage.getItem('modelhub_selected_model');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persistence: Favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('modelhub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence: Recent Models (bounded to 10)
  const [recentModels, setRecentModels] = useState(() => {
    try {
      const saved = localStorage.getItem('modelhub_recent_models');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence: Recent Searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('modelhub_recent_searches');
      return saved ? JSON.parse(saved) : ['llama', 'mistral', 'vision', 'flux'];
    } catch {
      return [];
    }
  });

  // Model Comparison List (max 3)
  const [comparisonList, setComparisonList] = useState([]);

  // End-to-End Encrypted Private Notes Map { [modelId]: string }
  const [encryptedNotes, setEncryptedNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('modelhub_e2ee_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync network updates
  useEffect(() => {
    const unsub = networkManager.subscribe((status) => {
      setNetworkStatus(status);
      if (status.isOnline) {
        addToast('Connected to model network.', 'info', 2500);
      } else {
        addToast('Working offline with cached model repository.', 'warning', 3500);
      }
    });
    return unsub;
  }, [addToast]);

  // Initial Load from Repository
  const loadModels = useCallback((forceRefresh = false) => {
    setLoading(true);
    setError(null);

    modelRepository.getModels(forceRefresh)
      .then((result) => {
        setModels(result.models);
        setIsUsingCache(result.isUsingCache);
        setMetadata(result.metadata);
        setLastSyncTime(new Date());
        setLoading(false);
        if (result.isUsingCache) {
          addToast('Serving models from IndexedDB cache.', 'info', 3000);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || 'Unable to load models from network or cache.');
        addToast(err.message || 'Failed to initialize models', 'error');
      });
  }, [addToast]);

  useEffect(() => {
    loadModels(false);
  }, [loadModels]);

  // Save selected model
  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('modelhub_selected_model', JSON.stringify(selectedModel));
    } else {
      localStorage.removeItem('modelhub_selected_model');
    }
  }, [selectedModel]);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('modelhub_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save recent models
  useEffect(() => {
    localStorage.setItem('modelhub_recent_models', JSON.stringify(recentModels));
  }, [recentModels]);

  // Save recent searches
  useEffect(() => {
    localStorage.setItem('modelhub_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Save E2EE notes
  useEffect(() => {
    localStorage.setItem('modelhub_e2ee_notes', JSON.stringify(encryptedNotes));
  }, [encryptedNotes]);

  // Search & Filter Pipeline
  const displayedModels = useMemo(() => {
    let result = [...models];

    // 1. Search Query execution
    if (searchQuery && searchQuery.trim().length > 0) {
      const fields = searchField === 'name' 
        ? ['name'] 
        : searchField === 'family' 
          ? ['family'] 
          : ['name', 'family'];
      result = searchEngine.search(result, searchQuery, fields);
    }

    // 2. Multi-tag and Safetensors range filtering
    result = filterEngine.filter(result, filterState);

    // 3. Sorting execution
    result = sortEngine.sort(result, sortKey);

    return result;
  }, [models, searchQuery, searchField, filterState, sortKey, searchEngine, filterEngine, sortEngine]);

  // Available dynamic facets for filter tags
  const dynamicFacets = useMemo(() => {
    return filterEngine.extractFacets(models);
  }, [models, filterEngine]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.pipelineTags?.length) count += filterState.pipelineTags.length;
    if (filterState.familyTags?.length) count += filterState.familyTags.length;
    if (filterState.architectureTags?.length) count += filterState.architectureTags.length;
    if (filterState.weightTags?.length) count += filterState.weightTags.length;
    if (filterState.safetensorMin !== '' && filterState.safetensorMin !== null) count += 1;
    if (filterState.safetensorMax !== '' && filterState.safetensorMax !== null) count += 1;
    return count;
  }, [filterState]);

  // Actions
  const updateFilter = useCallback((category, value) => {
    setFilterState((prev) => {
      const currentArr = prev[category] || [];
      const exists = currentArr.includes(value);
      const nextArr = exists ? currentArr.filter((item) => item !== value) : [...currentArr, value];
      return { ...prev, [category]: nextArr };
    });
  }, []);

  const setSafetensorRange = useCallback((min, max) => {
    setFilterState((prev) => ({
      ...prev,
      safetensorMin: min !== undefined ? min : prev.safetensorMin,
      safetensorMax: max !== undefined ? max : prev.safetensorMax,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState({
      pipelineTags: [],
      familyTags: [],
      architectureTags: [],
      weightTags: [],
      safetensorMin: '',
      safetensorMax: '',
    });
    setSearchQuery('');
  }, []);

  const selectModel = useCallback((model) => {
    setSelectedModel(model);
    addToast(`Selected ${model.name} for inference workspace.`, 'success');
  }, [addToast]);

  const clearSelectedModel = useCallback(() => {
    setSelectedModel(null);
    addToast('Cleared model selection.', 'info');
  }, [addToast]);

  const toggleFavorite = useCallback((model) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === model.id);
      if (exists) {
        addToast(`Removed ${model.name} from favorites.`, 'info');
        return prev.filter((m) => m.id !== model.id);
      } else {
        addToast(`Added ${model.name} to favorites.`, 'success');
        return [...prev, model];
      }
    });
  }, [addToast]);

  const isFavorite = useCallback((modelId) => {
    return favorites.some((m) => m.id === modelId);
  }, [favorites]);

  const addRecentModel = useCallback((model) => {
    setRecentModels((prev) => {
      const filtered = prev.filter((m) => m.id !== model.id);
      return [model, ...filtered].slice(0, 10);
    });
  }, []);

  const addRecentSearch = useCallback((term) => {
    if (!term || term.trim().length === 0) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== term.toLowerCase());
      return [term.trim(), ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const toggleCompare = useCallback((model) => {
    setComparisonList((prev) => {
      const exists = prev.some((m) => m.id === model.id);
      if (exists) {
        return prev.filter((m) => m.id !== model.id);
      }
      if (prev.length >= 3) {
        addToast('Comparison limit reached (max 3 models).', 'warning');
        return prev;
      }
      addToast(`Added ${model.name} to comparison matrix.`, 'info');
      return [...prev, model];
    });
  }, [addToast]);

  const isInCompare = useCallback((modelId) => {
    return comparisonList.some((m) => m.id === modelId);
  }, [comparisonList]);

  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  // Safe JSON Export Handlers
  const exportModelJson = useCallback(async (model) => {
    try {
      const res = await ModelExportManager.exportJsonSafely(model, `${model.name}.json`);
      addToast(`Downloaded ${res.filename} (${(res.sizeBytes / 1024).toFixed(1)} KB) with verified SHA-256`, 'success');
      return res;
    } catch (err) {
      addToast(`Download failed: ${err.message}`, 'error');
      throw err;
    }
  }, [addToast]);

  const exportAllModelsJson = useCallback(async () => {
    try {
      const res = await ModelExportManager.exportJsonSafely(
        displayedModels,
        `modelhub-catalog-${displayedModels.length}-models.json`
      );
      addToast(`Exported ${displayedModels.length} models safely.`, 'success');
      return res;
    } catch (err) {
      addToast(`Export failed: ${err.message}`, 'error');
      throw err;
    }
  }, [displayedModels, addToast]);

  // E2EE Private Notes
  const saveEncryptedNote = useCallback(async (modelId, noteText, passphrase) => {
    try {
      const encrypted = await E2EEncryptionService.encrypt(noteText, passphrase);
      setEncryptedNotes((prev) => ({ ...prev, [modelId]: encrypted }));
      addToast('Note encrypted with AES-256 and stored securely.', 'success');
    } catch (err) {
      addToast('Encryption failed.', 'error');
    }
  }, [addToast]);

  const decryptNote = useCallback(async (modelId, passphrase) => {
    const payload = encryptedNotes[modelId];
    if (!payload) return '';
    return await E2EEncryptionService.decrypt(payload, passphrase);
  }, [encryptedNotes]);

  const toggleSimulatedOffline = useCallback(() => {
    const isNowOffline = networkManager.toggleSimulatedOffline();
    if (isNowOffline) {
      addToast('Simulated Offline Mode ACTIVATED. App running purely on IndexedDB cache.', 'warning', 4000);
    } else {
      addToast('Simulated Offline Mode DEACTIVATED. Reconnecting to live API...', 'success', 3000);
      loadModels(true);
    }
  }, [addToast, loadModels]);

  return (
    <ModelContext.Provider
      value={{
        models,
        displayedModels,
        totalModelCount: models.length,
        filteredCount: displayedModels.length,
        loading,
        error,
        isUsingCache,
        metadata,
        lastSyncTime,
        networkStatus,
        searchQuery,
        setSearchQuery,
        searchField,
        setSearchField,
        filterState,
        setFilterState,
        updateFilter,
        setSafetensorRange,
        clearFilters,
        activeFilterCount,
        dynamicFacets,
        sortKey,
        setSortKey,
        sortOptions: sortEngine.getOptions(),
        selectedModel,
        selectModel,
        clearSelectedModel,
        favorites,
        toggleFavorite,
        isFavorite,
        recentModels,
        addRecentModel,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        comparisonList,
        toggleCompare,
        isInCompare,
        clearComparison,
        exportModelJson,
        exportAllModelsJson,
        saveEncryptedNote,
        decryptNote,
        hasEncryptedNote: (id) => !!encryptedNotes[id],
        refreshModels: () => loadModels(true),
        toggleSimulatedOffline,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}

export function useModels() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModels must be used within a ModelProvider');
  }
  return context;
}
