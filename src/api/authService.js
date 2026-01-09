import api from './api';

export const authService = {
  register: (data) => api.post('/api/register', data), // Nama, Email, WA
  login: (credentials) => api.post('api/login', credentials),
  getProfile: () => api.get('/api/profile'),
};