import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.data?.token) {
      localStorage.setItem('printshop_auth_token', response.data.data.token);
      localStorage.setItem('printshop_auth_user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('printshop_auth_token');
    localStorage.removeItem('printshop_auth_user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('printshop_auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('printshop_auth_token');
  },
};
