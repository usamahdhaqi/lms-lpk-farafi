import React from 'react';
import { X, PlusCircle, Edit3, Save } from 'lucide-react';

export default function CourseModal({ isOpen, onClose, onSubmit, editingId, data, setData, instructors }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4">
      {/* Overlay dengan backdrop blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Konten Modal: Slide up di mobile, Zoom in di desktop */}
      <div className="relative bg-white w-full max-w-2xl h-[92vh] lg:h-auto overflow-hidden rounded-t-[2.5rem] lg:rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom lg:zoom-in-95 duration-300">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 lg:p-8 border-b border-slate-50 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3 font-black">
            <div className={`p-2.5 lg:p-3 rounded-2xl ${editingId ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
              {editingId ? <Edit3 size={20} /> : <PlusCircle size={20} />}
            </div>
            <h2 className="text-lg lg:text-xl text-slate-800 uppercase italic leading-tight">
              {editingId ? 'Edit Data' : 'Kursus Baru'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 lg:p-3 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Body - Scrollable on Mobile */}
        <form onSubmit={onSubmit} className="p-6 lg:p-10 space-y-5 lg:space-y-6 overflow-y-auto max-h-[calc(92vh-100px)] lg:max-h-none">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            <div className="space-y-1.5">
              <label className="ml-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Judul Kursus</label>
              <input required className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Contoh: Mastering React" />
            </div>
            <div className="space-y-1.5">
              <label className="ml-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</label>
              <select required className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm appearance-none"
                value={data.category} onChange={e => setData({...data, category: e.target.value})}>
                <option value="">Pilih...</option>
                <option value="Administrasi">ADM</option>
                <option value="RPL">PROG</option>
                <option value="Desain Grafis">DSGN</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            <div className="space-y-1.5">
              <label className="ml-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga (Rp)</label>
              <input required type="number" className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                value={data.price} onChange={e => setData({...data, price: e.target.value})} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <label className="ml-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Instruktur</label>
              <select required className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm appearance-none"
                value={data.instructor_id} onChange={e => setData({...data, instructor_id: e.target.value})}>
                <option value="">-- Pilih --</option>
                {instructors.map(inst => (<option key={inst.id} value={inst.id}>{inst.name}</option>))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-4 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Deskripsi Materi</label>
            <textarea className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 outline-none font-bold h-28 lg:h-32 text-sm resize-none"
              value={data.description} onChange={e => setData({...data, description: e.target.value})} placeholder="Tulis deskripsi singkat kursus..."></textarea>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] lg:text-xs italic">
              <Save size={18} /> {editingId ? 'Simpan Perubahan' : 'Publikasikan Kursus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}