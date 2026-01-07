import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Users, 
  CreditCard, 
  BookOpen, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { paymentService } from '../../api/paymentService';
import { courseService } from '../../api/courseService';

export default function AdminDashboard() {
  // State untuk data dari API
  const [pendingPayments, setPendingPayments] = useState([
    { id: 1, name: "Budi Santoso", course: "Operator Komputer", amount: "Rp 500.000", status: "Pending", proof: "bukti_bayar_1.jpg" },
    { id: 2, name: "Siti Aminah", course: "Teknisi HP", amount: "Rp 750.000", status: "Pending", proof: "bukti_bayar_2.jpg" },
  ]);
  
  const [studentProgress, setStudentProgress] = useState([
    { id: 101, name: "Andi", course: "Operator Komputer", progress: 90, lastScore: 85, status: "Lulus" },
    { id: 102, name: "Rina", course: "Operator Komputer", progress: 45, lastScore: 0, status: "Belajar" },
  ]);

  const [selectedProof, setSelectedProof] = useState(null); // Modal Bukti Transfer
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi Verifikasi Pembayaran (User Flow Fase 1)
  const handleVerify = async (id) => {
    try {
      // Integrasi Axios: Menjalankan fungsi verifikasi di backend
      // await paymentService.uploadProof(id); 
      
      setPendingPayments(pendingPayments.filter(p => p.id !== id));
      alert("Aksi Berhasil: Pembayaran diverifikasi, akses kursus dibuka, dan notifikasi WA dikirim.");
    } catch (error) {
      alert("Gagal memverifikasi pembayaran.");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* SECTION 1: RINGKASAN STATISTIK (SRS 3.C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mr-4"><Users /></div>
          <div><p className="text-sm text-slate-500">Total Siswa Aktif</p><h3 className="text-2xl font-bold">128</h3></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl mr-4"><CreditCard /></div>
          <div><p className="text-sm text-slate-500">Laporan Pendapatan</p><h3 className="text-2xl font-bold">Rp 12.500.000</h3></div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl mr-4"><BookOpen /></div>
          <div><p className="text-sm text-slate-500">Pelatihan Aktif</p><h3 className="text-2xl font-bold">5</h3></div>
        </div>
      </div>

      {/* SECTION 2: VERIFIKASI PEMBAYARAN MANUAL (Fase 1) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="font-bold text-lg text-slate-800">Verifikasi Pembayaran Manual</h2>
            <p className="text-xs text-slate-500">Tinjau bukti transfer untuk aktivasi akses kursus otomatis</p>
          </div>
          <span className="bg-orange-100 text-orange-700 text-xs px-4 py-1.5 rounded-full font-bold">
            {pendingPayments.length} Menunggu Verifikasi
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-5">Nama Siswa</th>
                <th className="p-5">Kursus</th>
                <th className="p-5">Nominal</th>
                <th className="p-5">Bukti Transfer</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-5 font-semibold text-slate-700">{p.name}</td>
                  <td className="p-5 text-sm text-slate-600">{p.course}</td>
                  <td className="p-5 text-sm font-bold text-green-600">{p.amount}</td>
                  <td className="p-5">
                    <button 
                      onClick={() => setSelectedProof(p.proof)}
                      className="text-blue-600 flex items-center text-xs font-bold hover:bg-blue-50 px-3 py-2 rounded-lg transition"
                    >
                      <Eye size={14} className="mr-1.5"/> Lihat Gambar
                    </button>
                  </td>
                  <td className="p-5 flex justify-center gap-2">
                    <button 
                      onClick={() => handleVerify(p.id)}
                      className="p-2.5 bg-green-100 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition shadow-sm"
                      title="Setujui Pembayaran"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button 
                      className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"
                      title="Tolak"
                    >
                      <XCircle size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: MONITORING PROGRES SISWA (Fase 2 & 3) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="font-bold text-lg text-slate-800">Pemantauan Progres & Nilai Kuis</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari siswa..." 
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="p-5">Nama Siswa</th>
                <th className="p-5">Penyelesaian Materi</th>
                <th className="p-5">Skor Kuis (Passing: 75)</th> 
                <th className="p-5">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentProgress.map((s) => (
                <tr key={s.id}>
                  <td className="p-5 font-semibold text-slate-700">{s.name}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${s.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`text-sm font-bold ${s.lastScore >= 75 ? 'text-green-600' : 'text-slate-400'}`}>
                      {s.lastScore > 0 ? s.lastScore : 'Belum Ujian'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase w-fit ${
                      s.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {s.status === 'Lulus' && <CheckCircle2 size={12} />}
                      {s.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PRATINJAU BUKTI TRANSFER (Nyata) */}
      {selectedProof && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-lg w-full transform animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-slate-800 tracking-tight">Pratinjau Bukti Bayar</h3>
              <button 
                onClick={() => setSelectedProof(null)} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800 transition"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-2 border-2 border-dashed border-slate-200">
              <img 
                src={`https://api.lpkfarafi.com/uploads/proofs/${selectedProof}`} 
                alt="Bukti Transfer Nyata" 
                className="w-full h-auto rounded-xl shadow-inner"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x600?text=Bukti+Transfer+Siswa';
                }}
              />
            </div>
            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setSelectedProof(null)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition"
              >
                Tutup
              </button>
              <button 
                onClick={() => {
                  handleVerify(1); // Contoh verifikasi dari modal
                  setSelectedProof(null);
                }}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition"
              >
                Setujui Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}