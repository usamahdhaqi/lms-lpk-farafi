import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Users, CreditCard, Search } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('payments');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Admin Panel</h1>
        <p className="text-slate-500">Kelola pendaftaran dan pantau progres siswa LPK Farafi.</p>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-600 w-fit rounded-2xl mb-4"><Users /></div>
          <p className="text-slate-500 text-sm font-bold">Total Siswa</p>
          <h3 className="text-3xl font-black text-slate-800">128</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 w-fit rounded-2xl mb-4"><CreditCard /></div>
          <p className="text-slate-500 text-sm font-bold">Menunggu Verifikasi</p>
          <h3 className="text-3xl font-black text-slate-800">5</h3>
        </div>
      </div>

      {/* Tabel Verifikasi Pembayaran */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-black text-xl text-slate-800">Verifikasi Pembayaran Manual</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input type="text" placeholder="Cari nama siswa..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="p-6">Siswa</th>
                <th className="p-6">Kursus</th>
                <th className="p-6">Bukti</th>
                <th className="p-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50/50 transition">
                <td className="p-6">
                  <p className="font-bold text-slate-800">Budi Santoso</p>
                  <p className="text-xs text-slate-400">budi@email.com</p>
                </td>
                <td className="p-6 text-sm font-medium text-slate-600">Operator Komputer Dasar</td>
                <td className="p-6">
                  <button className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline">
                    <Eye size={14}/> Lihat Bukti
                  </button>
                </td>
                <td className="p-6 flex gap-2">
                  <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition" title="Setujui">
                    <CheckCircle size={18} />
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition" title="Tolak">
                    <XCircle size={18} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}