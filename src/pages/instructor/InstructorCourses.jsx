import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Layers } from 'lucide-react';
import api from '../../api/api';

// Sub-komponen
import CourseCard from './components/CourseCard';
import CurriculumModal from './components/CurriculumModal';

export default function InstructorCourses() {
  const { user } = useAuth();
  const location = useLocation();
  
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/api/instructor/courses/${user.id}`);
        setMyCourses(response.data);

        if (location.state?.openModal && location.state?.targetCourseId) {
          const target = response.data.find(c => String(c.id) === String(location.state.targetCourseId));
          if (target) {
            handleOpenModal(target);
            window.history.replaceState({}, document.title);
          }
        }
      } catch (error) {
        console.error("Gagal memuat kursus:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchCourses();
  }, [user, location.state]);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setShowManageModal(true);
  };

  if (loading && myCourses.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kurikulum Pengajaran</h1>
          <p className="text-slate-500 font-medium">Kelola materi pelatihan dan bank soal secara mandiri.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl text-blue-600 font-bold border border-blue-100 flex items-center gap-2">
          <Layers size={20} /> {myCourses.length} Kursus Aktif
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {myCourses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onManage={() => handleOpenModal(course)} 
          />
        ))}
      </div>

      {showManageModal && (
        <CurriculumModal 
          course={selectedCourse} 
          onClose={() => setShowManageModal(false)} 
        />
      )}
    </div>
  );
}