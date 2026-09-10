import React, { useState } from 'react';
import { useModels } from '../context/ModelContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';
import { 
  Layers, 
  Cpu, 
  Database, 
  Sparkles, 
  Star, 
  History, 
  Search, 
  ArrowRight,
  Wifi,
  HardDrive,
  ShieldCheck,
  Zap,
  Terminal,
  Server,
  Download,
  ExternalLink,
  CheckCircle2,
  Filter,
  Flame,
  Check,
  Scale
} from 'lucide-react';
import { ModelCard } from '../components/models/ModelCard.jsx';
import { getActiveApiUrl } from '../config/api.js';

export function Dashboard() {
  const { 
    models, 
    totalModelCount, 
    dynamicFacets, 
    isUsingCache, 
    favorites, 
    recentModels, 
    networkStatus,
    setSearchQuery,
    updateFilter,
    toggleOfflineSimulation
  } = useModels();

  const { user } = useAuth();
  const navigate = useNavigate();
  const { onInspectModel } = useOutletContext() || {};
  const [copiedQuickCmd, setCopiedQuickCmd] = useState(false);

  const activeApi = getActiveApiUrl();

  const handleQuickSearch = (family) => {
    updateFilter('familyTags', family);
    navigate('/app/models');
  };

  const handleQuickPipeline = (pipeline) => {
    updateFilter('pipelineTags', pipeline);
    navigate('/app/models');
  };

  // Select top featured foundation models for the showcase
  const featuredModels = models.length > 0
    ? models.slice(0, 6)
    : [];

  const handleCopyTopCli = () => {
    const topModel = models[0];
    const cmd = topModel?.cliDownloadCommand || 'huggingface-cli download meta-llama/Llama-3.1-8B';
    navigator.clipboard.writeText(cmd);
    setCopiedQuickCmd(true);
    setTimeout(() => setCopiedQuickCmd(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero: Visual Mission Statement & Status */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-[#0f172a] dark:via-[#090d16] dark:to-blue-950/20 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          {/* Status Badge Strip */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hugging Face Neural Models Engine</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>{totalModelCount || 161} Models Ready</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>E2EE Notes Active</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
            Open-Weights Foundation Model Registry & Deployment Hub
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-normal">
            Welcome, <strong className="text-slate-900 dark:text-white font-semibold">{user?.displayName || 'Senior ML Engineer'}</strong>. 
            This workbench synchronizes directly with the Hugging Face models API (<code className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">https://binaire.app/hf-models-api.json</code>) to provide 1-click CLI downloads, Safetensors shard telemetry, VRAM hardware estimation, and zero-loss offline caching.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/app/models')}
              className="py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Explore Model Catalog ({totalModelCount})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={handleCopyTopCli}
              className="py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-blue-500" />
              <span>{copiedQuickCmd ? 'Copied Top CLI Command!' : 'Copy Top Download CLI'}</span>
            </button>

            <button
              type="button"
              onClick={toggleOfflineSimulation}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
              title="Simulate offline mode to test IndexedDB persistence"
            >
              <Database className="w-4 h-4 text-emerald-500" />
              <span>{networkStatus.isSimulatedOffline ? 'Simulating Offline' : 'Test Offline Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Purpose & Value Proposition Strip: "What is the purpose of this website?" */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Platform Core Capabilities & Purpose</span>
          </h2>
          <span className="text-xs text-slate-500">How to use this utility</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Purpose 1 */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              1. HF Models Registry
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore 160+ foundational models including Meta Llama 3.1, Mistral, Google Gemma 2, and NVIDIA Nemotron with Safetensors telemetry.
            </p>
          </div>

          {/* Purpose 2 */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              2. Fast CLI & Serving
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Copy <code className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">huggingface-cli download</code> commands, vLLM OpenAI servers, and Ollama scripts in 1 click.
            </p>
          </div>

          {/* Purpose 3 */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              3. VRAM Hardware Sizing
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automatic GPU memory calculation for BF16 vs AWQ/GGUF quantizations. Predict requirements before spinning up cloud compute.
            </p>
          </div>

          {/* Purpose 4 */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
              4. Offline Sync & E2EE
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Persistent IndexedDB caching enables full offline catalog navigation with AES-GCM encrypted notes for private evaluation prompts.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Total Models */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Active Hugging Face Models
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-3xl font-black text-slate-900 dark:text-white">
              {totalModelCount || 161}
            </strong>
            <span className="text-xs text-emerald-500 font-bold">100% Synced</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Across 20+ architectures</span>
          </div>
        </div>

        {/* Metric 2: Model Families */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Supported Families
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-3xl font-black text-slate-900 dark:text-white">
              {dynamicFacets.families?.length || 15}
            </strong>
            <span className="text-xs text-slate-400">Open-weights</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Llama, Mistral, Gemma, Phi, Qwen</span>
          </div>
        </div>

        {/* Metric 3: Pipeline Categories */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Task Domains
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-3xl font-black text-slate-900 dark:text-white">
              {dynamicFacets.pipelines?.length || 8}
            </strong>
            <span className="text-xs text-slate-400">Pipelines</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Text, Vision, Math, Coding</span>
          </div>
        </div>

        {/* Metric 4: Offline Engine */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Persistence Layer
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <strong className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              IndexedDB
            </strong>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              networkStatus.isOnline ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
            }`}>
              {networkStatus.isOnline ? 'Online Synced' : 'Offline Ready'}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Zero data-loss storage</span>
          </div>
        </div>
      </div>

      {/* Quick Filter Architecture Pills */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>Filter Catalog by Model Family</span>
          </h3>
          <span className="text-xs text-slate-400">Click to filter</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Llama', 'Mistral', 'Gemma', 'Qwen', 'DeepSeek', 'Phi', 'Nemotron', 'Whisper', 'FLUX'].map((fam) => (
            <button
              key={fam}
              onClick={() => handleQuickSearch(fam)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700/60 font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{fam}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      {/* Live Featured Models Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Trending Foundation Models</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top open-weights architectures synchronized from <span className="font-mono">binaire.app</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/models')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all {totalModelCount} models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onViewDetails={onInspectModel}
            />
          ))}
        </div>
      </div>

      {/* Favorites Showcase (if any) */}
      {favorites.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span>Pinned Favorites ({favorites.length})</span>
            </h2>
            <Link to="/app/favorites" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {favorites.slice(0, 3).map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onViewDetails={onInspectModel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
