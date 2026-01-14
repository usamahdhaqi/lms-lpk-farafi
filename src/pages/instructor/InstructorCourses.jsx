import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Video, 
  FileText, 
  LayoutGrid, 
  Loader2, 
  X, 
  Save, 
  Layers, 
  HelpCircle,
  Trash2,
  ExternalLink,
  Settings2,
  Award
} from 'lucide-react';
import api from '../../api/api';

export default function InstructorCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Tambah Materi
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video',
    content_url: '',
    order_index: 1
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Mengambil kursus berdasarkan instructor_id yang login
        const response = await api.get(`/api/instructor/courses/${user.id}`);
        setMyCourses(response.data);
      } catch (error) {
        console.error("Gagal memuat kursus:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCourses();
  }, [user]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      // Mengirim data materi baru ke backend
      await api.post('/api/instructor/lessons', {
        ...newLesson,
        course_id: selectedCourse.id
      });
      alert("Materi Berhasil Ditambahkan!");
      setShowModal(false);
      // Reset form
      setNewLesson({ title: '', type: 'video', content_url: '', order_index: 1 });
    } catch (error) {
      alert("Gagal menambahkan materi. Silakan coba lagi.");
    }
  };

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sinkronisasi Kurikulum...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kurikulum Pengajaran</h1>
          <p className="text-slate-500 font-medium">Kelola materi pelatihan dan bank soal untuk setiap kursus Anda.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl text-blue-600 font-bold border border-blue-100 flex items-center gap-2">
          <Layers size={20} />
          {myCourses.length} Kursus Terdaftar
        </div>
      </div>

      {/* COURSE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {myCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/50 group hover:border-blue-500 transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl group-hover:bg-blue-600 transition-colors shadow-xl">
                {course.id.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/instructor/quiz-bank/${course.id}`)}
                  className="p-4 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition shadow-sm border border-amber-100"
                  title="Kelola Bank Soal"
                >
                  <HelpCircle size={22} />
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition border border-slate-100">
                  <Settings2 size={22} />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-slate-400 text-sm font-medium mb-10 line-clamp-2">
              {course.description || "Tidak ada deskripsi kursus."}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Materi Video</p>
                <p className="text-xl font-black text-slate-800 flex items-center gap-2"><Video size={18} className="text-blue-500"/> Terintegrasi</p> 
              </div>
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Kuis</p>
                <p className="text-xl font-black text-green-600 flex items-center gap-2"><Award size={18}/> Aktif</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => { setSelectedCourse(course); setShowModal(true); }}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
              >
                <Plus size={20} /> TAMBAH MATERI (LESSON)
              </button>
              <button className="w-full bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                <ExternalLink size={20} /> PREVIEW KURIKULUM
              </button>
            </div>
          </div>
        ))}

        {myCourses.length === 0 && (
          <div className="col-span-full bg-white p-24 rounded-[4rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
              <Layers size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Belum Ada Kelas Diampu</h3>
            <p className="text-slate-400 max-w-sm mt-3 font-medium leading-relaxed">
              Anda belum terdaftar sebagai instruktur di kelas manapun. Silakan hubungi admin untuk penugasan kursus.
            </p>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH MATERI */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tambah Materi Baru</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Kursus: {selectedCourse?.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm border border-slate-100 transition"><X /></button>
            </div>
            
            <form onSubmit={handleAddLesson} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Judul Materi</label>
                <input 
                  type="text" required placeholder="Contoh: Teknik Troubleshooting Dasar"
                  className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold"
                  value={newLesson.title} onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Tipe Materi</label>
                  <select 
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold appearance-none cursor-pointer"
                    value={newLesson.type} onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                  >
                    <option value="video">Video YouTube</option>
                    <option value="pdf">Modul PDF (Link)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Urutan (Index)</label>
                  <input 
                    type="number" required
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                    value={newLesson.order_index} onChange={(e) => setNewLesson({...newLesson, order_index: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Link Konten</label>
                <div className="relative">
                  <input 
                    type="url" required placeholder="https://..."
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                    value={newLesson.content_url} onChange={(e) => setNewLesson({...newLesson, content_url: e.target.value})}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    {newLesson.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Save size={20} /> SIMPAN KE KURIKULUM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}