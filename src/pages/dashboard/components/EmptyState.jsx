import { PlusCircle, ArrowRight } from 'lucide-react';

export const EmptyState = ({ onAction }) => (
  <div 
    onClick={onAction}
    className="group cursor-pointer bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 min-h-[350px]"
  >
    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
      <PlusCircle size={32} />
    </div>
    <h3 className="font-black text-xl text-slate-800">Ambil Pelatihan</h3>
    <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed">
      Anda belum memiliki kursus aktif. Pilih pelatihan untuk memulai belajar dan dapatkan sertifikat.
    </p>
    <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-full">
      Lihat Katalog <ArrowRight size={16} />
    </div>
  </div>
);