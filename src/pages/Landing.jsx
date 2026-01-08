import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const courses = [
  { id: 'comp-001', title: 'Pelatihan Operator Komputer Dasar', price: 'Rp 500.000', img: '/img/komputer.jpg' },
  { id: 'hp-001', title: 'Teknisi Handphone', price: 'Rp 750.000', img: '/img/hp.jpg' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Ambil status login dari context

  const handleCourseSelection = (courseId) => {
    if (!user) {
      // Jika belum login, arahkan ke login dengan membawa informasi kursus yang dipilih
      // Gunakan state agar setelah login bisa kembali ke kursus ini
      navigate('/login', { state: { selectedCourse: courseId } });
    } else {
      // Jika sudah login, langsung arahkan ke halaman pendaftaran/pembayaran kursus tersebut
      navigate('/register', { state: { courseId: courseId } });
    }
  };

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

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-blue-500 transition-all duration-300">
              <div className="h-48 bg-slate-200 rounded-[1.5rem] mb-6 overflow-hidden">
                {/* Image Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold italic">Cover Pelatihan</div>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">{course.title}</h3>
              <p className="text-blue-600 font-black text-2xl mb-6">{course.price}</p>
              
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