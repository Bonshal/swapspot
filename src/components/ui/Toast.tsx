import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { message, type, duration = 5000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500 mr-2" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500 mr-2" size={20} />;
      case 'warning':
        return <AlertCircle className="text-amber-500 mr-2" size={20} />;
      default:
        return <CheckCircle className="text-blue-500 mr-2" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={`flex items-center px-4 py-3 border rounded-lg shadow-sm ${getBackgroundColor()} animate-fade-in mb-2`}
    >
      {getIcon()}
      <p className="flex-grow">{message}</p>
      <button
        onClick={onDismiss}
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md w-full space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

// Helper functions to show toasts
export const showToast = {
  success: (message: string, duration?: number) => {
    return useToastStore.getState().addToast({ message, type: 'success', duration });
  },
  error: (message: string, duration?: number) => {
    return useToastStore.getState().addToast({ message, type: 'error', duration });
  },
  info: (message: string, duration?: number) => {
    return useToastStore.getState().addToast({ message, type: 'info', duration });
  },
  warning: (message: string, duration?: number) => {
    return useToastStore.getState().addToast({ message, type: 'warning', duration });
  },
};
