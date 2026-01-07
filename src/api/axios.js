import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.lpkfarafi.com', // Sesuaikan dengan domain backend Anda [cite: 46]
});

export default api;