import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry,
}) => {
  return (
    <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5 sm:mt-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-200">{title}</h4>
          <p className="text-xs text-rose-300/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          icon={RefreshCw}
          className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 shrink-0 self-end sm:self-auto"
        >
          Retry
        </Button>
      )}
    </div>
  );
};
