// LessonForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Save, UploadCloud, Youtube, Loader2 } from 'lucide-react';
import api from '../../../api/api';

export default function LessonForm({ courseId, onClose, onLessonAdded, editData = null }) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    content_url: '',
    order_index: 1
  });

  // Jika ada editData, masukkan ke form (Mode Edit)
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title,
        type: editData.type,
        content_url: editData.content_url,
        order_index: editData.order_index
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('type', formData.type);
    data.append('order_index', formData.order_index);
    data.append('course_id', courseId);
    
    if (selectedFile) {
      data.append('file', selectedFile);
    } else {
      data.append('content_url', formData.content_url);
    }

    try {
      if (editData) {
        // Mode Update
        await api.put(`/api/instructor/lessons/${editData.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Mode Tambah
        await api.post('/api/instructor/lessons', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onLessonAdded();
    } catch (error) {
      alert("Gagal menyimpan materi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-xl font-black text-slate-800 mb-6 uppercase">
          {editData ? 'Edit Materi' : 'Tambah Materi Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Judul Materi</label>
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Tipe Materi</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {['video', 'document', 'slides'].map((t) => (
                <button 
                  key={t} type="button"
                  onClick={() => setFormData({...formData, type: t})}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    formData.type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {formData.type === 'video' ? (
            <input 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-sm"
              placeholder="Link Video YouTube"
              value={formData.content_url}
              onChange={(e) => setFormData({...formData, content_url: e.target.value})}
            />
          ) : (
            <div className="relative border-2 border-dashed border-slate-200 p-6 rounded-2xl text-center">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <p className="text-xs font-bold text-slate-400">{selectedFile ? selectedFile.name : 'Klik untuk ganti file'}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400">BATAL</button>
            <button type="submit" disabled={loading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {editData ? 'SIMPAN PERUBAHAN' : 'TAMBAH MATERI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}