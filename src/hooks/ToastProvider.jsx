import React from 'react';

import { useToastLogic, ToastContext } from './useToast';

/**
 * Компонент-провайдер для Toast системы
 * Оборачивает приложение ToastProvider и ToastContainer
 */
const ToastProviderWrapper = ({ children }) => {
  const toastValue = useToastLogic();

  return (
    <ToastContext.Provider value={toastValue}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProviderWrapper;
