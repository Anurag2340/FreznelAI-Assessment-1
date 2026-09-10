import React, { useState } from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { 
  Star, 
  Check, 
  Layers, 
  Cpu, 
  HardDrive, 
  Download, 
  FileText, 
  ChevronRight,
  Scale,
  Sparkles,
  Lock,
  ExternalLink,
  Terminal,
  Copy
} from 'lucide-react';
import { SpectrumBadge } from '../common/SpectrumBadge.jsx';

export function ModelCard({ model, onViewDetails }) {
  const { 
    selectedModel, 
    selectModel, 
    toggleFavorite, 
    isFavorite, 
    toggleCompare, 
    isInCompare,
    hasEncryptedNote 
  } = useModels();

  const { addToast } = useToast();
  const [copiedCli, setCopiedCli] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const isSelected = selectedModel?.id === model.id;
  const favorite = isFavorite(model.id);
  const compared = isInCompare(model.id);
  const hasNote = hasEncryptedNote(model.id);

  // Gesture Controls: Swipe left to select, swipe right to favorite
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    if (Math.abs(diff) < 90) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 50) {
      toggleFavorite(model);
    } else if (swipeOffset < -50) {
      selectModel(model);
    }
    setTouchStartX(null);
    setSwipeOffset(0);
  };

  const handleCopyCli = (e) => {
    e.stopPropagation();
    const cmd = model.cliDownloadCommand || `huggingface-cli download ${model.id}`;
    navigator.clipboard.writeText(cmd);
    setCopiedCli(true);
    addToast(`Copied download command for ${model.name}`, 'success');
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      className={`group relative flex flex-col justify-between bg-white dark:bg-[#0f172a] border rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
          : 'border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Bar: Family + Author + Action Buttons */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider truncate">
              {model.family}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {model.author}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Direct Hugging Face Repo Link */}
            <a
              href={model.repoUrl || `https://huggingface.co/${model.id}`}
              target="_blank"
              rel="noreferrer"
              title="Open repository on Hugging Face"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => toggleCompare(model)}
              title={compared ? 'Remove from compare matrix' : 'Add to compare matrix'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                compared
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Favorite Star */}
            <button
              type="button"
              onClick={() => toggleFavorite(model)}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                favorite
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Model Title */}
        <h3
          onClick={() => onViewDetails(model)}
          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug mb-2 line-clamp-1"
          title={model.name}
        >
          {model.name}
        </h3>

        {/* Shards & Size Badge strip */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {/* Safetensors shard counter */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <HardDrive className="w-3 h-3" />
            {model.safetensorCount} shards
          </span>

          {/* Weight parameter badge */}
          {model.weightTags?.map((wt) => (
            <span key={wt} className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {wt}
            </span>
          ))}

          {/* Architecture category (e.g. Dense / MoE) */}
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {model.architectureCategory || 'Dense'}
          </span>

          {hasNote && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Lock className="w-2.5 h-2.5" />
              <span>E2EE</span>
            </span>
          )}
        </div>

        {/* Quick CLI Download Command Pill */}
        <div 
          onClick={handleCopyCli}
          className="group/cli flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 mb-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          title="Click to copy CLI download command"
        >
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <Terminal className="w-3.5 h-3.5 text-slate-400 group-hover/cli:text-blue-500 shrink-0" />
            <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate">
              {model.cliDownloadCommand || `huggingface-cli download ${model.id}`}
            </code>
          </div>
          <button
            type="button"
            className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shrink-0"
            title="Copy CLI command"
          >
            {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl mb-4 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Arch: <strong className="text-slate-700 dark:text-slate-200">{model.pytorchArchitecture || 'Transformer'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Format: <strong className="text-slate-700 dark:text-slate-200">{model.weightFormat || 'BF16'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Downloads: <strong className="text-slate-700 dark:text-slate-200">{model.downloads ? `${(model.downloads / 1000).toFixed(0)}k` : '50k+'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Context: <strong className="text-slate-700 dark:text-slate-200">{model.contextLength ? `${(model.contextLength / 1000).toFixed(0)}k` : '32k'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => onViewDetails(model)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Inspect Specs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => selectModel(model)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isSelected
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Selected</span>
            </>
          ) : (
            <span>Select Model</span>
          )}
        </button>
      </div>
    </div>
  );
}
