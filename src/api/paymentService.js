import api from './api';

export const paymentService = {
  checkout: (courseId) => api.post('/payments/checkout', { courseId }),
  // Upload bukti transfer untuk verifikasi manual oleh Admin [cite: 14, 49]
  uploadProof: (enrollmentId, file) => {
    const formData = new FormData();
    formData.append('proof', file);
    return api.post(`/payments/verify-manual/${enrollmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};