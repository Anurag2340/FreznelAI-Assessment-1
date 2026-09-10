import React, { useState } from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { Wifi, WifiOff, RefreshCw, Database, Radio } from 'lucide-react';
import { SpectrumButton } from '../common/SpectrumButton.jsx';

export function NetworkStatus({ compact = false }) {
  const { 
    networkStatus, 
    isUsingCache, 
    metadata, 
    lastSyncTime, 
    refreshModels, 
    toggleSimulatedOffline 
  } = useModels();

  const [refreshing, setRefreshing] = useState(false);

  const isOnline = networkStatus.isOnline;
  const isSimulated = networkStatus.isSimulatedOffline;

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshModels();
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  const formatCachedTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Recent';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {isOnline ? 'Online' : 'Offline — Using cached model data'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 text-xs">
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {isOnline && (
              <span className="absolute w-4 h-4 rounded-full bg-emerald-500/25 animate-ping" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span>Offline — Using cached model data</span>
                </>
              )}
            </span>

            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>
                {isUsingCache
                  ? `Cache sync timestamp: ${formatCachedTime(metadata?.cachedAt)}`
                  : `Live sync active (Last refreshed: ${formatCachedTime(lastSyncTime)})`}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 ml-auto">
        <SpectrumButton
          size="small"
          variant={isSimulated ? 'accent' : 'secondary'}
          onClick={toggleSimulatedOffline}
          title="Toggle simulated offline state to test assessment offline requirements"
          icon={Radio}
        >
          {isSimulated ? 'Resume Online Mode' : 'Simulate Offline'}
        </SpectrumButton>

        <SpectrumButton
          size="small"
          variant="secondary"
          disabled={!isOnline || refreshing}
          loading={refreshing}
          onClick={handleManualRefresh}
          icon={RefreshCw}
          title="Fetch latest models from remote API"
        >
          {refreshing ? 'Refreshing...' : 'Refresh API'}
        </SpectrumButton>
      </div>
    </div>
  );
}
