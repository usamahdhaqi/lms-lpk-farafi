import { PlusCircle, ArrowRight } from 'lucide-react';

export const EmptyState = ({ onAction }) => (
  <div 
    onClick={onAction}
    className="group cursor-pointer bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-500 min-h-[400px] shadow-sm hover:shadow-2xl"
  >
    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
      <PlusCircle size={40} />
    </div>
    <h3 className="font-black text-2xl text-slate-800 uppercase italic leading-tight">Belum Ada Pelatihan</h3>
    <p className="text-slate-500 mt-3 px-8 leading-relaxed font-medium max-w-sm">
      Waktunya meningkatkan skill Anda. Pilih kelas unggulan kami dan mulai perjalanan karir Anda hari ini.
    </p>
    <div className="mt-10 flex items-center gap-3 text-blue-600 font-black text-xs bg-white px-8 py-4 rounded-full shadow-lg border border-blue-50 uppercase tracking-[0.2em] group-hover:bg-blue-600 group-hover:text-white transition-all">
      Buka Katalog Kelas <ArrowRight size={18} />
    </div>
  </div>
);