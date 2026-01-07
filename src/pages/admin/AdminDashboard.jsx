import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Users, CreditCard, BookOpen } from 'lucide-react';

export default function AdminDashboard() {
  // Data Mockup untuk Verifikasi Pembayaran (Fase 1)
  const [pendingPayments, setPendingPayments] = useState([
    { id: 1, name: "Budi Santoso", course: "Operator Komputer", amount: "Rp 500.000", status: "Pending", proof: "bukti1.jpg" },
    { id: 2, name: "Siti Aminah", course: "Teknisi HP", amount: "Rp 750.000", status: "Pending", proof: "bukti2.jpg" },
  ]);

  // Data Mockup Progres Siswa (Fase 2 & 3)
  const [studentProgress] = useState([
    { id: 101, name: "Andi", course: "Operator Komputer", progress: 90, lastScore: 85, status: "Lulus" },
    { id: 102, name: "Rina", course: "Operator Komputer", progress: 45, lastScore: 0, status: "Belajar" },
  ]);

  const handleVerify = (id) => {
    // Aksi Sistem: Update status dan kirim notifikasi WhatsApp 
    setPendingPayments(pendingPayments.filter(p => p.id !== id));
    alert("Pembayaran diverifikasi! Akses kursus telah dibuka dan notifikasi WA dikirim.");
  };

  return (
    <div className="space-y-8">
      {/* 1. Ringkasan Statistik (SRS 3.C) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl mr-4"><Users /></div>
          <div><p className="text-sm text-gray-500">Total Siswa</p><h3 className="text-2xl font-bold">128</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-green-100 text-green-600 rounded-xl mr-4"><CreditCard /></div>
          <div><p className="text-sm text-gray-500">Pendapatan</p><h3 className="text-2xl font-bold">Rp 12.5M</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl mr-4"><BookOpen /></div>
          <div><p className="text-sm text-gray-500">Kursus Aktif</p><h3 className="text-2xl font-bold">5</h3></div>
        </div>
      </div>

      {/* 2. Verifikasi Pembayaran Manual (User Flow Fase 1) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-lg">Verifikasi Pembayaran Manual</h2>
          <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
            {pendingPayments.length} Menunggu
          </span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Siswa</th>
              <th className="p-4">Kursus</th>
              <th className="p-4">Nominal</th>
              <th className="p-4">Bukti</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pendingPayments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-sm">{p.course}</td>
                <td className="p-4 text-sm font-bold text-green-600">{p.amount}</td>
                <td className="p-4">
                  <button className="text-blue-600 flex items-center text-sm hover:underline">
                    <Eye size={16} className="mr-1"/> Lihat
                  </button>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleVerify(p.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                    <CheckCircle size={18} />
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Pantau Progres Siswa (SRS 3.A & Fase 2-3) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="font-bold text-lg">Monitoring Progres & Kelulusan</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Nama Siswa</th>
              <th className="p-4">Progres (%)</th>
              <th className="p-4">Skor Kuis</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {studentProgress.map((s) => (
              <tr key={s.id}>
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.progress}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500">{s.progress}% Selesai</span>
                </td>
                <td className="p-4 font-bold">{s.lastScore > 0 ? s.lastScore : '-'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    s.status === 'Lulus' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}