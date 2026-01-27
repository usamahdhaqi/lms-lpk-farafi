import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2, BookOpen, Award, Zap, MessageSquare } from 'lucide-react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { CourseCard } from './components/CourseCard';
import { EmptyState } from './components/EmptyState';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get(`/api/enrollments/user/${user.id}`);
        setMyCourses(response.data);
      } catch (error) {
        console.error("Gagal memuat kursus:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black text-slate-300 uppercase tracking-[0.3em] text-[10px]">Menyiapkan Ruang Belajar...</p>
      </div>
    );
  }

  const completedCourses = myCourses.filter(c => c.progress_percentage === 100).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 lg:space-y-12 pb-20 px-4 animate-in fade-in duration-700 mt-4">
      
      {/* 1. Welcoming Header & Stats Bento */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
        <div className="lg:col-span-7 space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-2">
            <Zap size={14} className="fill-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Student Hub</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
            Dashboard <span className="text-blue-600">Siswa</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Selamat belajar kembali, <span className="text-slate-900 font-black">{user?.name}</span>!
          </p>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
            <BookOpen className="text-blue-600 mb-2" size={24} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kursus Aktif</p>
            <p className="text-2xl font-black text-slate-800">{myCourses.length}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl">
            <Award className="text-emerald-400 mb-2" size={24} />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sertifikat</p>
            <p className="text-2xl font-black text-white">{completedCourses}</p>
          </div>
        </div>
      </header>

      {/* 2. Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-white shadow-lg">
        <h2 className="px-6 text-sm font-black text-slate-800 uppercase italic tracking-widest">
          Pelatihan Anda
        </h2>
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-black text-xs shadow-lg hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest"
        >
          <PlusCircle size={18} />
          Cari Kursus Baru
        </button>
      </div>

      {/* 3. Course Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {myCourses.length === 0 ? (
          <div className="col-span-full">
            <EmptyState onAction={() => navigate('/')} />
          </div>
        ) : (
          myCourses.map((item) => (
            <CourseCard 
              key={item.id} 
              item={item} 
              onNavigate={(id) => navigate(`/dashboard/course/${id}`)} 
            />
          ))
        )}
      </main>

      {/* 4. Support Footer Card */}
      {myCourses.length > 0 && (
        <footer className="group relative overflow-hidden mt-12 p-8 lg:p-12 bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-700"></div>
          
          <div className="relative z-10 text-center lg:text-left space-y-2">
            <h3 className="text-white text-2xl font-black uppercase italic tracking-tight">Butuh Bantuan?</h3>
            <p className="text-slate-400 text-sm font-medium max-w-md">
              Tim admin LPK Farafi siap membantu kendala teknis, akses materi, hingga penerbitan sertifikat Anda.
            </p>
          </div>
          
          <button className="relative z-10 flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-xs shadow-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 uppercase tracking-widest">
            <MessageSquare size={18} />
            Hubungi Admin
          </button>
        </footer>
      )}
    </div>
  );
}