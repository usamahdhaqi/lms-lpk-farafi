export const authService = {
  login: async (credentials) => {
    // Pastikan URL-nya benar (pakai /api/login)
    const response = await api.post('/api/login', credentials);
    return response.data; // Ini harus berisi { user, token }
  }
};