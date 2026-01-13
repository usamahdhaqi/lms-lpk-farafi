import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Users, CreditCard, Search, Loader2, 
  AlertCircle, Mail, BookOpen, RefreshCw, BarChart3, 
  GraduationCap, Award, TrendingUp 
} from 'lucide-react';
import api from '../../api/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' atau 'monitoring'
  const [pendingPayments, setPendingPayments] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ totalPending: 0, totalRevenue: 0, avgProgress: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil data pembayaran dan progres secara paralel
      const [payRes, progRes] = await Promise.all([
        api.get('/api/admin/pending-payments'),
        api.get('/api/admin/student-progress')
      ]);

      setPendingPayments(payRes.data);
      setStudentProgress(progRes.data);
      
      const revenue = payRes.data.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
      const avgProg = progRes.data.length > 0 
        ? progRes.data.reduce((acc, curr) => acc + curr.progress_percentage, 0) / progRes.data.length 
        : 0;

      setStats({
        totalPending: payRes.data.length,
        totalRevenue: revenue,
        avgProgress: Math.round(avgProg)
      });
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (enrollmentId, studentName) => {
    if (!window.confirm(`Setujui akses kursus untuk ${studentName}?`)) return;
    try {
      await api.post(`/api/payments/verify/${enrollmentId}`);
      alert("✅ Verifikasi berhasil!");
      fetchData();
    } catch (error) {
      alert("❌ Gagal memverifikasi.");
    }
  };

  const filteredPayments = pendingPayments.filter(p => 
    p.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProgress = studentProgress.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Statistik Ringkas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
          <p className="text-slate-500 mt-2 font-medium">Manajemen pembayaran dan pemantauan akademik LPK FARAFI.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl shadow-blue-200 flex items-center gap-4">
             <TrendingUp size={24} />
             <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Rata-rata Progres</p>
                <p className="text-xl font-black">{stats.avgProgress}%</p>
             </div>
          </div>
          <button onClick={fetchData} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:bg-slate-50 transition">
            <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[2rem] w-fit">
        <button 
          onClick={() => setActiveTab('payments')}
          className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'payments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Verifikasi Pembayaran ({stats.totalPending})
        </button>
        <button 
          onClick={() => setActiveTab('monitoring')}
          className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'monitoring' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Monitoring Siswa
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama siswa atau pelatihan..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Konten Utama Berdasarkan Tab */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === 'payments' ? (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="p-8">Siswa</th>
                    <th className="p-8">Pelatihan</th>
                    <th className="p-8">Metode & Harga</th>
                    <th className="p-8 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPayments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">{p.student_name[0]}</div>
                          <div>
                            <p className="font-bold text-slate-800">{p.student_name}</p>
                            <p className="text-xs text-slate-400">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 font-medium">{p.course_title}</td>
                      <td className="p-8">
                        <p className="text-sm font-bold text-blue-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">{p.payment_method}</p>
                      </td>
                      <td className="p-8 flex justify-center">
                        <button onClick={() => handleVerify(p.id, p.student_name)} className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-green-600 transition shadow-lg shadow-green-100">SETUJUI</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                  <tr>
                    <th className="p-8">Siswa & Kursus</th>
                    <th className="p-8">Progres Belajar</th>
                    <th className="p-8">Nilai Kuis</th>
                    <th className="p-8">Status Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProgress.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-8">
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-blue-500 font-medium">{p.course_title}</p>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${p.progress_percentage}%` }}></div>
                          </div>
                          <span className="text-xs font-black text-slate-700">{p.progress_percentage}%</span>
                        </div>
                      </td>
                      <td className="p-8">
                        <p className={`text-sm font-black ${p.quiz_score >= 75 ? 'text-green-600' : 'text-slate-400'}`}>
                          {p.quiz_score || 0} / 100
                        </p>
                      </td>
                      <td className="p-8">
                        {p.is_passed ? (
                          <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase">
                            <Award size={14} /> Lulus & Bersertifikat
                          </span>
                        ) : (
                          <span className="text-slate-300 text-[10px] font-black uppercase">Dalam Proses</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}