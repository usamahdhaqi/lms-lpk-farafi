import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, targetName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase italic">Hapus Materi?</h3>
        <p className="text-slate-500 mt-2 font-medium">Hapus <span className="font-bold text-slate-800">"{targetName}"</span> secara permanen?</p>
        <div className="mt-10 flex flex-col gap-3">
          <button onClick={onConfirm} className="w-full py-5 bg-red-500 text-white rounded-[2rem] font-black shadow-xl shadow-red-100 hover:bg-red-600 transition-all active:scale-95 uppercase tracking-widest text-xs italic">
            Ya, Hapus Permanen
          </button>
          <button onClick={onClose} className="w-full py-5 text-slate-400 font-black hover:text-slate-600 transition-all uppercase tracking-widest text-xs italic">
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}