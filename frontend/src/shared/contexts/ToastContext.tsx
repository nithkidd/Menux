import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-24 z-50 space-y-3 pointer-events-none">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100 border-emerald-200 dark:border-emerald-800',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-100 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100 border-blue-200 dark:border-blue-800',
  };

  const iconColors = {
    success: 'text-emerald-600 dark:text-emerald-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  const Icon = icons[toast.type];

  return (
    <div className={`rounded-xl px-4 py-3 shadow-md text-sm font-medium animate-fade-in-up pointer-events-auto border flex items-center gap-3 min-w-[300px] ${colors[toast.type]}`}>
      <Icon size={20} className={iconColors[toast.type]} />
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-current opacity-60 hover:opacity-100 transition-opacity btn-press"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
