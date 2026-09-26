import React from 'react';
import { Printer, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Branding (Visible on mobile screens) */}
      <div className="flex md:hidden items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Printer className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <span className="text-sm font-black text-white tracking-tight flex items-center gap-1">
          PrintCraft <Sparkles className="w-3 h-3 text-pink-400 fill-pink-400/20" />
        </span>
      </div>

      {/* Desktop Welcome Status */}
      <div className="hidden md:block">
        <p className="text-xs font-medium text-slate-400">
          Printing & Gift Shop Management • <span className="text-indigo-400 font-semibold">Admin Panel</span>
        </p>
      </div>

      {/* Admin User Header Badge & Logout */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate max-w-[120px] sm:max-w-none">{user?.name || 'Admin'}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold transition-all duration-200 active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
