import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

// Import Sub-komponen
import CourseNavbar from './components/CourseNavbar';
import ContentDisplay from './components/ContentDisplay';
import CurriculumAccordion from './components/CurriculumAccordion';
import CompletionModal from './components/CompletionModal';
import LoadingState from './components/LoadingState';

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCurriculum, setShowCurriculum] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/api/courses/${courseId}/lessons?userId=${user.id}`);
        const lessonData = res.data;
        setLessons(lessonData);
        
        // Pilih materi yang sedang aktif
        const initial = lessonData.find(l => l.is_completed !== 1) || lessonData[0];
        setActiveLesson(initial);
      } catch (err) {
        console.error("Gagal memuat materi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchLessons();
  }, [courseId, user]);

  // Fungsi pembantu untuk mengecek apakah semua materi non-quiz sudah selesai
  const isAllLessonsFinished = lessons
    .filter(l => l.type !== 'quiz')
    .every(l => l.is_completed === 1);

  const handleComplete = async (lessonId) => {
    try {
      await api.post('/api/progress/complete', { userId: user.id, lessonId, courseId });
      
      const updatedLessons = lessons.map((l) => {
        if (l.id === lessonId) return { ...l, is_completed: 1, isCompleted: 1 };
        return l;
      });
      setLessons(updatedLessons);

      const currentIndex = updatedLessons.findIndex(l => l.id === lessonId);
      const next = updatedLessons[currentIndex + 1];
      
      setActiveLesson({ ...activeLesson, is_completed: 1 });
      setNextLesson(next || null);
      setShowModal(true);
    } catch (err) {
      alert("Gagal menyimpan progres.");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      <CourseNavbar 
        title={activeLesson?.title} 
        onBack={() => navigate('/dashboard')} 
      />

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <ContentDisplay 
          activeLesson={activeLesson} 
          courseId={courseId}
          onComplete={() => handleComplete(activeLesson.id)}
        />
        
        <CurriculumAccordion 
          lessons={lessons}
          activeLessonId={activeLesson?.id}
          isOpen={showCurriculum}
          toggleOpen={() => setShowCurriculum(!showCurriculum)}
          onSelectLesson={setActiveLesson}
        />
      </main>

      {showModal && (
        <CompletionModal 
          nextLesson={nextLesson}
          onClose={() => setShowModal(false)}
          onContinue={() => {
            if (nextLesson) {
              setActiveLesson(nextLesson);
              setShowModal(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/dashboard');
            }
          }}
        />
      )}
    </div>
  );
}