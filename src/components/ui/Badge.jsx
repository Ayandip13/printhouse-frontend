import React from 'react';

export const Badge = ({ children, status = 'default', className = '' }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200/90',
    processing: 'bg-blue-50 text-blue-700 border-blue-200/90',
    process: 'bg-blue-50 text-blue-700 border-blue-200/90',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
    complete: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200/90',
    active: 'bg-violet-50 text-violet-700 border-violet-200/90',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const key = String(status).toLowerCase();
  const appliedStyle = styles[key] || styles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${appliedStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {children || status}
    </span>
  );
};
