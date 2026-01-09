import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Users, 
  CreditCard, 
  Search, 
  Loader2, 
  AlertCircle,
  Mail,
  BookOpen
} from 'lucide-react';
import api from '../../api/api';

export default function AdminDashboard() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Ambil data pendaftaran pending dari Database
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/pending-payments');
      setPendingPayments(response.data);
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fungsi Verifikasi Pembayaran
  const handleVerify = async (enrollmentId, studentName) => {
    if (!window.confirm(`Setujui pembayaran untuk ${studentName}?`)) return;

    try {
      // Memanggil endpoint verifikasi yang sudah kita buat di index.js
      await api.post(`/api/payments/verify/${enrollmentId}`);
      
      // Update UI secara lokal agar data yang sudah diverifikasi hilang dari list
      setPendingPayments(prev => prev.filter(p => p.id !== enrollmentId));
      alert("✅ Verifikasi berhasil! Notifikasi WA telah dikirim ke siswa.");
    } catch (error) {
      alert("❌ Gagal memverifikasi. Silakan coba lagi.");
    }
  };

  // Filter pencarian berdasarkan nama atau kursus
  const filteredData = pendingPayments.filter(p => 
    p.student_name.toLowerCase().includes(filter.toLowerCase()) || 
    p.course_title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 p-2 md:p-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Kelola verifikasi pembayaran dan pendaftaran siswa.</p>
        </div>
        
        {/* Ringkasan Statistik */}
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-xl font-black text-slate-800">{pendingPayments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={24} />
            Menunggu Persetujuan
          </h3>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari siswa atau kursus..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="font-bold text-slate-400">Sinkronisasi data database...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-black">
                  <th className="p-6">Data Siswa</th>
                  <th className="p-6">Kursus & Metode</th>
                  <th className="p-6">Tagihan</th>
                  <th className="p-6 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm">
                          {item.student_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.student_name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail size={12} /> {item.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <BookOpen size={14} className="text-blue-500" />
                        {item.course_title}
                      </p>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase mt-1 inline-block">
                        {item.payment_method}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-blue-600 italic">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleVerify(item.id, item.student_name)}
                          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-green-600 hover:scale-105 transition-all shadow-lg shadow-green-100"
                        >
                          <CheckCircle size={16} />
                          SETUJUI
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Semua Beres!</p>
              <p className="text-slate-500 text-sm mt-1">Tidak ada pembayaran yang perlu diverifikasi saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}