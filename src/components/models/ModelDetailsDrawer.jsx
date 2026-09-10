import React, { useState, useEffect } from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Shield, 
  Lock, 
  Unlock, 
  Cpu, 
  HardDrive, 
  FileText, 
  ExternalLink,
  Scale,
  Terminal,
  Server,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export function ModelDetailsDrawer({ model, onClose }) {
  const { 
    selectedModel, 
    selectModel, 
    exportModelJson, 
    toggleCompare, 
    isInCompare,
    saveEncryptedNote,
    decryptNote,
    hasEncryptedNote,
    addRecentModel 
  } = useModels();

  const { addToast } = useToast();
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedVllm, setCopiedVllm] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // E2EE Note states
  const [noteText, setNoteText] = useState('');
  const [passphrase, setPassphrase] = useState('modelhub-e2ee-key');
  const [isNoteDecrypted, setIsNoteDecrypted] = useState(false);
  const [noteStatus, setNoteStatus] = useState('');

  const isSelected = selectedModel?.id === model?.id;
  const isCompared = model ? isInCompare(model.id) : false;

  useEffect(() => {
    if (model) {
      addRecentModel(model);
      setIsNoteDecrypted(false);
      setNoteText('');
    }
  }, [model, addRecentModel]);

  if (!model) return null;

  const handleCopyJson = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(model, null, 2));
      setCopiedJson(true);
      addToast('Copied model JSON to clipboard.', 'success');
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      addToast('Failed to copy to clipboard.', 'error');
    }
  };

  const handleCopyCli = () => {
    const cmd = model.cliDownloadCommand || `huggingface-cli download ${model.id}`;
    navigator.clipboard.writeText(cmd);
    setCopiedCli(true);
    addToast('Copied CLI download command.', 'success');
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyVllm = () => {
    const cmd = `python3 -m vllm.entrypoints.openai.api_server --model ${model.id} --port 8000`;
    navigator.clipboard.writeText(cmd);
    setCopiedVllm(true);
    addToast('Copied vLLM deployment command.', 'success');
    setTimeout(() => setCopiedVllm(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await exportModelJson(model);
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveEncryptedNote = async () => {
    if (!noteText.trim()) return;
    await saveEncryptedNote(model.id, noteText, passphrase);
    setNoteStatus('Saved & Encrypted (AES-GCM)');
    setTimeout(() => setNoteStatus(''), 2500);
  };

  const handleUnlockNote = async () => {
    try {
      const decrypted = await decryptNote(model.id, passphrase);
      setNoteText(decrypted || '');
      setIsNoteDecrypted(true);
      addToast('Note decrypted successfully.', 'success');
    } catch (err) {
      addToast('Decryption failed. Check passphrase.', 'error');
    }
  };

  const formatGb = (bytes) => {
    if (!bytes) return 'N/A';
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Hardware VRAM estimation based on parameter size
  const paramStr = model.parameterCount || model.weightTags?.[0] || '8B';
  let recommendedVram = 16;
  let recommendedGpu = '1x NVIDIA RTX 4090 / A5000 (24GB)';
  let quantizedVram = 6;
  if (paramStr.includes('405B')) {
    recommendedVram = 640;
    recommendedGpu = '8x NVIDIA H100 (80GB SXM5)';
    quantizedVram = 220;
  } else if (paramStr.includes('70B') || paramStr.includes('72B')) {
    recommendedVram = 48;
    recommendedGpu = '2x NVIDIA A100 (80GB) or 2x RTX 3090/4090';
    quantizedVram = 36;
  } else if (paramStr.includes('27B') || paramStr.includes('32B') || paramStr.includes('35B')) {
    recommendedVram = 32;
    recommendedGpu = '1x NVIDIA A100 (40GB/80GB)';
    quantizedVram = 18;
  } else if (paramStr.includes('14B') || paramStr.includes('9B')) {
    recommendedVram = 18;
    recommendedGpu = '1x NVIDIA RTX 4090 (24GB)';
    quantizedVram = 10;
  } else if (paramStr.includes('1B') || paramStr.includes('2B') || paramStr.includes('3B')) {
    recommendedVram = 8;
    recommendedGpu = 'Apple Silicon (M1/M2/M3) or 1x RTX 3060 (12GB)';
    quantizedVram = 3;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                {model.family}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {model.author}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <HardDrive className="w-3 h-3" />
                {model.safetensorCount} Safetensor shards
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {model.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {model.id}
              </code>
              <a
                href={model.repoUrl || `https://huggingface.co/${model.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                <span>Hugging Face Hub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => selectModel(model)}
              className={`py-2 px-3.5 rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSelected ? <Check className="w-4 h-4" /> : null}
              <span>{isSelected ? 'Currently Selected' : 'Select This Model'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCli}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Terminal className="w-3.5 h-3.5" />}
              <span>{copiedCli ? 'Copied CLI' : 'Copy CLI Command'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export File</span>
            </button>

            <button
              type="button"
              onClick={() => toggleCompare(model)}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
            </button>
          </div>

          {/* Quick CLI Download Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Hugging Face CLI Download Command
              </span>
              <button
                type="button"
                onClick={handleCopyCli}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                {copiedCli ? 'Copied!' : 'Copy Command'}
              </button>
            </div>
            <pre className="font-mono text-xs text-blue-200 bg-black/40 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {model.cliDownloadCommand || `huggingface-cli download ${model.id}`}
            </pre>
          </div>

          {/* Hardware & VRAM Estimator */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                Hardware VRAM & Deployment Estimation
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-950">
                <span className="text-[11px] text-slate-500 block mb-1">Recommended VRAM (BF16)</span>
                <strong className="text-base text-blue-600 dark:text-blue-400 font-bold">{recommendedVram} GB</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-950">
                <span className="text-[11px] text-slate-500 block mb-1">Quantized VRAM (4-bit/AWQ)</span>
                <strong className="text-base text-emerald-600 dark:text-emerald-400 font-bold">~{quantizedVram} GB</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-950">
                <span className="text-[11px] text-slate-500 block mb-1">Safetensors Aggregate</span>
                <strong className="text-base text-slate-800 dark:text-slate-200 font-bold">{formatGb(model.safetensorSizeBytes)}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Target Hardware: <strong className="text-slate-800 dark:text-slate-200">{recommendedGpu}</strong>
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Model Overview
            </h4>
            <p className="leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              {model.description}
            </p>
          </div>

          {/* High-Performance Inference Serving Commands */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-500" />
              <span>Production Serving Options (vLLM / Ollama)</span>
            </h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">vLLM OpenAI-Compatible Server</span>
                  <button
                    type="button"
                    onClick={handleCopyVllm}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-[11px]"
                  >
                    {copiedVllm ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block truncate">
                  python3 -m vllm.entrypoints.openai.api_server --model {model.id} --port 8000
                </code>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] block mb-1">Ollama Local Run</span>
                <code className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">
                  ollama run {model.id.split('/').pop()?.toLowerCase() || 'model'}
                </code>
              </div>
            </div>
          </div>

          {/* Detailed Specifications Table */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Architecture & Weights Registry
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-500">Safetensors Shard Count</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {model.safetensorCount} files
                </span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Architecture Category</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {model.architectureCategory || 'Dense'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-500">PyTorch Implementation</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {model.pytorchArchitecture || 'Transformer'}
                </span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">Default Weight Format</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {model.weightFormat || 'BF16'}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-500">Context Window</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {model.contextLength?.toLocaleString()} tokens
                </span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">License</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {model.license}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 dark:bg-slate-900/60">
                <span className="text-slate-500">SHA-256 Checksum</span>
                <span className="font-mono text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-xs">
                  {model.sha256Checksum || 'e3b0c442...'}
                </span>
              </div>
            </div>
          </div>

          {/* End-to-End Encrypted Private Notes (E2EE) */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  End-to-End Encrypted Developer Notes (AES-GCM)
                </span>
              </div>
              {hasEncryptedNote(model.id) && !isNoteDecrypted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                  Ciphertext Stored
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Store confidential model evaluation prompts, accuracy metrics, or internal deployment tokens encrypted with client-side WebCrypto AES-GCM.
            </p>

            {hasEncryptedNote(model.id) && !isNoteDecrypted ? (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter decryption passphrase..."
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleUnlockNote}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlock</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type confidential developer evaluation notes or benchmarks here..."
                  className="w-full p-3 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {noteStatus}
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveEncryptedNote}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Encrypt & Save Note</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
            Registry: {model.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
}
