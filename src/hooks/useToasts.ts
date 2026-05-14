import { useState, useCallback } from 'react';
import type { Toast, UseToastsReturn, ToastType } from '../types';

export function useToasts(): UseToastsReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info'): string => {
      const id = crypto.randomUUID();
      
      setToasts((prev) => [
        ...prev,
        {
          id,
          message,
          type,
        },
      ]);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
}
