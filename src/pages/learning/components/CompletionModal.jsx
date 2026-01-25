import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function CompletionModal({ nextLesson, onClose, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Materi Selesai!
          </h3>
          <p className="text-slate-500 text-sm italic">
            "Ilmu adalah harta yang takkan pernah habis."
          </p>
          
          <div className="pt-6 space-y-3">
            <button 
              onClick={onContinue}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
            >
              {nextLesson ? 'Lanjut ke Materi Berikutnya' : 'Selesai & Ke Dashboard'}
            </button>
            
            <button 
              onClick={onClose}
              className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition"
            >
              Tetap di Halaman Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}