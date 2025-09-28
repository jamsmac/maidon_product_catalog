import { createContext, useContext, useState, useCallback } from 'react';

// Types of toasts
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Toast context - only contains the logic, not JSX
const ToastContext = createContext();

// Hook to manage toast logic
export const useToastLogic = () => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast
  const addToast = useCallback((message, type = TOAST_TYPES.INFO, duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setToasts(prevToasts => [...prevToasts, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove a toast by id
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Helper methods for different toast types
  const success = useCallback((message, duration) => addToast(message, TOAST_TYPES.SUCCESS, duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, TOAST_TYPES.ERROR, duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, TOAST_TYPES.WARNING, duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, TOAST_TYPES.INFO, duration), [addToast]);

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  };

  return value;
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Hook to integrate with API error handler
export const useToastErrorHandler = () => {
  const { error } = useToast();

  const showApiError = useCallback((apiError) => {
    // Handle different types of API errors
    if (apiError?.message) {
      error(apiError.message);
    } else if (typeof apiError === 'string') {
      error(apiError);
    } else {
      error('Произошла неизвестная ошибка');
    }
  }, [error]);

  return { showApiError };
};

// Export context for use in components
export { ToastContext };
