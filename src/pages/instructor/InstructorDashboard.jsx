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
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import api from '../../api/api';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // State untuk data dinamis
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    avgQuizScore: 0,
    passingRate: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Ambil data kursus terlebih dahulu
        const courseRes = await api.get(`/api/instructor/courses/${user.id}`);
        const myCourses = courseRes.data; // Pastikan data ini masuk ke variabel

        // 2. Ambil data progres siswa
        const progressRes = await api.get(`/api/admin/student-progress`);
        const allStudentProgress = progressRes.data;

        // 3. DEFINISIKAN myCourseIds SEBELUM DIGUNAKAN UNTUK FILTER
        // Ini adalah bagian yang menyebabkan error sebelumnya
        const myCourseIds = myCourses.map(c => String(c.id));

        const myStudents = allStudentProgress.filter(s => 
        myCourseIds.includes(String(s.course_id))
        );

        console.log("Siswa yang ditemukan:", myStudents.length);

        const totalStudents = myStudents.length;
        // Gunakan Number() untuk mengantisipasi data string dari database
        const totalScore = myStudents.reduce((acc, curr) => acc + (Number(curr.quiz_score) || 0), 0);
        const passedStudents = myStudents.filter(s => Number(s.is_passed) === 1).length;

        setStats({
        totalCourses: myCourses.length,
        totalStudents: totalStudents,
        avgQuizScore: totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0,
        passingRate: totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0
        });

        setRecentCourses(myCourses.slice(0, 3));

        } catch (error) {
            console.error("Gagal memuat data dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    if (user?.id) fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs tracking-tighter">Mensinkronkan Data Akademik...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* GREETING SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Semangat Mengajar, {user?.name.split(' ')[0]}! 🚀
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            Hari ini ada <span className="text-blue-600 font-bold">{stats.totalStudents} siswa</span> yang terdaftar di kelas Anda. Mari pantau perkembangan mereka.
          </p>
        </div>
        <button 
          onClick={() => navigate('/instructor/my-courses')}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition shadow-xl shadow-blue-100"
        >
          <PlusCircle size={20} /> KELOLA KELAS
        </button>
      </div>

      {/* STATS GRID - DATA ASLI DARI DATABASE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Kursus Aktif', value: stats.totalCourses, icon: <BookOpen />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Siswa', value: stats.totalStudents, icon: <Users />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Rata-rata Kuis', value: `${stats.avgQuizScore}%`, icon: <TrendingUp />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Tingkat Kelulusan', value: `${stats.passingRate}%`, icon: <Award />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/30">
            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
              {item.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-3xl font-black text-slate-800">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT COURSES LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight text-xl italic uppercase tracking-tighter">Kelas Yang Anda Ampu</h2>
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
                    <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{course.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {course.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate('/instructor/students', { state: { filterCourse: course.title } })}
                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Monitor Siswa di Kelas Ini"
                  >
                    <Users size={18} />
                  </button>
                  <button 
                    onClick={() => navigate('/instructor/my-courses', { 
                        state: { 
                        openModal: true, 
                        targetCourseId: course.id 
                        } 
                    })}
                    className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                    title="Kelola Kurikulum"
                    >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACCESS ACTIONS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight px-2 italic uppercase tracking-tighter">Akses Cepat</h2>
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/instructor/students')}
                className="w-full flex items-center justify-between p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-green-400" />
                  <span className="font-bold text-sm">Monitoring Siswa</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              
              <button 
                onClick={() => navigate('/instructor/my-courses')}
                className="w-full flex items-center justify-between p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <PlayCircle size={20} className="text-blue-400" />
                  <span className="font-bold text-sm">Update Materi</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}