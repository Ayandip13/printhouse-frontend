import React from 'react';
import { Printer, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
      {/* Mobile Branding */}
      <div className="flex md:hidden items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-0.5 shadow-md shadow-violet-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <Printer className="w-4 h-4 text-violet-600" />
          </div>
        </div>
        <span className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1">
          PrintCraft
        </span>
      </div>

      {/* Desktop Welcome Status */}
      <div className="hidden md:block">
        <p className="text-xs font-semibold text-slate-500">
          Printing & Gift Shop Management • <span className="text-violet-600 font-bold">Admin Panel</span>
        </p>
      </div>

      {/* Admin User Header Badge & Logout */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate max-w-[120px] sm:max-w-none">{user?.name || 'Admin'}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
