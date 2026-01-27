import React from 'react';
import { UserX, UserCheck, AlertCircle, X } from 'lucide-react';

export default function UserStatusModal({ isOpen, onClose, onConfirm, targetName, isActivating }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Dekorasi Background */}
        <div className={`absolute top-0 left-0 w-full h-2 ${isActivating ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

        <div className={`w-24 h-24 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-lg transform -rotate-6 ${
          isActivating ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
          {isActivating ? <UserCheck size={48} /> : <UserX size={48} />}
        </div>

        <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">
          {isActivating ? 'Aktifkan Kembali?' : 'Nonaktifkan Akun?'}
        </h3>
        
        <p className="text-slate-500 mt-4 font-medium leading-relaxed">
          Anda akan {isActivating ? 'memberi akses kembali' : 'mencabut akses'} untuk <br/>
          <span className="font-bold text-slate-800">"{targetName}"</span> di platform LPK FARAFI.
        </p>

        {!isActivating && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
            <AlertCircle className="text-slate-400 shrink-0" size={18} />
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
              Catatan: Siswa ini tidak akan bisa login sampai akun diaktifkan kembali oleh admin.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className={`w-full py-5 text-white rounded-[2rem] font-black shadow-xl transition-all active:scale-95 ${
              isActivating 
                ? 'bg-emerald-500 shadow-emerald-100 hover:bg-emerald-600' 
                : 'bg-amber-500 shadow-amber-100 hover:bg-amber-600'
            }`}
          >
            YA, SAYA YAKIN
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-5 bg-white text-slate-400 rounded-[2rem] font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
          >
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}