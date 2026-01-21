import { ArrowUp, ArrowDown, Trash2, Award, Edit2, MonitorPlay, FileStack, FileText } from 'lucide-react';
import api from '../../../api/api';

export default function LessonList({ lessons, setLessons, fetchLessons, courseId, onEdit }) {
  
  const getLessonIcon = (type, title) => {
    if (type === 'quiz' || title.toLowerCase().includes('ujian')) return <Award className="text-amber-500" />;
    if (type === 'video') return <MonitorPlay className="text-blue-500" />;
    if (type === 'slides') return <FileStack className="text-orange-500" />;
    return <FileText className="text-purple-500" />;
  };

  const moveLesson = async (index, direction) => {
    const newItems = [...lessons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    // Update tampilan dulu agar user tidak merasa lag
    setLessons(newItems);

    try {
        const sortedIds = newItems.map(item => Number(item.id));
        console.log("🚀 Mengirim ke server:", sortedIds);

        const response = await api.put('/api/instructor/lessons/reorder', { sortedIds });
        console.log("✅ Berhasil:", response.data.message);
    } catch (error) {
        console.error("❌ Detail Error API:", error.response?.data);
        // Penting: Tarik ulang data asli jika gagal agar urutan di layar sinkron dengan DB
        fetchLessons(courseId); 
        alert("Gagal memperbarui urutan. Server merespon: " + (error.response?.data?.detail || "Error 500"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus materi ini?")) return;
    try {
      await api.delete(`/api/instructor/lessons/${id}`);
      fetchLessons(courseId);
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 mb-6">
        <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Alur Pembelajaran</h3>
        <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-black uppercase">
          Gunakan panah untuk urutan
        </span>
      </div>

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id} 
            className="p-5 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm"
          >
            <div className="flex items-center gap-5">
              {/* Tombol Navigasi Up/Down */}
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => moveLesson(index, 'up')}
                  disabled={index === 0}
                  className={`p-1.5 rounded-lg transition-colors ${index === 0 ? 'text-slate-100' : 'text-slate-300 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  <ArrowUp size={18} />
                </button>
                <button 
                  onClick={() => moveLesson(index, 'down')}
                  disabled={index === lessons.length - 1}
                  className={`p-1.5 rounded-lg transition-colors ${index === lessons.length - 1 ? 'text-slate-100' : 'text-slate-300 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  <ArrowDown size={18} />
                </button>
              </div>

              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50">
                {getLessonIcon(lesson.type, lesson.title)}
              </div>
              
              <div>
                <p className="font-bold text-slate-800 text-base line-clamp-1">{lesson.title}</p>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border border-slate-100 text-slate-400 bg-slate-50/50">
                  {lesson.type}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Tombol Edit Baru */}
              <button 
                onClick={() => onEdit(lesson)} 
                className="p-4 text-blue-400 bg-white border border-slate-50 rounded-2xl hover:bg-blue-50 transition-all"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(lesson.id)} 
                className="p-4 text-red-400 bg-white border border-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}