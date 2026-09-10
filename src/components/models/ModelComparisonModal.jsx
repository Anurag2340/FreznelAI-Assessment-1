import React from 'react';
import { useModels } from '../../context/ModelContext.jsx';
import { X, Scale, Trash2, Check, Download } from 'lucide-react';
import { SpectrumButton } from '../common/SpectrumButton.jsx';
import { SpectrumBadge } from '../common/SpectrumBadge.jsx';

export function ModelComparisonModal({ isOpen, onClose }) {
  const { comparisonList, toggleCompare, clearComparison, selectModel, selectedModel } = useModels();

  if (!isOpen) return null;

  const formatGb = (bytes) => {
    if (!bytes) return 'N/A';
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#1c1c1c] border border-neutral-300 dark:border-[#333] rounded-lg shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-[#2d2d2d]">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#1473e6]" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Model Comparison Matrix ({comparisonList.length}/3)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {comparisonList.length > 0 && (
              <SpectrumButton
                size="small"
                variant="quiet"
                onClick={clearComparison}
                icon={Trash2}
              >
                Clear Matrix
              </SpectrumButton>
            )}

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {comparisonList.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
              No models currently in comparison. Click the scale icon on any model card to compare up to 3 models side-by-side.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-[#333]">
                    <th className="text-left py-2 px-3 font-semibold text-neutral-400 uppercase tracking-wider w-36">
                      Feature
                    </th>
                    {comparisonList.map((m) => (
                      <th key={m.id} className="text-left py-2 px-3 font-bold text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-start justify-between gap-2">
                          <span className="line-clamp-2">{m.name}</span>
                          <button
                            onClick={() => toggleCompare(m)}
                            className="text-neutral-400 hover:text-rose-500"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-[#282828]">
                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Family
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                        {m.family}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Architecture
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {m.architectureTags?.map((a) => (
                            <SpectrumBadge key={a} variant="notice">
                              {a}
                            </SpectrumBadge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Parameter Weights
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {m.weightTags?.map((w) => (
                            <SpectrumBadge key={w} variant="neutral">
                              {w}
                            </SpectrumBadge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Safetensors File Count
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                        {m.safetensorCount} files
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Safetensors Size
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3 font-semibold text-neutral-800 dark:text-neutral-200">
                        {formatGb(m.safetensorSizeBytes)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Context Length
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3">
                        {m.contextLength?.toLocaleString()} tokens
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      License
                    </td>
                    {comparisonList.map((m) => (
                      <td key={m.id} className="py-2.5 px-3">
                        {m.license}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-2.5 px-3 font-medium text-neutral-500 dark:text-neutral-400">
                      Select for Project
                    </td>
                    {comparisonList.map((m) => {
                      const isSel = selectedModel?.id === m.id;
                      return (
                        <td key={m.id} className="py-2.5 px-3">
                          <SpectrumButton
                            size="small"
                            variant={isSel ? 'accent' : 'primary'}
                            onClick={() => selectModel(m)}
                            icon={isSel ? Check : undefined}
                          >
                            {isSel ? 'Selected' : 'Select'}
                          </SpectrumButton>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 dark:border-[#2d2d2d] flex justify-end">
          <SpectrumButton variant="secondary" size="small" onClick={onClose}>
            Close Matrix
          </SpectrumButton>
        </div>
      </div>
    </div>
  );
}
