import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 animate-ping absolute inset-0" />
        <div className="w-12 h-12 rounded-full bg-white border border-violet-200 flex items-center justify-center shadow-md shadow-violet-500/10">
          <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600 animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
