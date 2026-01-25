import React from 'react';
import { ChevronLeft } from 'lucide-react';

export default function CourseNavbar({ title, onBack }) {
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition"
      >
        <ChevronLeft size={20} /> 
        <span className="hidden md:inline">Dashboard</span>
      </button>
      
      <h2 className="text-sm font-bold text-slate-800 line-clamp-1">
        {title || "Memuat materi..."}
      </h2>
      
      {/* Spacer untuk menjaga judul tetap di tengah pada desktop */}
      <div className="w-10 md:w-40"></div>
    </nav>
  );
}