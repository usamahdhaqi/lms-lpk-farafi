import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil Katalog Kursus dari Database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses'); // Endpoint backend
        setCourses(response.data);
      } catch (error) {
        console.error("Gagal memuat kursus:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseSelection = (courseId) => {
    if (!user) {
      navigate('/login', { state: { selectedCourse: courseId } });
    } else {
      navigate('/register', { state: { courseId: courseId } });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Memuat Katalog LPK Farafi...</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <nav className="p-6 bg-white shadow-sm flex justify-between items-center border-b border-slate-100">
        <h1 className="text-2xl font-black text-blue-700 tracking-tighter">LPK FARAFI</h1>
        <div className="flex gap-4">
          {!user ? (
            <>
              <button onClick={() => navigate('/login')} className="text-slate-600 font-semibold hover:text-blue-600">Masuk</button>
              <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100">Daftar</button>
            </>
          ) : (
            <button onClick={() => navigate('/dashboard')} className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-bold border border-blue-100">Dashboard</button>
          )}
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto p-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-800 mb-4">Pilih Program Pelatihan</h2>
          <p className="text-slate-500">Mulai langkah karir profesional Anda bersama LPK Farafi.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-blue-500 transition-all duration-300">
              <div className="h-48 bg-slate-200 rounded-[1.5rem] mb-6 overflow-hidden flex items-center justify-center text-slate-400 font-bold italic">
                {/* Visual Placeholder */}
                Image Pelatihan
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
              <p className="text-blue-600 font-black text-2xl mb-6">
                Rp {Number(course.price).toLocaleString('id-ID')}
              </p>
              
              <button 
                onClick={() => handleCourseSelection(course.id)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg shadow-slate-200 group-hover:shadow-blue-200"
              >
                Ikuti Pelatihan Sekarang
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}