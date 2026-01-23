import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, PlayCircle, FileText, CheckCircle2, 
  Lock, ChevronDown, ChevronUp, Loader2, ArrowRight, X 
} from 'lucide-react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function CourseContent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCurriculum, setShowCurriculum] = useState(false);
  
  // State untuk Modal Notifikasi
  const [showModal, setShowModal] = useState(false);
  const [nextLesson, setNextLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/api/courses/${courseId}/lessons?userId=${user.id}`);
        setLessons(res.data);
        const initial = res.data.find(l => !l.isCompleted) || res.data[0];
        setActiveLesson(initial);
      } catch (err) {
        console.error("Gagal memuat materi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchLessons();
  }, [courseId, user]);

  const handleComplete = async (lessonId) => {
    try {
      // Mengirim data ke API yang nantinya akan masuk ke tabel student_progress
      await api.post('/api/progress/complete', { 
        userId: user.id, 
        lessonId, 
        courseId 
      });
      
      // Update status materi secara lokal menggunakan angka 1 (sesuai database)
      const updatedLessons = lessons.map((l) => {
        if (l.id === lessonId) return { ...l, isCompleted: 1 }; //
        return l;
      });
      setLessons(updatedLessons);

      const currentIndex = updatedLessons.findIndex(l => l.id === lessonId);
      const next = updatedLessons[currentIndex + 1];
      
      setNextLesson(next || null);
      setShowModal(true);

    } catch (err) {
      alert("Gagal menyimpan progres ke database.");
    }
  };

  const goToNextLesson = () => {
    if (nextLesson) {
      setActiveLesson(nextLesson);
      setShowModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500">Menyiapkan ruang belajar...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 font-bold hover:text-blue-600 transition">
          <ChevronLeft size={20} /> <span className="hidden md:inline">Dashboard</span>
        </button>
        <h2 className="text-sm font-bold text-slate-800 line-clamp-1">{activeLesson?.title}</h2>
        <div className="w-10 md:w-40"></div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* Konten Utama (Video/PDF/Quiz) */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          {activeLesson?.type === 'video' ? (
            <div className="aspect-video bg-black">
              <iframe width="100%" height="100%" src={activeLesson.content_url} frameBorder="0" allowFullScreen></iframe>
            </div>
          ) : activeLesson?.type === 'pdf' ? (
            <div className="p-12 md:p-24 text-center space-y-6">
              <FileText size={60} className="mx-auto text-red-500" />
              <h3 className="text-xl font-black text-slate-800">{activeLesson.title}</h3>
              <a href={activeLesson.content_url} target="_blank" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold">Buka PDF</a>
            </div>
          ) : (
            <div className="p-12 md:p-24 text-center space-y-6">
              <CheckCircle2 size={60} className="mx-auto text-amber-500" />
              <h3 className="text-2xl font-black text-slate-800">Ujian Akhir</h3>
              <button onClick={() => navigate(`/dashboard/course/${courseId}/quiz`)} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black">Mulai Ujian</button>
            </div>
          )}

          {activeLesson?.type !== 'quiz' && (
            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <button 
                onClick={() => handleComplete(activeLesson.id)}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                Tandai Selesai & Lanjut <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
        
        {/* Accordion Daftar Materi dengan Logika Database */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
            <button onClick={() => setShowCurriculum(!showCurriculum)} className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition">
                <span className="font-black text-slate-800 uppercase tracking-tight">Daftar Materi Pelatihan</span>
                {showCurriculum ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showCurriculum && (
                <div className="p-8 pt-0 space-y-2 bg-slate-50/30">
                {lessons.map((lesson, index) => {
                    // Logika: Terbuka jika ini materi pertama ATAU materi sebelumnya is_completed = 1
                    const isPreviousCompleted = index === 0 || lessons[index - 1].isCompleted === 1; //
                    
                    return (
                    <button 
                        key={lesson.id} 
                        disabled={!isPreviousCompleted} 
                        onClick={() => setActiveLesson(lesson)} 
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border 
                            ${activeLesson?.id === lesson.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border-slate-100'} 
                            ${!isPreviousCompleted ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xs opacity-50 font-bold">{index + 1}.</span>
                            <span className="text-sm font-bold">{lesson.title}</span>
                        </div>
                        {/* Cek status dari tabel student_progress */}
                        {lesson.isCompleted === 1 ? (
                            <CheckCircle2 size={18} className="text-green-400" />
                        ) : isPreviousCompleted ? (
                            <PlayCircle size={18} />
                        ) : (
                            <Lock size={18} />
                        )}
                    </button>
                    );
                })}
                </div>
            )}
        </div>
      </main>

      {/* MODAL NOTIFIKASI */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={24} /></button>
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Materi Selesai!</h3>
              <p className="text-slate-500 text-sm">Bagus! Anda telah menyelesaikan bagian ini. Apakah ingin lanjut ke materi berikutnya?</p>
              
              <div className="pt-6 space-y-3">
                <button 
                  onClick={goToNextLesson}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
                >
                  {nextLesson ? 'Lanjut ke Materi Berikutnya' : 'Selesai & Ke Dashboard'}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Tetap di Sini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}