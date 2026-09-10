import React from 'react';

export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-[#1f1f1f] border border-neutral-200 dark:border-[#2e2e2e] rounded p-4 flex flex-col gap-3 animate-pulse"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 dark:bg-[#2c2c2c] rounded w-3/4"></div>
              <div className="h-3 bg-neutral-100 dark:bg-[#252525] rounded w-1/3"></div>
            </div>
            <div className="w-6 h-6 bg-neutral-100 dark:bg-[#252525] rounded-full"></div>
          </div>

          <div className="flex flex-wrap gap-1.5 py-1">
            <div className="h-5 w-16 bg-neutral-100 dark:bg-[#262626] rounded"></div>
            <div className="h-5 w-20 bg-neutral-100 dark:bg-[#262626] rounded"></div>
            <div className="h-5 w-12 bg-neutral-100 dark:bg-[#262626] rounded"></div>
          </div>

          <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-[#282828] flex items-center justify-between">
            <div className="h-3.5 w-24 bg-neutral-200 dark:bg-[#2b2b2b] rounded"></div>
            <div className="h-7 w-20 bg-neutral-200 dark:bg-[#2b2b2b] rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
