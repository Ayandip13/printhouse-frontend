import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header (Pinned at top) */}
        <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-white z-10">
          <div className="pr-4 min-w-0">
            {title && <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">{title}</h3>}
            {description && <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 sm:p-2 rounded-xl transition-colors focus:outline-none cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body (Scrollable inside modal) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {children}
        </div>

        {/* Modal Footer (Pinned at bottom) */}
        {footer && (
          <div className="shrink-0 px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 sm:gap-3 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

