import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Users, Award, BarChart, Loader2, ChevronRight } from 'lucide-react';
import api from '../../api/api';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const res = await api.get(`/api/instructor/courses/${user.id}`);
        setCourses(res.data);
      } catch (err) {
        console.error("Gagal memuat data instruktur");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorData();
  }, [user]);

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Menyiapkan Ruang Instruktur...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel Instruktur</h1>
        <p className="text-slate-500 font-medium">Selamat datang, {user.name}. Kelola materi dan pantau progres siswa Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl"><BookOpen /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kursus Aktif</p>
            <h3 className="text-2xl font-black">{courses.length}</h3>
          </div>
        </div>
        {/* Statistik tambahan bisa ditaruh di sini */}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 font-black text-slate-800 uppercase tracking-tight text-sm flex items-center gap-2">
          <BarChart size={18} className="text-blue-600" /> Daftar Pelatihan yang Diampu
        </div>
        <div className="divide-y divide-slate-50">
          {courses.map(course => (
            <div key={course.id} className="p-8 flex flex-col md:flex-row justify-between items-center hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black group-hover:bg-blue-600 transition-colors">
                  {course.id.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-xl">{course.title}</h3>
                  <p className="text-sm text-slate-400 font-medium italic">ID: {course.id}</p>
                </div>
              </div>
              <button 
                className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                onClick={() => alert(`Fitur kelola siswa kursus ${course.id} segera hadir`)}
              >
                Kelola Siswa <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}