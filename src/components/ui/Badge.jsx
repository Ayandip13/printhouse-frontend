import React from 'react';

export const Badge = ({ children, status = 'default', className = '' }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    processing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    active: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const key = String(status).toLowerCase();
  const appliedStyle = styles[key] || styles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${appliedStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {children || status}
    </span>
  );
};
