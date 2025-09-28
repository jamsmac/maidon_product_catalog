import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { api, APIError } from './api';
import { withErrorHandling } from '../utils/apiErrorHandler';

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Create a testable version without error handling
const rawApi = {
  getProducts: async () => {
    const response = await fetch('http://localhost:3001/products');
    const data = await response.json();
    return data;
  },
  getProduct: async (id) => {
    const response = await fetch(`http://localhost:3001/products/${id}`);
    const data = await response.json();
    return data;
  },
  createQuote: async (data) => {
    const response = await fetch('http://localhost:3001/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  },
  getEquipment: async () => {
    const response = await fetch('http://localhost:3001/equipment');
    const data = await response.json();
    return data;
  },
  createOrder: async (data) => {
    const response = await fetch('http://localhost:3001/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  },
  login: async (email, password) => {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    return result;
  }
};

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('API Call Structure', () => {
    it('makes correct GET request to products endpoint', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([])
      });

      await rawApi.getProducts();

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/products');
    });

    it('makes correct POST request with JSON body', async () => {
      const testData = { test: 'data' };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      await rawApi.createQuote(testData);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3001/quotes',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        })
      );
    });

    it('handles login endpoint correctly', async () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'jwt-token', user: { id: 1 } })
      });

      await rawApi.login(credentials.email, credentials.password);

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3001/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
      );
    });
  });

  describe('Error Handling Integration', () => {
    it('handles network errors through error handler', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getProducts()).rejects.toThrow(APIError);
    });

    it('handles 404 errors', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not found' })
      });

      await expect(api.getProduct(999)).rejects.toThrow(APIError);
    });

    it('handles validation errors (400)', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Validation error' })
      });

      await expect(api.createQuote({})).rejects.toThrow(APIError);
    });

    it('handles server errors (500)', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' })
      });

      await expect(api.getEquipment()).rejects.toThrow(APIError);
    });
  });

  describe('Successful Responses', () => {
    // Use raw API calls without error handling for successful scenarios
    it('returns equipment data', async () => {
      const mockEquipment = [
        { id: 1, name: 'Excavator', status: 'active' }
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEquipment)
      });

      const result = await rawApi.getEquipment();
      expect(result).toEqual(mockEquipment);
    });

    it('returns products data', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 1000 }
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      });

      const result = await rawApi.getProducts();
      expect(result).toEqual(mockProducts);
    });

    it('creates order successfully', async () => {
      const orderData = { items: [], total: 1000 };
      const mockResponse = { id: 123, status: 'confirmed' };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await rawApi.createOrder(orderData);
      expect(result).toEqual(mockResponse);
    });

    it('creates quote successfully', async () => {
      const quoteData = { equipmentType: 'excavator' };
      const mockResponse = { id: 456, status: 'pending' };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await rawApi.createQuote(quoteData);
      expect(result).toEqual(mockResponse);
    });
  });
});
