import React from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { CheckCircle2, X, Terminal, HardDrive } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export function SelectedModelBanner({ onOpenDetails }) {
  const { selectedModel, clearSelectedModel } = useModels();
  const { addToast } = useToast();

  if (!selectedModel) return null;

  const handleCopyCli = (e) => {
    e.stopPropagation();
    const cmd = selectedModel.cliDownloadCommand || `huggingface-cli download ${selectedModel.id}`;
    navigator.clipboard.writeText(cmd);
    addToast('Copied download command for selected model.', 'success');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto bg-slate-900/95 dark:bg-slate-900/95 text-white shadow-2xl border border-slate-700/80 rounded-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Selected:
              </span>
              <strong className="text-sm font-bold text-white truncate max-w-xs sm:max-w-sm">
                {selectedModel.name}
              </strong>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>•</span>
              <span className="text-blue-400 font-semibold">{selectedModel.family}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <HardDrive className="w-3 h-3" />
                {selectedModel.safetensorCount} shards
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleCopyCli}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy download command"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Copy CLI</span>
          </button>

          {onOpenDetails && (
            <button
              type="button"
              onClick={() => onOpenDetails(selectedModel)}
              className="px-3 py-1.5 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer"
            >
              Inspect Specs
            </button>
          )}

          <button
            type="button"
            onClick={clearSelectedModel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Deselect model"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
