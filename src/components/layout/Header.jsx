import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useModels } from '../../context/ModelContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Star, 
  History, 
  Scale, 
  ShieldCheck,
  Menu,
  X,
  Database,
  Search,
  Sparkles,
  Check
} from 'lucide-react';
import { NetworkStatus } from './NetworkStatus.jsx';

export function Header({ onToggleMobileNav }) {
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { comparisonList, favorites, recentModels, totalModelCount } = useModels();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-xs select-none transition-colors duration-200">
      {/* Left: Mobile Nav Toggle + Logo */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            type="button"
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/app" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Box className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base text-slate-900 dark:text-white tracking-tight leading-none">
                ModelHub
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                HF
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Neural Registry
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls: Quick Search, Network, Theme Toggle, Compare, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Status compact badge */}
        <NetworkStatus compact />

        {/* Quick Compare Button */}
        <Link
          to="/app/models"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Compare Models (${comparisonList.length}/3)`}
        >
          <Scale className="w-4 h-4" />
          {comparisonList.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {comparisonList.length}
            </span>
          )}
        </Link>

        {/* Favorites shortcut */}
        <Link
          to="/app/favorites"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Favorites (${favorites.length})`}
        >
          <Star className={`w-4 h-4 ${favorites.length > 0 ? 'text-amber-500 fill-current' : ''}`} />
          {favorites.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Link>

        {/* Theme Toggle Button - High Contrast & Clearly Working */}
        <button
          id="theme-toggle-button"
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all shadow-xs cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/30 transition-all focus:outline-none cursor-pointer"
            title="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'D'}
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100 z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {user?.displayName || 'Developer'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email || 'developer@modelhub.ai'}
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-3 h-3" />
                  Authenticated User
                </span>
              </div>

              <Link
                to="/app/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors font-medium"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account & Biometrics Profile</span>
              </Link>

              <Link
                to="/app/favorites"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Favorite Models</span>
                </div>
                {favorites.length > 0 && (
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link
                to="/app/recent"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors font-medium"
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Recent Models</span>
                </div>
                {recentModels.length > 0 && (
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
                    {recentModels.length}
                  </span>
                )}
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of ModelHub</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
