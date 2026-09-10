import React from 'react';

/**
 * SpectrumBadge
 * Adobe Spectrum styled compact badge/tag for tags and statuses
 */
export function SpectrumBadge({
  children,
  variant = 'neutral',
  className = '',
  onClick,
  active = false,
  removable = false,
  onRemove,
}) {
  const variantStyles = {
    neutral: active 
      ? "bg-[#1473e6] text-white border-[#1473e6]"
      : "bg-neutral-100 dark:bg-[#252525] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-[#383838]",
    info: "bg-blue-50 dark:bg-[#10243e] text-[#1473e6] dark:text-[#5aa9fa] border-blue-200 dark:border-[#1d3b63]",
    positive: "bg-emerald-50 dark:bg-[#0c291e] text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-[#1b4332]",
    notice: "bg-amber-50 dark:bg-[#30210b] text-amber-800 dark:text-amber-400 border-amber-200 dark:border-[#523916]",
    negative: "bg-rose-50 dark:bg-[#2d1115] text-rose-700 dark:text-rose-400 border-rose-200 dark:border-[#4d1f25]"
  };

  const clickable = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border transition-colors whitespace-nowrap ${variantStyles[variant]} ${
        clickable ? 'cursor-pointer hover:border-[#1473e6] hover:text-[#1473e6]' : ''
      } ${className}`}
    >
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          className="ml-0.5 hover:text-rose-500 focus:outline-none"
          title="Remove filter"
        >
          ×
        </button>
      )}
    </span>
  );
}
