import { PlayCircle, CheckCircle, Clock, Award, AlertCircle } from 'lucide-react';

export const CourseCard = ({ item, onNavigate }) => {
  const isPaid = item.payment_status === 'paid';
  const progress = item.progress_percentage || 0;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col group transition-all hover:-translate-y-2">
      <div className="h-40 bg-slate-900 p-8 flex items-end relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6">
          <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
            isPaid ? 'bg-green-500 text-white' : 'bg-amber-500 text-white animate-pulse'
          }`}>
            {isPaid ? <CheckCircle size={12}/> : <Clock size={12}/>}
            {isPaid ? 'Aktif' : 'Menunggu Verifikasi'}
          </span>
        </div>
        
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
          <PlayCircle size={32} />
        </div>
      </div>

      <div className="p-8">
        <h3 className="font-black text-xl text-slate-800 mb-1 line-clamp-2 leading-tight min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-400 mb-8 font-medium italic">
          Instruktur: <span className="text-slate-600">{item.instructor_name || 'Tim LPK Farafi'}</span>
        </p>
        
        {isPaid ? (
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
              <span>Progres Belajar</span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {progress === 100 && (
              <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-2">
                <Award size={12} /> Selamat! Anda telah menyelesaikan materi.
              </p>
            )}
          </div>
        ) : (
          <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <AlertCircle size={20} className="text-amber-500 shrink-0" />
            <p className="text-[11px] text-amber-700 leading-relaxed italic">
              Pembayaran Anda sedang diverifikasi. Akses materi akan terbuka otomatis setelah disetujui Admin.
            </p>
          </div>
        )}

        <button 
          disabled={!isPaid}
          onClick={() => onNavigate(item.course_id)}
          className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg ${
            isPaid
            ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
          }`}
        >
          {isPaid ? (progress === 100 ? 'ULANGI MATERI' : 'LANJUTKAN BELAJAR') : 'AKSES TERKUNCI'}
        </button>
      </div>
    </div>
  );
};