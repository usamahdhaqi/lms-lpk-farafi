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
  Edit2,
  Trash2,
  ExternalLink,
  Settings2,
  Award,
  Users
} from 'lucide-react';
import api from '../../api/api';

export default function InstructorCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showManageModal, setShowManageModal] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  // State untuk Modal Tambah Materi
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video',
    content_url: '',
    order_index: 1
  });

  // Fungsi untuk mengambil daftar materi berdasarkan kursus
  const fetchLessons = async (courseId) => {
    try {
      const response = await api.get(`/api/instructor/courses/${courseId}/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error("Gagal mengambil materi");
    }
  };

  // Fungsi Hapus Materi
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus materi ini?")) return;
    try {
      await api.delete(`/api/instructor/lessons/${lessonId}`);
      fetchLessons(selectedCourse.id); // Refresh list
    } catch (error) {
      alert("Gagal menghapus materi");
    }
  };

  // Fungsi Submit Edit/Update
  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/instructor/lessons/${editingLessonId}`, newLesson);
      alert("Materi diperbarui!");
      setEditingLessonId(null);
      setNewLesson({ title: '', type: 'video', content_url: '', order_index: 1 });
      fetchLessons(selectedCourse.id);
    } catch (error) {
      alert("Gagal memperbarui materi");
    }
  };

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
                onClick={() => { 
                  setSelectedCourse(course); 
                  setShowManageModal(true); 
                  fetchLessons(course.id); 
                }}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95"
              >
                <LayoutGrid size={20} /> KELOLA KURIKULUM
              </button>
              <button 
                onClick={() => navigate('/instructor/students', { state: { filterCourse: course.title } })}
                className="w-full bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                >
                <Users size={20} /> MONITORING SISWA
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

      {/* MODAL KELOLA KURIKULUM (LIST, EDIT, DELETE) */}
      {showManageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => { setShowManageModal(false); setEditingLessonId(null); }}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Materi</h2>
                <p className="text-blue-600 text-sm font-bold mt-1 uppercase tracking-wider">{selectedCourse?.title}</p>
              </div>
              <button onClick={() => { setShowManageModal(false); setEditingLessonId(null); }} className="p-3 bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm border border-slate-100 transition"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* FORM SECTION (Left Side - 2 Cols) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 sticky top-0">
                  <h3 className="font-black text-blue-700 mb-6 flex items-center gap-2 text-lg uppercase tracking-tight">
                    {editingLessonId ? <Edit2 size={20}/> : <Plus size={20}/>}
                    {editingLessonId ? "Update Materi" : "Tambah Materi"}
                  </h3>
                  <form onSubmit={editingLessonId ? handleUpdateLesson : handleAddLesson} className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Judul Materi</label>
                      <input 
                        className="w-full p-5 rounded-2xl border-none outline-none font-bold text-slate-700 shadow-sm"
                        placeholder="Contoh: Pengenalan Komponen"
                        required
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-blue-400 uppercase ml-2">URL YouTube / Link PDF</label>
                      <input 
                        className="w-full p-5 rounded-2xl border-none outline-none font-bold text-slate-700 text-sm shadow-sm"
                        placeholder="https://youtube.com/..."
                        required
                        value={newLesson.content_url}
                        onChange={(e) => setNewLesson({...newLesson, content_url: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Tipe</label>
                        <select 
                          className="w-full p-5 rounded-2xl border-none font-bold text-slate-700 shadow-sm outline-none appearance-none cursor-pointer bg-white"
                          value={newLesson.type}
                          onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                        >
                          <option value="video">Video</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-blue-400 uppercase ml-2">Urutan</label>
                        <input 
                          type="number"
                          className="w-full p-5 rounded-2xl border-none font-bold text-slate-700 text-center shadow-sm outline-none"
                          value={newLesson.order_index}
                          onChange={(e) => setNewLesson({...newLesson, order_index: e.target.value})}
                        />
                      </div>
                    </div>
                    <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                      {editingLessonId ? "SIMPAN PERUBAHAN" : "PUBLIKASIKAN MATERI"}
                    </button>
                    {editingLessonId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingLessonId(null);
                          setNewLesson({ title: '', type: 'video', content_url: '', order_index: 1 });
                        }} 
                        className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition"
                      >
                        Batal Pengeditan
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* LIST SECTION (Right Side - 3 Cols) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Kurikulum Berjalan</h3>
                    <span className="text-[10px] font-black bg-blue-100 px-3 py-1 rounded-full text-blue-600 uppercase">
                    {lessons.length} Tahapan
                    </span>
                </div>
                
                <div className="space-y-3">
                {lessons.map((lesson) => {
                    // 1. Tentukan dulu apakah ini kuis/ujian
                    const isQuiz = 
                    lesson.type === 'quiz' || 
                    lesson.title.toLowerCase().includes('ujian') || 
                    lesson.title.toLowerCase().includes('kuis');

                    return (
                    <div key={lesson.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group">
                        
                        {/* POIN 1: BAGIAN NOMOR / IKON */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                        isQuiz 
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' 
                        : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'
                        }`}>
                        {isQuiz ? <Award size={18} /> : lesson.order_index}
                        </div>

                        {/* POIN 2: BAGIAN JUDUL & LABEL (Tulis di Sini) */}
                        <div className="flex-1 ml-5">
                        <p className="font-bold text-slate-800 text-base line-clamp-1">{lesson.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                            {isQuiz ? (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border text-amber-600 border-amber-200 bg-amber-50 animate-pulse">
                                Ujian Akhir Kompetensi
                            </span>
                            ) : (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                lesson.type === 'video' ? 'text-blue-500 border-blue-100 bg-blue-50' : 'text-purple-500 border-purple-100 bg-purple-50'
                            }`}>
                                {lesson.type}
                            </span>
                            )}
                            {!isQuiz && <span className="text-[9px] font-bold text-slate-300 truncate max-w-[150px]">{lesson.content_url}</span>}
                        </div>
                        </div>

                        <div className="flex gap-2">
                            {/* Jika Ujian, arahkan ke Bank Soal. Jika materi biasa, buka form edit */}
                            <button 
                            onClick={() => {
                                if (isQuiz) {
                                navigate(`/instructor/quiz-bank/${selectedCourse.id}`);
                                } else {
                                setEditingLessonId(lesson.id);
                                setNewLesson({
                                    title: lesson.title,
                                    type: lesson.type,
                                    content_url: lesson.content_url,
                                    order_index: lesson.order_index
                                });
                                }
                            }}
                            className={`p-3 rounded-xl transition-all shadow-sm ${isQuiz ? 'text-amber-600 bg-amber-50 hover:bg-amber-600 hover:text-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white'}`}
                            title={isQuiz ? "Kelola Soal Ujian" : "Edit Materi"}
                            >
                            {isQuiz ? <HelpCircle size={16} /> : <Edit2 size={16} />}
                            </button>
                            
                            <button 
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Hapus"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                        </div>
                    );
                    })}

                    {lessons.length === 0 && (
                    <div className="p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                        <Layers className="mx-auto text-slate-300 mb-4" size={40} />
                        <p className="text-slate-400 font-bold italic">Belum ada materi.</p>
                    </div>
                    )}
                </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}