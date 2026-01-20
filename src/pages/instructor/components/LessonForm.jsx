import React, { useState } from 'react';
import { Youtube, UploadCloud, Loader2, X } from 'lucide-react';
import api from '../../../api/api';

export default function LessonForm({ courseId, onLessonAdded, onClose }) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video',
    content_url: '',
    order_index: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newLesson.title);
      formData.append('type', newLesson.type);
      formData.append('order_index', newLesson.order_index);
      formData.append('course_id', courseId);
      
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('content_url', newLesson.content_url);
      }

      await api.post('/api/instructor/lessons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("✅ Materi berhasil dipublikasikan!");
      onLessonAdded(); 
    } catch (error) {
      alert("❌ Gagal menambahkan materi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      {/* Overlay gelap transparan */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Container Form Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-wider">Materi Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>

        <div className="p-8 bg-blue-50/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              className="w-full p-5 rounded-2xl border-none outline-none font-bold text-slate-700 shadow-sm" 
              placeholder="Judul Materi" 
              required 
              value={newLesson.title} 
              onChange={(e) => setNewLesson({...newLesson, title: e.target.value})} 
            />
            
            <div className="grid grid-cols-3 gap-2">
              {['video', 'document', 'slides'].map((t) => (
                <button 
                  key={t} 
                  type="button" 
                  onClick={() => setNewLesson({...newLesson, type: t})} 
                  className={`py-3 rounded-xl font-bold text-[10px] uppercase border transition-all ${
                    newLesson.type === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {t === 'slides' ? 'PowerPoint' : t}
                </button>
              ))}
            </div>

            {newLesson.type === 'video' ? (
              <div className="relative">
                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  className="w-full pl-12 pr-6 py-5 rounded-2xl border-none outline-none font-bold text-sm shadow-sm" 
                  placeholder="Link Video YouTube" 
                  value={newLesson.content_url} 
                  onChange={(e) => setNewLesson({...newLesson, content_url: e.target.value})} 
                />
              </div>
            ) : (
              <div className="relative group">
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="w-full p-5 rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center gap-3 text-blue-500 font-bold group-hover:bg-blue-50 transition-all">
                  <UploadCloud size={20} /> 
                  <span className="truncate max-w-[150px]">{selectedFile ? selectedFile.name : "Upload File"}</span>
                </div>
              </div>
            )}
            
            <button 
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "PUBLIKASIKAN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}