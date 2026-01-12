import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Users, 
  CreditCard, 
  Search, 
  Loader2, 
  AlertCircle,
  Mail,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import api from '../../api/api';

export default function AdminDashboard() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ totalPending: 0, totalRevenue: 0 });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/pending-payments');
      setPendingPayments(response.data);
      
      // Hitung statistik sederhana dari data yang diterima
      const revenue = response.data.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
      setStats({
        totalPending: response.data.length,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error("Gagal memuat pembayaran:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (enrollmentId, studentName) => {
    if (!window.confirm(`Setujui akses kursus untuk ${studentName}?`)) return;

    try {
      await api.post(`/api/payments/verify/${enrollmentId}`);
      alert("✅ Verifikasi berhasil! Akses kursus telah dibuka.");
      fetchPayments(); // Refresh data otomatis
    } catch (error) {
      alert("❌ Gagal memverifikasi pembayaran.");
    }
  };

  // Filter pencarian
  const filteredPayments = pendingPayments.filter(p => 
    p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Verifikasi pembayaran manual dan kelola pendaftaran siswa.</p>
        </div>
        <button 
          onClick={fetchPayments}
          className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Segarkan Data
        </button>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menunggu Verifikasi</p>
            <h3 className="text-3xl font-black text-slate-800">{stats.totalPending} Pesanan</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Potensi Pendapatan</p>
            <h3 className="text-3xl font-black text-slate-800">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
          </div>
        </div>
      </div>

      {/* Tabel Utama */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <h2 className="font-black text-xl text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={24} /> Antrian Pembayaran
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama siswa atau kursus..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin text-blue-600 mx-auto" size={40} />
              <p className="mt-4 font-bold text-slate-400">Menghubungkan ke database...</p>
            </div>
          ) : filteredPayments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-[0.2em] font-black">
                  <th className="p-6">Data Siswa</th>
                  <th className="p-6">Kursus & Metode</th>
                  <th className="p-6">Nominal</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black">
                          {p.student_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.student_name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-slate-700">{p.course_title}</p>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase mt-1 inline-block border border-slate-200">
                        {p.payment_method}
                      </span>
                    </td>
                    <td className="p-6 font-black text-blue-600">
                      Rp {Number(p.price || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleVerify(p.id, p.student_name)}
                          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-black text-xs hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-100"
                        >
                          <CheckCircle size={16} /> VERIFIKASI
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Semua Beres</p>
              <p className="text-slate-500 text-sm mt-1">Tidak ada pembayaran yang perlu diverifikasi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}