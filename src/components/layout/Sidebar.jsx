import React from 'react';
import { NavLink } from 'react-router-dom';
import { useModels } from '../../context/ModelContext.jsx';
import { 
  LayoutDashboard, 
  Layers, 
  Star, 
  History, 
  User, 
  Scale, 
  Cloud,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { getActiveApiUrl } from '../../config/api.js';

export function Sidebar({ isMobile = false, onClose, onOpenCompare }) {
  const { totalModelCount, favorites, recentModels, comparisonList } = useModels();
  const currentApi = getActiveApiUrl();

  const navItems = [
    {
      to: '/app',
      end: true,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/app/models',
      label: 'Model Catalog',
      icon: Layers,
      badge: totalModelCount > 0 ? totalModelCount : null,
    },
    {
      to: '/app/favorites',
      label: 'Favorites',
      icon: Star,
      badge: favorites.length > 0 ? favorites.length : null,
    },
    {
      to: '/app/recent',
      label: 'Recently Viewed',
      icon: History,
      badge: recentModels.length > 0 ? recentModels.length : null,
    },
    {
      to: '/app/profile',
      label: 'User & Biometrics',
      icon: User,
    },
  ];

  const content = (
    <div className="flex flex-col justify-between h-full text-xs select-none">
      <div>
        {/* Mobile close header */}
        {isMobile && (
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section title */}
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Registry Hub
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={isMobile ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>

              {item.badge !== null && item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.badge > 0
                    ? 'bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Compare Matrix Trigger Button */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onOpenCompare}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Comparison Matrix</span>
            </div>
            {comparisonList.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {comparisonList.length}/3
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Footer info: Hosted API Source Status */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <Cloud className="w-3.5 h-3.5 text-blue-500" />
          <span>Synced HF Endpoint</span>
        </div>
        <p className="truncate font-mono text-[10px] bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
          {currentApi}
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          Auto-synced with IndexedDB offline fallback.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs">
        <div className="bg-white dark:bg-[#0f172a] w-72 max-w-full h-full p-4 sm:p-5 shadow-2xl animate-in slide-in-from-left duration-200">
          {content}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-60 shrink-0 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800/80 p-4 hidden md:block min-h-[calc(100vh-4rem)] transition-colors duration-200">
      {content}
    </aside>
  );
}
