import { X, AlertTriangle, Info } from 'lucide-react';
import Portal from './Portal';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  // Color variants
  const iconClasses = {
    danger: 'text-red-600 dark:text-red-500',
    warning: 'text-amber-600 dark:text-amber-500',
    default: 'text-blue-600 dark:text-blue-500',
  };

  const iconBgClasses = {
    danger: 'bg-red-50 dark:bg-red-900/20',
    warning: 'bg-amber-50 dark:bg-amber-900/20',
    default: 'bg-blue-50 dark:bg-blue-900/20',
  };

  const buttonClasses = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    default: 'bg-blue-600 hover:bg-blue-700',
  };

  const Icon = variant === 'danger' || variant === 'warning' ? AlertTriangle : Info;

  // ESC key handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0" 
          onClick={onCancel}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-stone-100 dark:border-stone-800">
            <div className={`p-3 rounded-full ${iconBgClasses[variant]}`}>
              <Icon size={24} className={iconClasses[variant]} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white flex-1">
              {title}
            </h3>
            <button
              onClick={onCancel}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="text-stone-600 dark:text-stone-300">
              {message}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 rounded-b-2xl flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl transition-colors disabled:opacity-50 btn-press"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 font-bold text-white rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2 btn-press ${buttonClasses[variant]}`}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
