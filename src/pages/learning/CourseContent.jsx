import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function CourseContent() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/api/courses/${courseId}/lessons?userId=${user.id}`);
        setLessons(res.data);
        setActiveLesson(res.data[0]); // Set materi pertama sebagai default
      } catch (err) { console.error(err); }
    };
    if (user) fetchLessons();
  }, [courseId, user]);

  const handleComplete = async (lessonId) => {
    try {
      await api.post('/api/progress/complete', { userId: user.id, lessonId });
      
      // Update UI: Buka materi selanjutnya secara lokal
      const updated = lessons.map((l, i) => {
        if (l.id === lessonId) return { ...l, isCompleted: 1 };
        return l;
      });
      setLessons(updated);
      alert("Progres disimpan!");
    } catch (err) { alert("Gagal simpan progres"); }
  };

  if (lessons.length === 0) return <div className="p-10 text-center">Memuat materi...</div>;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Materi */}
      <div className="w-80 border-r overflow-y-auto p-4 bg-slate-50">
        <h2 className="font-bold mb-6 text-blue-700">Kurikulum Pelatihan</h2>
        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            // Logika Sequential: Materi terbuka jika materi sebelumnya selesai
            const isOpen = index === 0 || lessons[index - 1].isCompleted === 1;
            return (
              <button
                key={lesson.id}
                disabled={!isOpen}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full p-4 text-left rounded-2xl text-sm font-medium transition-all ${
                  activeLesson?.id === lesson.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border'
                } ${!isOpen ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-blue-500'}`}
              >
                <div className="flex items-center gap-3">
                  {lesson.isCompleted ? '✅' : (isOpen ? '▶️' : '🔒')}
                  <span className="line-clamp-1">{lesson.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 overflow-y-auto">
        {activeLesson && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-slate-800">{activeLesson.title}</h1>
            
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden mb-8 border border-slate-100">
                {activeLesson.type === 'video' ? (
                <div className="aspect-video">
                    <iframe width="100%" height="100%" src={activeLesson.content_url} frameBorder="0" allowFullScreen></iframe>
                </div>
                ) : activeLesson.type === 'pdf' ? (
                <div className="p-20 text-center">
                    <p className="mb-4 font-bold text-slate-500">Materi PDF tersedia untuk dipelajari.</p>
                    <a href={activeLesson.content_url} target="_blank" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Buka Modul PDF</a>
                </div>
                ) : (
                <div className="p-20 text-center">
                    <p className="mb-6 font-bold text-slate-500">Ujian Akhir untuk mendapatkan sertifikat.</p>
                    <button onClick={() => window.location.href=`/dashboard/course/${courseId}/quiz`} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold">Mulai Ujian Akhir</button>
                </div>
                )}
            </div>

            {activeLesson.type !== 'quiz' && (
              <button 
                onClick={() => handleComplete(activeLesson.id)}
                className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                Tandai Selesai & Lanjut
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}