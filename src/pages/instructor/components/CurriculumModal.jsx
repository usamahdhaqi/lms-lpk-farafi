import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, HelpCircle, ChevronRight, Award, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import LessonForm from './LessonForm';
import LessonList from './LessonList';
import QuizModal from './QuizModal';

export default function CurriculumModal({ course, onClose }) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);

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
          <div className="flex items-center gap-4">

            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Manajemen Kurikulum</h2>
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-wider mt-1">{course?.title}</p>
            </div>
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
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Daftar Materi Dinamis dari Database */}
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

            {/* ITEM OTOMATIS: UJIAN AKHIR */}
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-[2.5rem] flex items-center justify-between group shadow-sm mt-8">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500 text-white shadow-lg shadow-amber-200">
                  <Award size={24} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg uppercase tracking-tight">Ujian Akhir Sertifikasi</p>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-amber-200 text-amber-600 bg-white">
                    Sistem Otomatis
                  </span>
                </div>
              </div>

              {/* Tombol Edit ini akan membuka Bank Soal */}
              <button 
                onClick={() => setShowQuizModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-amber-600 border border-amber-200 rounded-2xl font-black text-xs hover:bg-amber-500 hover:text-white transition-all shadow-sm"
              >
                <Edit2 size={16} /> KELOLA SOAL KUIS
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Total: {lessons.length} Materi</span>
          <span>Instruktur: {course?.instructor_name || 'Anda'}</span>
        </div>
      </div>

      {/* Render QuizModal jika aktif */}
      {showQuizModal && (
        <QuizModal 
          course={course} 
          onClose={() => setShowQuizModal(false)} 
        />
      )}

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