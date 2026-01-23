import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
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
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-bold text-slate-500 animate-pulse">Memuat dashboard Anda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kursus Saya</h1>
          <p className="text-slate-500 mt-1">
            Selamat datang kembali, <span className="text-blue-600 font-bold">{user?.name}</span>!
          </p>
        </div>
        
        {myCourses.length > 0 && (
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 group"
          >
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
            Tambah Kursus Baru
          </button>
        )}
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myCourses.length === 0 ? (
          <EmptyState onAction={() => navigate('/')} />
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

      {myCourses.length > 0 && (
        <footer className="mt-12 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center justify-between">
          <p className="text-sm text-blue-700 font-medium px-4">
            Butuh bantuan terkait kursus atau sertifikat? 
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-blue-600 hover:text-white transition">
            Hubungi Admin
          </button>
        </footer>
      )}
    </div>
  );
}