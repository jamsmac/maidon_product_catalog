const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

import { withErrorHandling, APIError } from '../utils/apiErrorHandler.js';

export const api = {
  // Продукты
  getProducts: async () => {
    return withErrorHandling((signal) => fetch(`${API_URL}/api/products`, { signal }));
  },

  getProduct: async (id) => {
    return withErrorHandling((signal) => fetch(`${API_URL}/api/products/${id}`, { signal }));
  },

  // Оборудование
  getEquipment: async () => {
    return withErrorHandling((signal) => fetch(`${API_URL}/api/equipment`, { signal }));
  },

  // Запчасти
  searchParts: async (vin) => {
    return withErrorHandling((signal) => fetch(`${API_URL}/api/parts/search?vin=${vin}`, { signal }));
  },

  // Заявки
  createQuote: async (data) => {
    return withErrorHandling((signal) =>
      fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal
      })
    );
  },

  // Корзина/Заказы
  createOrder: async (data) => {
    return withErrorHandling((signal) =>
      fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal
      })
    );
  },

  // Авторизация
  login: async (email, password) => {
    try {
      const result = await withErrorHandling((signal) =>
        fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          signal
        })
      );

      // Специальная обработка для авторизации
      if (result.success === false || result.error) {
        throw new APIError(result.error || 'Ошибка авторизации', 401, result);
      }

      return result;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Ошибка авторизации', 401, { originalError: error.message });
    }
  }
};
