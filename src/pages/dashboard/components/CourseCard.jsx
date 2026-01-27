import { PlayCircle, CheckCircle, Clock, Award, AlertCircle, ChevronRight } from 'lucide-react';

export const CourseCard = ({ item, onNavigate }) => {
  const isPaid = item.payment_status === 'paid';
  const progress = item.progress_percentage || 0;

  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-500 transition-all duration-500 flex flex-col group overflow-hidden relative">
      
      {/* Card Header (Thumbnail Area) */}
      <div className="h-44 bg-slate-900 p-8 flex items-end relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all duration-700"></div>
        
        <div className="absolute top-6 right-6">
          <span className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-2xl backdrop-blur-md border border-white/10 ${
            isPaid ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white animate-pulse'
          }`}>
            {isPaid ? <CheckCircle size={10}/> : <Clock size={10}/>}
            {isPaid ? 'Aktif' : 'Verifikasi'}
          </span>
        </div>
        
        <div className="relative z-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          <PlayCircle size={32} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-black text-xl text-slate-800 mb-2 line-clamp-2 leading-tight uppercase italic min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 block">
            Instruktur: <span className="text-slate-600 italic">{item.instructor_name || 'Tim LPK Farafi'}</span>
          </p>
          
          {isPaid ? (
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Capaian Belajar</span>
                <span className="text-lg font-black text-blue-600 italic leading-none">{progress}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {progress === 100 && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Award size={16} className="text-emerald-500" />
                  <p className="text-[10px] text-emerald-700 font-black uppercase italic">Pelatihan Selesai!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-10 p-5 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
              <AlertCircle size={24} className="text-amber-500 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed font-bold italic uppercase tracking-tight">
                Pembayaran sedang dicek. Akses akan terbuka otomatis.
              </p>
            </div>
          )}
        </div>

        <button 
          disabled={!isPaid}
          onClick={() => onNavigate(item.course_id)}
          className={`group/btn w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] italic transition-all shadow-xl flex items-center justify-center gap-2 ${
            isPaid
            ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200 active:scale-95'
            : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
          }`}
        >
          {isPaid ? (
            <>
              {progress === 100 ? 'Tinjau Materi' : 'Mulai Belajar'}
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </>
          ) : 'Terkunci'}
        </button>
      </div>
    </div>
  );
};