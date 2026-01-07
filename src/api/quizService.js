import api from './api';

export const quizService = {
  getQuiz: (lessonId) => api.get(`/lessons/${lessonId}/quiz`),
  // Mengirim skor untuk dibandingkan dengan min_score (75) di backend [cite: 30, 37]
  submitResult: (courseId, score) => 
    api.post(`/courses/${courseId}/quiz/submit`, { score }),
};