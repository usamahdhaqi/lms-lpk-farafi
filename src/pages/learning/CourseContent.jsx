import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, PlayCircle, FileText } from 'lucide-react';

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Data Mockup (Nantinya diambil dari API sesuai Fase 2) [cite: 17, 18]
  const [lessons, setLessons] = useState([
    { id: 1, title: 'Pengenalan Dasar', type: 'video', duration: '10:00', isCompleted: true, isOpen: true },
    { id: 2, title: 'Instalasi Software', type: 'video', duration: '15:00', isCompleted: false, isOpen: true },
    { id: 3, title: 'Konfigurasi Sistem', type: 'pdf', isCompleted: false, isOpen: false },
    { id: 4, title: 'Ujian Akhir Kursus', type: 'quiz', isCompleted: false, isOpen: false },
  ]);

  const [activeLesson, setActiveLesson] = useState(lessons[1]);

  // Fungsi untuk menandai materi SELESAI (Fase 2: Sistem menandai materi "Selesai") [cite: 20]
  const completeLesson = (id) => {
    const updatedLessons = lessons.map((lesson, index) => {
      if (lesson.id === id) {
        return { ...lesson, isCompleted: true };
      }
      // Membuka materi berikutnya (Sequential Learning) [cite: 21, 53]
      if (index > 0 && lessons[index - 1].id === id) {
        return { ...lesson, isOpen: true };
      }
      return lesson;
    });
    setLessons(updatedLessons);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      {/* KONTEN UTAMA (Video/PDF Player) [cite: 54] */}
      <div className="flex-1 p-6 overflow-y-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 mb-4 hover:text-blue-600 transition"
        >
          ← Kembali ke Dashboard
        </button>
        
        <div className="aspect-video bg-black rounded-2xl mb-6 flex items-center justify-center text-white">
          {activeLesson.type === 'video' ? (
            <p>Video Player: {activeLesson.title} (Proteksi klik kanan aktif) </p>
          ) : (
            <p>PDF Viewer: {activeLesson.title} [cite: 54]</p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{activeLesson.title}</h1>
          {!activeLesson.isCompleted && (
            <button 
              onClick={() => completeLesson(activeLesson.id)}
              className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700"
            >
              Tandai Selesai
            </button>
          )}
        </div>
        
        {/* Kolom Diskusi (Fase 2: Kolom Komentar) [cite: 22] */}
        <div className="mt-10 border-t pt-6">
          <h3 className="font-bold mb-4">Diskusi & Pertanyaan</h3>
          <textarea className="w-full p-4 border rounded-xl" placeholder="Ada kendala? Tanya instruktur di sini..." />
        </div>
      </div>

      {/* SIDEBAR DAFTAR MATERI (Bab 1 - N) [cite: 18, 52] */}
      <div className="w-full lg:w-80 border-l bg-gray-50 p-6 overflow-y-auto">
        <h2 className="font-bold text-lg mb-6">Materi Kursus</h2>
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              disabled={!lesson.isOpen}
              onClick={() => setActiveLesson(lesson)}
              className={`w-full flex items-center p-4 rounded-xl text-left transition ${
                activeLesson.id === lesson.id ? 'bg-blue-100 border-blue-200' : 'bg-white'
              } ${!lesson.isOpen ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className="mr-3">
                {!lesson.isOpen ? (
                  <Lock size={18} className="text-gray-400" />
                ) : lesson.isCompleted ? (
                  <CheckCircle size={18} className="text-green-600" />
                ) : (
                  <PlayCircle size={18} className="text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${!lesson.isOpen ? 'text-gray-400' : 'text-gray-800'}`}>
                  {lesson.title}
                </p>
                <span className="text-xs text-gray-500">{lesson.type.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tombol Ujian Akhir (Fase 3) */}
        {lessons.every(l => l.isCompleted || l.type === 'quiz') && (
          <button 
            onClick={() => navigate(`/dashboard/course/${courseId}/quiz`)}
            className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
          >
            Mulai Ujian Akhir
          </button>
        )}
      </div>
    </div>
  );
}