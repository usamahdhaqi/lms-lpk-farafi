import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Video, FileText, LayoutGrid, Loader2, 
  X, Save, Layers, HelpCircle, Edit2, 
  Trash2, Settings2, Award, Users, FileStack,
  UploadCloud, Youtube, MonitorPlay, GripVertical
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../api/api';

export default function InstructorCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State Management
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  const [newLesson, setNewLesson] = useState({
    title: '',
    type: 'video', // video, document, slides
    content_url: '',
    order_index: 1
  });

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLessons(items);

    const sortedIds = items.map(item => item.id);
    console.log("Mengirim data reorder:", sortedIds); // Lihat di console browser

    try {
      await api.put('/api/instructor/lessons/reorder', { sortedIds });
    } catch (error) {
      console.error("Detail Error API:", error.response?.data);
      fetchLessons(selectedCourse.id);
    }
  };

  // 1. Fetch Daftar Kursus & Integrasi State Navigasi
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(`/api/instructor/courses/${user.id}`);
        const dataCourses = response.data;
        setMyCourses(dataCourses);

        // Cek instruksi buka modal otomatis dari Dashboard
        if (location.state?.openModal && location.state?.targetCourseId && dataCourses.length > 0) {
          const target = dataCourses.find(c => String(c.id) === String(location.state.targetCourseId));
          if (target) {
            setSelectedCourse(target);
            setShowManageModal(true);
            fetchLessons(target.id);
            window.history.replaceState({}, document.title); // Bersihkan state history
          }
        }
      } catch (error) {
        console.error("Gagal memuat kursus:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchCourses();
  }, [user, location.state]);

  // 2. Manajemen Materi (Lessons)
  const fetchLessons = async (courseId) => {
    try {
      const response = await api.get(`/api/instructor/courses/${courseId}/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error("Gagal mengambil materi");
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newLesson.title);
      formData.append('type', newLesson.type);
      formData.append('order_index', newLesson.order_index);
      formData.append('course_id', selectedCourse.id);
      
      if (selectedFile) {
        formData.append('file', selectedFile); // Kirim file fisik
      } else {
        formData.append('content_url', newLesson.content_url);
      }

      await api.post('/api/instructor/lessons', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("✅ Materi berhasil dipublikasikan!");
      setNewLesson({ title: '', type: 'video', content_url: '', order_index: 1 });
      setSelectedFile(null);
      fetchLessons(selectedCourse.id);
    } catch (error) {
      alert("❌ Gagal menambahkan materi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Hapus materi ini secara permanen?")) return;
    try {
      await api.delete(`/api/instructor/lessons/${lessonId}`);
      fetchLessons(selectedCourse.id);
    } catch (error) {
      alert("Gagal menghapus materi");
    }
  };

  const getLessonIcon = (type, title) => {
    if (type === 'quiz' || title.toLowerCase().includes('ujian')) return <Award className="text-amber-500" />;
    if (type === 'video') return <MonitorPlay className="text-blue-500" />;
    if (type === 'slides') return <FileStack className="text-orange-500" />;
    return <FileText className="text-purple-500" />;
  };

  if (loading && myCourses.length === 0) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sinkronisasi Data...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kurikulum Pengajaran</h1>
          <p className="text-slate-500 font-medium">Kelola materi pelatihan dan bank soal secara mandiri.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl text-blue-600 font-bold border border-blue-100 flex items-center gap-2">
          <Layers size={20} /> {myCourses.length} Kursus Aktif
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {myCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-2xl group hover:border-blue-500 transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl group-hover:bg-blue-600 transition-colors">
                {course.id.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/instructor/quiz-bank/${course.id}`)} className="p-4 bg-amber-50 text-amber-600 rounded-2xl hover:bg-amber-100 transition border border-amber-100"><HelpCircle size={22} /></button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition border border-slate-100"><Settings2 size={22} /></button>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
            <p className="text-slate-400 text-sm font-medium mb-10 line-clamp-2">{course.description || "Tidak ada deskripsi."}</p>

            <div className="flex flex-col gap-4">
              <button onClick={() => { setSelectedCourse(course); setShowManageModal(true); fetchLessons(course.id); }} className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95"><LayoutGrid size={20} /> KELOLA KURIKULUM</button>
              <button onClick={() => navigate('/instructor/students', { state: { filterCourse: course.title } })} className="w-full bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-50 hover:text-blue-600 transition-all"><Users size={20} /> MONITORING SISWA</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Manajemen Kurikulum */}
      {showManageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setShowManageModal(false)}></div>
          <div className="relative bg-white w-full max-w-6xl rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Manajemen Materi</h2>
                <p className="text-blue-600 text-sm font-bold uppercase">{selectedCourse?.title}</p>
              </div>
              <button onClick={() => setShowManageModal(false)} className="p-3 bg-white text-slate-400 rounded-2xl shadow-sm border border-slate-100"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Form Tambah Materi (Kiri) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 sticky top-0">
                  <h3 className="font-black text-blue-700 mb-6 flex items-center gap-2 text-lg uppercase">Tambah Materi Baru</h3>
                  <form onSubmit={handleAddLesson} className="space-y-4">
                    <input className="w-full p-5 rounded-2xl border-none outline-none font-bold text-slate-700 shadow-sm" placeholder="Judul Materi" required value={newLesson.title} onChange={(e) => setNewLesson({...newLesson, title: e.target.value})} />
                    
                    <div className="grid grid-cols-3 gap-2">
                      {['video', 'document', 'slides'].map((t) => (
                        <button key={t} type="button" onClick={() => setNewLesson({...newLesson, type: t})} className={`py-3 rounded-xl font-bold text-[10px] uppercase border transition-all ${newLesson.type === t ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100'}`}>
                          {t === 'slides' ? 'PowerPoint' : t}
                        </button>
                      ))}
                    </div>

                    {newLesson.type === 'video' ? (
                      <div className="relative">
                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input className="w-full pl-12 pr-6 py-5 rounded-2xl border-none outline-none font-bold text-sm shadow-sm" placeholder="Link Video YouTube" value={newLesson.content_url} onChange={(e) => setNewLesson({...newLesson, content_url: e.target.value})} />
                      </div>
                    ) : (
                      <div className="relative group">
                        <input type="file" accept=".pdf,.ppt,.pptx,.doc" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full p-5 rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center gap-3 text-blue-500 font-bold group-hover:bg-blue-50 transition-all">
                          <UploadCloud size={20} /> {selectedFile ? selectedFile.name : "Klik Upload File"}
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">PUBLIKASIKAN MATERI</button>
                  </form>
                </div>
              </div>

              {/* List Kurikulum (Kanan) */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Alur Pembelajaran</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">DRAG UNTUK URUTKAN</span>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="lessons-list">
                    {(provided) => (
                      <div 
                        {...provided.droppableProps} 
                        ref={provided.innerRef} 
                        className="space-y-3"
                      >
                        {lessons.map((lesson, index) => (
                          <Draggable key={lesson.id} draggableId={String(lesson.id)} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-6 bg-white border rounded-[2rem] flex items-center justify-between group transition-all ${
                                  snapshot.isDragging ? 'border-blue-500 shadow-2xl scale-105 z-50' : 'border-slate-100'
                                }`}
                              >
                                <div className="flex items-center gap-5">
                                  {/* Handle Drag */}
                                  <div {...provided.dragHandleProps} className="text-slate-300 hover:text-slate-500 cursor-grab">
                                    <GripVertical size={20} />
                                  </div>
                                  
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black bg-slate-50 text-slate-400">
                                    {getLessonIcon(lesson.type, lesson.title)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 text-base">{lesson.title}</p>
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border text-slate-400 bg-slate-50">
                                      {lesson.type}
                                    </span>
                                  </div>
                                </div>
                                
                                <button 
                                  onClick={() => handleDeleteLesson(lesson.id)} 
                                  className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}