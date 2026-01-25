import { ChevronDown, ChevronUp, CheckCircle2, PlayCircle, Lock, Award } from 'lucide-react';

export default function CurriculumAccordion({ lessons, activeLessonId, isOpen, toggleOpen, onSelectLesson }) {
  
  // Cek apakah semua materi non-kuis sudah selesai
  const isAllLessonsCompleted = lessons.length > 0 && lessons.every(l => l.is_completed === 1 || l.type === 'quiz');

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
      <button onClick={toggleOpen} className="w-full p-8 flex items-center justify-between hover:bg-slate-50">
        <span className="font-black text-slate-800 uppercase tracking-tight">Daftar Materi Pelatihan</span>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      
      {isOpen && (
        <div className="p-8 pt-0 space-y-2 bg-slate-50/30">
          {/* 1. RENDER MATERI DARI DATABASE */}
          {lessons.map((lesson, index) => {
            const isCompleted = lesson.is_completed === 1;
            const isPrevDone = index === 0 || lessons[index - 1].is_completed === 1;
            const isActive = activeLessonId === lesson.id;

            return (
              <button 
                key={lesson.id} 
                disabled={!isPrevDone} 
                onClick={() => onSelectLesson(lesson)} 
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                  ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border-slate-100'} 
                  ${!isPrevDone ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-bold text-left">{lesson.title}</span>
                </div>
                <div className="flex items-center">
                  {isCompleted ? <CheckCircle2 size={20} className={isActive ? 'text-white' : 'text-green-500'} /> 
                  : isPrevDone ? <PlayCircle size={20} className={isActive ? 'text-white' : 'text-blue-500'} /> 
                  : <Lock size={18} className="text-slate-300" />}
                </div>
              </button>
            );
          })}

          {/* 2. RENDER ITEM UJIAN AKHIR (ITEM KHUSUS) */}
          <button 
            disabled={!isAllLessonsCompleted}
            onClick={() => onSelectLesson({ type: 'quiz', title: 'Ujian Akhir Sertifikasi' })}
            className={`w-full mt-4 flex items-center justify-between p-6 rounded-2xl border-2 border-dashed transition-all
              ${isAllLessonsCompleted 
                ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white' 
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'}`}
          >
            <div className="flex items-center gap-4">
              <Award size={24} />
              <div className="text-left">
                <p className="font-black text-sm uppercase leading-none">Ujian Akhir Sertifikasi</p>
                <p className="text-[10px] font-bold mt-1 uppercase">Wajib diselesaikan untuk sertifikat</p>
              </div>
            </div>
            {!isAllLessonsCompleted && <Lock size={20} />}
          </button>
        </div>
      )}
    </div>
  );
}