export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  PRODUCTS: "/products",
  EQUIPMENT: "/equipment", 
  QUOTES: "/quotes",
  ORDERS: "/orders",
  AUTH: "/auth"
};

export const CACHE_NAMES = {
  STATIC: "mydon-cache-v1",
  API: "mydon-api-cache-v1", 
  IMAGES: "mydon-images-cache-v1"
};

export const STORAGE_KEYS = {
  CART: "mydon_cart",
  WISHLIST: "mydon_wishlist", 
  COMPARISON: "mydon_comparison"
};

export const UI_CONSTANTS = {
  MAX_COMPARISON_ITEMS: 4,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  SKELETON_COUNT: 3
};

export const ERROR_MESSAGES = {
  NETWORK: "Проблемы с подключением к интернету",
  TIMEOUT: "Сервер не отвечает",
  GENERIC: "Произошла ошибка"
};
