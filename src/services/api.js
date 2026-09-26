import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || '/api';

const getFormattedApiUrl = (url) => {
  if (!url || url === '/api') return '/api';
  let trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed.endsWith('/api')) {
    trimmed += '/api';
  }
  return trimmed;
};

const API_URL = getFormattedApiUrl(rawUrl);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token into Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('printshop_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global API errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 unauthorized
      localStorage.removeItem('printshop_auth_token');
      localStorage.removeItem('printshop_auth_user');
      // If we are not already on the login page, redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
