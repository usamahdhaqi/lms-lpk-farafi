import { useNavigate } from 'react-router-dom';
import { HelpCircle, Settings2, LayoutGrid, Users } from 'lucide-react';

export default function CourseCard({ course, onManage }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-2xl group hover:border-blue-500 transition-all duration-500">
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
        <button onClick={onManage} className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl active:scale-95">
          <LayoutGrid size={20} /> KELOLA KURIKULUM
        </button>
        <button onClick={() => navigate('/instructor/students', { state: { filterCourse: course.title } })} className="w-full bg-white border-2 border-slate-100 text-slate-500 py-5 rounded-[1.8rem] font-black flex items-center justify-center gap-3 hover:bg-blue-50 hover:text-blue-600 transition-all">
          <Users size={20} /> MONITORING SISWA
        </button>
      </div>
    </div>
  );
}