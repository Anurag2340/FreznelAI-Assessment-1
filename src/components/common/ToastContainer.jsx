import React from 'react';
import { useToast } from '../../context/ToastContext.jsx';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#1473e6] shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    warning: 'border-amber-500/30',
    info: 'border-[#1473e6]/30',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3 bg-white dark:bg-[#202020] text-neutral-800 dark:text-neutral-100 text-sm rounded shadow-lg border ${borderMap[toast.type] || 'border-neutral-200 dark:border-[#333]'} transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
        >
          {iconMap[toast.type] || iconMap.info}
          <div className="flex-1 text-xs leading-relaxed break-words">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 focus:outline-none"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
