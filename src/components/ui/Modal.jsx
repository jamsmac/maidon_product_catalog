import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '../../utils/cn';

// Backdrop component
const Backdrop = ({ className }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
      className
    )}
  />
);

// Modal content component
const ModalContent = ({
  children,
  className,
  size = 'md',
  closeOnOverlayClick = true,
  onClose,
  title
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full'
  };

  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.();
    }
  }, [closeOnOverlayClick, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
        "w-full mx-4",
        sizeClasses[size],
        "bg-white rounded-lg shadow-xl",
        className
      )}
    >
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Title if provided */}
        {title && (
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 pr-8">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div
          className="max-h-[80vh] overflow-y-auto px-6 py-4"
          onClick={handleOverlayClick}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Main Modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Show/hide modal
 * @param {Function} props.onClose - Close handler
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {string} [props.size] - Size: sm|md|lg|xl|2xl|3xl|4xl|5xl|full
 * @param {boolean} [props.closeOnOverlayClick=true] - Close on overlay click
 * @param {boolean} [props.closeOnEsc=true] - Close on Escape key
 * @param {string} [props.className] - Additional classes
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  ...props
}) => {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Prevent rendering if not in browser environment
  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <Backdrop onClick={closeOnOverlayClick ? onClose : undefined} />
          <ModalContent
            className={className}
            size={size}
            closeOnOverlayClick={closeOnOverlayClick}
            onClose={onClose}
            title={title}
            {...props}
          >
            {children}
            {footer && (
              <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                {footer}
              </div>
            )}
          </ModalContent>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Confirm modal component
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Подтверждение',
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  confirmVariant = 'primary',
  isLoading = false,
  ...props
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    {...props}
  >
    <p className="text-gray-600">{message}</p>

    <div className="mt-6 pt-4 border-t flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        disabled={isLoading}
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className={cn(
          "px-4 py-2 text-sm rounded-md transition-colors disabled:opacity-50",
          confirmVariant === 'danger' && "bg-red-600 text-white hover:bg-red-700",
          confirmVariant === 'warning' && "bg-yellow-600 text-white hover:bg-yellow-700",
          confirmVariant === 'primary' && "bg-blue-600 text-white hover:bg-blue-700"
        )}
        disabled={isLoading}
      >
        {isLoading ? 'Загрузка...' : confirmText}
      </button>
    </div>
  </Modal>
);

// Alert modal component
const AlertModal = ({
  isOpen,
  onClose,
  title = 'Уведомление',
  message,
  okText = 'OK',
  type = 'info',
  ...props
}) => {
  const typeStyles = {
    success: 'text-green-600 border-green-200 bg-green-50',
    error: 'text-red-600 border-red-200 bg-red-50',
    warning: 'text-yellow-600 border-yellow-200 bg-yellow-50',
    info: 'text-blue-600 border-blue-200 bg-blue-50'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <div className={cn("p-4 rounded-lg border", typeStyles[type])}>
        <p className="text-sm">{message}</p>
      </div>

      <div className="mt-6 pt-4 border-t flex justify-end">
        <button
          onClick={onClose}
          className={cn(
            "px-4 py-2 text-sm rounded-md transition-colors",
            type === 'error' && "bg-red-600 text-white hover:bg-red-700",
            type === 'warning' && "bg-yellow-600 text-white hover:bg-yellow-700",
            type === 'success' && "bg-green-600 text-white hover:bg-green-700",
            type === 'info' && "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {okText}
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
export { Modal, ConfirmModal, AlertModal };
