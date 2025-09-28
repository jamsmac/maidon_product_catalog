// Export all type definitions and utility functions
export * from './api.types.js';
export * from './components.types.js';

// Utility functions for type checking
export const isProduct = (obj) => {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj && 'price' in obj;
};

export const isEquipment = (obj) => {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj && 'status' in obj;
};

export const isUser = (obj) => {
  return obj && typeof obj === 'object' && 'id' in obj && 'email' in obj && 'name' in obj;
};

export const isAPIError = (obj) => {
  return obj && typeof obj === 'object' && 'message' in obj && 'status' in obj;
};

// Enum-like constants for better type safety
export const EquipmentTypes = {
  EXCAVATOR: 'excavator',
  LOADER: 'loader',
  BULLDOZER: 'bulldozer',
  CRANE: 'crane',
  TRUCK: 'truck'
};

export const EquipmentStatuses = {
  ACTIVE: 'active',
  IDLE: 'idle',
  MAINTENANCE: 'maintenance',
  WARNING: 'warning',
  OFFLINE: 'offline'
};

export const QuoteStatuses = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

export const OrderStatuses = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const UserRoles = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager'
};
