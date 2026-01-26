import React from 'react';
import { Activity, Wallet, Zap } from 'lucide-react';

export default function StatsBento({ stats }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center px-1 lg:px-4">
      {/* Header Section */}
      <div className="lg:col-span-7 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-3 lg:mb-4">
          <Zap size={12} className="fill-blue-600" />
          <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-wider">Lembaga Pelatihan Kerja</span>
        </div>
        <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
          Admin <span className="text-blue-600 italic block lg:inline">Dashboard</span>
        </h1>
        <p className="mt-2 text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] hidden lg:block">
          Sistem Manajemen Pembelajaran & Monitoring Progres
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-3 lg:gap-4">
        {/* Card Akademik */}
        <div className="bg-white p-5 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <Activity className="text-blue-600" size={24} />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rata-rata Progres</p>
          <p className="text-2xl lg:text-3xl font-black text-slate-800 tabular-nums">
            {stats.avgProgress}%
          </p>
        </div>

        {/* Card Revenue */}
        <div className="bg-slate-900 p-5 lg:p-6 rounded-[2rem] lg:rounded-[2.5rem] shadow-xl shadow-slate-200">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <Wallet className="text-emerald-400" size={24} />
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Pendapatan</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-bold text-emerald-500 uppercase">Rp</span>
            <p className="text-lg lg:text-2xl font-black text-white tabular-nums">
              {stats.totalRevenue >= 1000000 
                ? (stats.totalRevenue / 1000000).toFixed(1) + 'M' 
                : stats.totalRevenue.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}