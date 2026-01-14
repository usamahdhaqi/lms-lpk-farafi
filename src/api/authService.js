import api from './api'; // Pastikan path ke api.js Anda benar

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      // response.data harus berisi { user, token } dari backend
      return response.data; 
    } catch (error) {
      // Melempar error agar bisa ditangkap oleh catch(err) di Login.jsx
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};