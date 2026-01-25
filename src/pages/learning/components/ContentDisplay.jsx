import React from 'react';
import { FileText, CheckCircle2, ArrowRight, Award, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContentDisplay({ activeLesson, courseId, onComplete }) {
  const navigate = useNavigate();

  // Guard clause jika data belum dimuat
  if (!activeLesson) return null;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 animate-in fade-in duration-500">
      
      {/* RENDER BERDASARKAN TIPE MATERI */}
      {activeLesson.type === 'video' ? (
        <div className="aspect-video bg-black relative group">
          <iframe 
            width="100%" 
            height="100%" 
            src={activeLesson.content_url} 
            allowFullScreen 
            title="Lesson Video" 
            className="relative z-10"
          />
        </div>
      ) : activeLesson.type === 'pdf' || activeLesson.type === 'document' ? (
        <div className="p-12 md:p-24 text-center space-y-6 bg-gradient-to-b from-white to-slate-50">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-100/50">
            <FileText size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{activeLesson.title}</h3>
            <p className="text-slate-500 font-medium">Dokumen ini berisi materi pendukung pelatihan.</p>
          </div>
          <a 
            href={activeLesson.content_url} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl active:scale-95"
          >
            BUKA MODUL PDF
          </a>
        </div>
      ) : activeLesson.type === 'quiz' ? (
        <div className="p-12 md:p-24 text-center space-y-8 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="w-24 h-24 bg-amber-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-amber-200 rotate-3 animate-bounce-slow">
            <Award size={48} />
          </div>
          <div className="space-y-3">
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Ujian Akhir</h3>
            <p className="text-slate-500 max-w-md mx-auto font-medium leading-relaxed italic">
              "Selamat! Anda telah menyelesaikan seluruh materi. Sekarang, buktikan pemahaman Anda untuk mendapatkan Sertifikat Kelulusan."
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => navigate(`/dashboard/course/${courseId}/quiz`)} 
              className="bg-blue-600 text-white px-14 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 hover:-translate-y-1 active:scale-95 uppercase"
            >
              Mulai Ujian Sekarang
            </button>
            <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Tersedia {activeLesson.quiz_count || 'Beberapa'} Pertanyaan
            </div>
          </div>
        </div>
      ) : null}

      {/* FOOTER: TOMBOL SELESAI (Hanya muncul jika bukan kuis) */}
      {activeLesson.type !== 'quiz' && (
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* Warna icon berubah sesuai status */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${
              activeLesson.is_completed === 1 
              ? 'bg-green-50 text-green-600 border-green-100' 
              : 'bg-white text-blue-600 border-slate-100'
            }`}>
                {activeLesson.is_completed === 1 ? <CheckCircle2 size={20} /> : <PlayCircle size={20} />}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Materi</p>
                {/* Teks berubah dinamis sesuai database */}
                <p className={`text-xs font-bold uppercase ${
                  activeLesson.is_completed === 1 ? 'text-green-600' : 'text-slate-700'
                }`}>
                  {activeLesson.is_completed === 1 ? 'Selesai Dipelajari' : 'Belum Selesai'}
                </p>
            </div>
          </div>

          {/* Tombol hanya muncul/aktif jika materi belum selesai */}
          {activeLesson.is_completed !== 1 ? (
            <button 
              onClick={onComplete} 
              className="w-full sm:w-auto bg-green-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-xl shadow-green-100 active:scale-95 uppercase tracking-wide text-xs"
            >
              Tandai Selesai & Lanjut <ArrowRight size={20} />
            </button>
          ) : (
            <div className="px-6 py-3 bg-white border border-green-200 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
              Materi ini sudah tuntas
            </div>
          )}
        </div>
      )}
    </div>
  );
}