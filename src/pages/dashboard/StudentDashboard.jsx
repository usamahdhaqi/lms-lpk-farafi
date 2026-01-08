import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

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
        console.error("Gagal memuat kursus saya:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyCourses();
  }, [user]);

  if (loading) return <div className="p-8 font-bold">Memuat data belajar...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Kursus Saya</h1>
        <p className="text-slate-500">Lanjutkan progres belajar Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCourses.length > 0 ? myCourses.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col group">
            <div className="h-40 bg-blue-600 p-8 flex items-end">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                <PlayCircle size={32} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-black text-xl text-slate-800 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-400 mb-6 font-medium">Instruktur: {item.instructor}</p>
              
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Progres Belajar</span>
                  <span>{item.progress_percentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${item.progress_percentage}%` }}></div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/dashboard/course/${item.course_id}`)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg shadow-slate-200"
              >
                {item.progress_percentage === 100 ? 'Lihat Materi Kembali' : 'Lanjutkan Materi'}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-20 text-center border-2 border-dashed rounded-[3rem] text-slate-400">
            Anda belum memiliki kursus aktif.
          </div>
        )}
      </div>
    </div>
  );
}