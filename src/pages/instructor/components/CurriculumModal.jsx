import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import api from '../../../api/api';
import LessonForm from './LessonForm';
import LessonList from './LessonList';

export default function CurriculumModal({ course, onClose }) {
  // State untuk menyimpan data materi
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // Fungsi untuk mengambil data materi dari server
  const fetchLessons = async () => {
    if (!course?.id) return;
    try {
      setLoading(true);
      const response = await api.get(`/api/instructor/courses/${course.id}/lessons`);
      // Pastikan data yang di-set adalah array
      setLessons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Gagal mengambil materi:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat komponen pertama kali dimuat atau course berubah
  useEffect(() => {
    fetchLessons();
  }, [course?.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden h-[90vh] flex flex-col animate-in zoom-in duration-300">
        
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Kurikulum</h2>
            <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">{course?.title}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            >
              <Plus size={20} /> TAMBAH MATERI
            </button>
            <button 
              onClick={onClose} 
              className="p-4 bg-white text-slate-400 rounded-2xl shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Memuat Materi...</p>
            </div>
          ) : lessons.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <LessonList 
                lessons={lessons} 
                setLessons={setLessons} 
                fetchLessons={fetchLessons} 
                courseId={course.id} 
                onEdit={(lesson) => {
                  setEditingLesson(lesson);
                  setShowAddModal(true);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
              <p className="text-slate-400 font-bold">Belum ada materi dalam kursus ini.</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-blue-600 font-black text-sm uppercase hover:underline"
              >
                Mulai buat materi pertama
              </button>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Total: {lessons.length} Materi</span>
          <span>Instruktur: {course?.instructor_name || 'Anda'}</span>
        </div>
      </div>

      {showAddModal && (
        <LessonForm 
          courseId={course.id} 
          editData={editingLesson}
          onClose={() => {
            setShowAddModal(false);
            setEditingLesson(null);
          }}
          onLessonAdded={() => {
            fetchLessons();
            setShowAddModal(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}