import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching data.',
  onRetry,
}) => {
  return (
    <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0 mt-0.5 sm:mt-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900">{title}</h4>
          <p className="text-xs text-rose-700/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          icon={RefreshCw}
          className="border-rose-300 text-rose-700 hover:bg-rose-100/50 shrink-0 self-end sm:self-auto"
        >
          Retry
        </Button>
      )}
    </div>
  );
};
