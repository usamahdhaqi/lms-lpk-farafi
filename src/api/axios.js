import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Sesuaikan dengan domain backend Anda
});

export default api;