import axios from 'axios';

const API_BASE_URL = 'https://api.lpkfarafi.com'; // Sesuaikan dengan domain backend Anda

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyertakan token JWT jika sudah login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;