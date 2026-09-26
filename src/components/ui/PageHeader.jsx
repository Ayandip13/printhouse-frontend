import React from 'react';

export const PageHeader = ({ title, description, badge, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-200/80">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 truncate">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {/* Action button inline on mobile top right */}
          {action && <div className="sm:hidden shrink-0">{action}</div>}
        </div>
        {description && (
          <p className="text-[11px] sm:text-sm text-slate-500 font-medium line-clamp-1 sm:line-clamp-none">
            {description}
          </p>
        )}
      </div>
      {/* Action button on desktop */}
      {action && <div className="hidden sm:flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
};

