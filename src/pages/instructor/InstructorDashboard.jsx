import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Loader2, 
  PlusCircle, 
  ArrowRight,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import api from '../../api/api';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgQuizScore: 0,
    activeLessons: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Mengambil data kursus yang diampu instruktur
        const courseRes = await api.get(`/api/instructor/courses/${user.id}`);
        const progressRes = await api.get(`/api/admin/student-progress`);
        
        // Filter progres hanya untuk kursus milik instruktur ini
        const myCourseIds = courseRes.data.map(c => c.id);
        const myStudents = progressRes.data.filter(s => myCourseIds.includes(s.course_id));

        // Menghitung statistik
        const totalScore = myStudents.reduce((acc, curr) => acc + (curr.quiz_score || 0), 0);
        
        setStats({
          totalCourses: courseRes.data.length,
          totalStudents: myStudents.length,
          avgQuizScore: myStudents.length > 0 ? Math.round(totalScore / myStudents.length) : 0,
          activeLessons: 0 // Bisa dikembangkan dengan hitung row di table lessons
        });

        setRecentCourses(courseRes.data.slice(0, 3)); // Ambil 3 kursus terbaru
      } catch (error) {
        console.error("Gagal memuat data dashboard instruktur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Membangun Dashboard Anda...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* GREETING SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Halo, Instruktur {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Panel ini membantu Anda memantau efektivitas materi dan perkembangan akademik siswa secara real-time.
          </p>
        </div>
        <button 
          onClick={() => navigate('/instructor/my-courses')}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition shadow-xl shadow-blue-100"
        >
          <PlusCircle size={20} /> KELOLA KELAS
        </button>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Kursus Diampu', value: stats.totalCourses, icon: <BookOpen />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Siswa', value: stats.totalStudents, icon: <Users />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Rata-rata Kuis', value: `${stats.avgQuizScore}%`, icon: <TrendingUp />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Kelulusan', value: stats.totalStudents > 0 ? 'Aktif' : 'N/A', icon: <Award />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/30">
            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
              {item.icon}
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-3xl font-black text-slate-800">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS & RECENT COURSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kursus Terbaru */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Kursus Terkini</h2>
            <button onClick={() => navigate('/instructor/my-courses')} className="text-blue-600 font-bold text-sm hover:underline">Lihat Semua</button>
          </div>
          
          <div className="grid gap-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-lg hover:border-blue-500 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                    {course.id.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{course.title}</h4>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <PlayCircle size={12} /> Materi: 0
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                        <HelpCircle size={12} /> Bank Soal: Ready
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/instructor/quiz-bank/${course.id}`)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Akses Cepat */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight px-2">Akses Cepat</h2>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-blue-200">
            <p className="text-sm font-medium text-slate-300">Gunakan menu ini untuk melompat langsung ke manajemen akademik.</p>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/instructor/students')}
                className="w-full flex items-center justify-between p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Users size={20} className="text-blue-400" />
                  <span className="font-bold text-sm">Monitoring Siswa</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                onClick={() => navigate('/instructor/my-courses')}
                className="w-full flex items-center justify-between p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <BookOpen size={20} className="text-blue-400" />
                  <span className="font-bold text-sm">Update Kurikulum</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}