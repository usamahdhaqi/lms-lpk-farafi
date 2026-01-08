import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Award } from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();

  // Mockup data kursus yang sudah dibeli
  const myCourses = [
    { id: 'comp-001', title: 'Operator Komputer Dasar', progress: 45, totalLessons: 12, instructor: 'Budi Santoso' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Kursus Saya</h1>
        <p className="text-slate-500">Lanjutkan progres belajar Anda hari ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col group">
            <div className="h-40 bg-blue-600 p-8 flex items-end">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                <PlayCircle size={32} />
              </div>
            </div>
            <div className="p-8">
              <h3 className="font-black text-xl text-slate-800 mb-1">{course.title}</h3>
              <p className="text-sm text-slate-400 mb-6">Instruktur: {course.instructor}</p>
              
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span>Progres Belajar</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/dashboard/course/${course.id}`)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg shadow-slate-200"
              >
                Lanjutkan Materi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}