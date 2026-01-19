import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlayCircle, 
  PlusCircle, 
  ArrowRight, 
  Loader2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Award
} from 'lucide-react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data kursus milik siswa dari Database
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Backend sudah menghitung persentase di tabel enrollments
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Kursus Saya</h1>
          <p className="text-slate-500 mt-1">
            Selamat datang kembali, <span className="text-blue-600 font-bold">{user?.name}</span>!
          </p>
        </div>
        
        {/* Tombol Muncul hanya jika sudah punya kursus */}
        {myCourses.length > 0 && (
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 group"
          >
            <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
            Tambah Kursus Baru
          </button>
        )}
      </div>

      {/* Grid Kursus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Card Ambil Pelatihan Muncul hanya jika belum ada kursus sama sekali */}
        {myCourses.length === 0 && (
          <div 
            onClick={() => navigate('/')}
            className="group cursor-pointer bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 min-h-[350px]"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <PlusCircle size={32} />
            </div>
            <h3 className="font-black text-xl text-slate-800">Ambil Pelatihan</h3>
            <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed">
              Anda belum memiliki kursus aktif. Pilih pelatihan untuk memulai belajar dan dapatkan sertifikat.
            </p>
            <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-full">
              Lihat Katalog <ArrowRight size={16} />
            </div>
          </div>
        )}

        {/* LIST KURSUS DARI DATABASE */}
        {myCourses.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group transition-all hover:-translate-y-2">
            <div className="h-40 bg-slate-900 p-8 flex items-end relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  item.payment_status === 'paid' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-amber-500 text-white animate-pulse'
                }`}>
                  {item.payment_status === 'paid' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                  {item.payment_status === 'paid' ? 'Aktif' : 'Menunggu Verifikasi'}
                </span>
              </div>
              
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                <PlayCircle size={32} />
              </div>
            </div>

            <div className="p-8">
              <h3 className="font-black text-xl text-slate-800 mb-1 line-clamp-2 leading-tight min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 mb-8 font-medium italic">
                Instruktur: <span className="text-slate-600">{item.instructor_name || 'Tim LPK Farafi'}</span>
              </p>
              
              {item.payment_status === 'paid' ? (
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Progres Belajar</span>
                    <span className="text-blue-600">{item.progress_percentage || 0}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
                      style={{ width: `${item.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                  {item.progress_percentage === 100 && (
                    <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-2">
                      <Award size={12} /> Selamat! Anda telah menyelesaikan materi.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle size={20} className="text-amber-500 shrink-0" />
                  <p className="text-[11px] text-amber-700 leading-relaxed italic">
                    Pembayaran Anda sedang diverifikasi. Akses materi akan terbuka otomatis setelah disetujui Admin.
                  </p>
                </div>
              )}

              {/* Tombol Aksi Dinamis */}
              <button 
                disabled={item.payment_status !== 'paid'}
                onClick={() => navigate(`/dashboard/course/${item.course_id}`)}
                className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg ${
                  item.payment_status === 'paid'
                  ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                }`}
              >
                {item.payment_status === 'paid' 
                  ? (item.progress_percentage === 100 ? 'ULANGI MATERI' : 'LANJUTKAN BELAJAR') 
                  : 'AKSES TERKUNCI'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer bantuan jika user bingung */}
      {myCourses.length > 0 && (
        <div className="mt-12 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center justify-between">
          <p className="text-sm text-blue-700 font-medium px-4">
            Butuh bantuan terkait kursus atau sertifikat? 
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold text-xs shadow-sm hover:bg-blue-600 hover:text-white transition">
            Hubungi Admin
          </button>
        </div>
      )}
    </div>
  );
}