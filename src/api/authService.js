import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data), // Nama, Email, WA
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};