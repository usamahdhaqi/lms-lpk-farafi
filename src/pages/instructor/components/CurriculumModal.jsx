import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react'; // Tambah icon Plus
import api from '../../../api/api';
import LessonForm from './LessonForm';
import LessonList from './LessonList';

export default function CurriculumModal({ course, onClose }) {
  const [lessons, setLessons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false); // State baru untuk modal form

  const fetchLessons = async () => {
    try {
      const response = await api.get(`/api/instructor/courses/${course.id}/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error("Gagal mengambil materi");
    }
  };

  useEffect(() => {
    if (course) fetchLessons();
  }, [course]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay Utama */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in duration-300">
        {/* Header Modal */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Manajemen Materi</h2>
            <p className="text-blue-600 text-sm font-bold uppercase">{course?.title}</p>
          </div>
          <div className="flex gap-3">
            {/* Tombol Tambah Materi Baru */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={20} /> TAMBAH MATERI
            </button>
            <button onClick={onClose} className="p-3 bg-white text-slate-400 rounded-2xl shadow-sm border border-slate-100">
              <X />
            </button>
          </div>
        </div>

        {/* List Kurikulum (Full Width) */}
        <div className="flex-1 overflow-y-auto p-8">
          <LessonList 
            lessons={lessons} 
            setLessons={setLessons} 
            fetchLessons={fetchLessons} 
            courseId={course.id} 
          />
        </div>
      </div>

      {/* Modal Form Terpisah */}
      {showAddModal && (
        <LessonForm 
          courseId={course.id} 
          onClose={() => setShowAddModal(false)} 
          onLessonAdded={() => {
            fetchLessons();
            setShowAddModal(false);
          }} 
        />
      )}
    </div>
  );
}