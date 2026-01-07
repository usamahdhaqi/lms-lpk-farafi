import api from './api';

export const courseService = {
  getAllCourses: () => api.get('/courses'), // Untuk Katalog Landing Page [cite: 7]
  getCourseDetail: (id) => api.get(`/courses/${id}`),
  // Mengupdate progres ke kolom progress_percentage di MySQL 
  updateProgress: (courseId, lessonId) => 
    api.post(`/courses/${courseId}/lessons/${lessonId}/complete`),
};