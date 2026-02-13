import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get credentials from localStorage or use empty string
const getAuthHeader = () => {
  const credentials = localStorage.getItem('auth_credentials');
  return credentials ? `Basic ${credentials}` : '';
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth header to each request
api.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

// Locations API
export const locationsAPI = {
  getAll: () => api.get('/locations/'),
  getById: (id) => api.get(`/locations/${id}/`),
  create: (data) => api.post('/locations/', data),
  update: (id, data) => api.put(`/locations/${id}/`, data),
  delete: (id) => api.delete(`/locations/${id}/`),
};

// Assets API
export const assetsAPI = {
  getAll: () => api.get('/assets/'),
  getById: (id) => api.get(`/assets/${id}/`),
  create: (data) => api.post('/assets/', data),
  update: (id, data) => api.put(`/assets/${id}/`, data),
  delete: (id) => api.delete(`/assets/${id}/`),
  checkout: (id, data) => api.post(`/assets/${id}/checkout/`, data),
  return: (id, data) => api.post(`/assets/${id}/return_asset/`, data),
  transfer: (id, data) => api.post(`/assets/${id}/transfer/`, data),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions/'),
  getById: (id) => api.get(`/transactions/${id}/`),
};

// Statistics API
export const statsAPI = {
  getDashboard: async () => {
    try {
      const [assets, transactions] = await Promise.all([
        api.get('/assets/'),
        api.get('/transactions/'),
      ]);
      return { assets: assets.data, transactions: transactions.data };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  getCurrentUser: () => api.get('/me/'),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

export default api;
