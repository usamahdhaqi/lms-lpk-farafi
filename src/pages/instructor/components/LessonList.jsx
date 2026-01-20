import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Award, MonitorPlay, FileStack, FileText } from 'lucide-react';
import api from '../../../api/api';

export default function LessonList({ lessons, setLessons, fetchLessons, courseId }) {
  
  const getLessonIcon = (type, title) => {
    if (type === 'quiz' || title.toLowerCase().includes('ujian')) return <Award className="text-amber-500" />;
    if (type === 'video') return <MonitorPlay className="text-blue-500" />;
    if (type === 'slides') return <FileStack className="text-orange-500" />;
    return <FileText className="text-purple-500" />;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setLessons(items);
    const sortedIds = items.map(item => Number(item.id));

    try {
      await api.put('/api/instructor/lessons/reorder', { sortedIds });
    } catch (error) {
      alert("Gagal menyimpan urutan");
      fetchLessons(courseId);
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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center px-2 mb-4">
        <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest">Alur Pembelajaran</h3>
        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded font-black uppercase">Drag untuk Urutkan</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lessons-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 pr-2 custom-scrollbar">
              {lessons.map((lesson, index) => (
                <Draggable key={String(lesson.id)} draggableId={String(lesson.id)} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className={`p-6 bg-white border rounded-[2rem] flex items-center justify-between group transition-all ${snapshot.isDragging ? 'border-blue-500 shadow-2xl z-[9999]' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-5">
                        <div {...provided.dragHandleProps} className="text-slate-300 hover:text-blue-500 p-2 cursor-grab">
                          <GripVertical size={20} />
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50">
                          {getLessonIcon(lesson.type, lesson.title)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-base line-clamp-1">{lesson.title}</p>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md border text-slate-400">{lesson.type}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(lesson.id)} className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
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
  );
}