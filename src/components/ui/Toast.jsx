import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useToast, TOAST_TYPES } from '../../hooks/useToast';
import { cn } from '../../utils/cn';

// Individual toast component
const ToastItem = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove]);

  // Get styles based on toast type
  const getToastStyles = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          bgClass: 'bg-green-50 border-green-200',
          textClass: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case TOAST_TYPES.ERROR:
        return {
          bgClass: 'bg-red-50 border-red-200',
          textClass: 'text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      case TOAST_TYPES.WARNING:
        return {
          bgClass: 'bg-yellow-50 border-yellow-200',
          textClass: 'text-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600'
        };
      case TOAST_TYPES.INFO:
      default:
        return {
          bgClass: 'bg-blue-50 border-blue-200',
          textClass: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-600'
        };
    }
  };

  const styles = getToastStyles(toast.type);
  const IconComponent = styles.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.3 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8
          }}
          className={cn(
            "relative pointer-events-auto flex w-full max-w-sm items-center space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg",
            styles.bgClass
          )}
        >
          <IconComponent className={cn("h-5 w-5 shrink-0", styles.iconColor)} />
          <div className="flex-1">
            <p className={cn("text-sm font-medium", styles.textClass)}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(toast.id), 300);
            }}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-md p-1 transition-colors hover:bg-black/10",
              styles.textClass
            )}
          >
            <X className="h-4 w-4" />
          </button>

          {/* Progress bar for auto-hide */}
          {toast.duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: toast.duration / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-1 bg-black/20"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main toast container component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  // Only render if there are toasts and we're in the browser
  if (typeof window === 'undefined' || !toasts.length) {
    return null;
  }

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Helper function to get styles (unified for both components)
const getToastStyles = (type) => {
  switch (type) {
    case TOAST_TYPES.SUCCESS:
      return {
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      };
    case TOAST_TYPES.ERROR:
      return {
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-800',
        icon: AlertCircle,
        iconColor: 'text-red-600'
      };
    case TOAST_TYPES.WARNING:
      return {
        bgClass: 'bg-yellow-50 border-yellow-200',
        textClass: 'text-yellow-800',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600'
      };
    case TOAST_TYPES.INFO:
    default:
      return {
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-800',
        icon: Info,
        iconColor: 'text-blue-600'
      };
  }
};

// Toast component (exported for easy usage)
const Toast = ({ message, type = TOAST_TYPES.INFO, duration = 5000, onRemove }) => {
  const styles = getToastStyles(type);
  const IconComponent = styles.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      className={cn(
        "relative pointer-events-auto flex w-full max-w-sm items-center space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg",
        styles.bgClass
      )}
    >
      <IconComponent className={cn("h-5 w-5 shrink-0", styles.iconColor)} />
      <div className="flex-1">
        <p className={cn("text-sm font-medium", styles.textClass)}>
          {message}
        </p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-md p-1 transition-colors hover:bg-black/10",
            styles.textClass
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
};

export default Toast;
export { ToastContainer };
