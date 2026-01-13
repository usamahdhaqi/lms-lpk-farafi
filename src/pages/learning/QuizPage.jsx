import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer, AlertCircle, CheckCircle2, XCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State Kuis
  const [currentStep, setCurrentStep] = useState('start'); // 'start', 'ongoing', 'result'
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 menit
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  // Ambil data soal asli dari Database
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/api/quiz/${courseId}`);
        // Transformasi data database ke format state
        const formattedData = response.data.map(q => ({
          id: q.id,
          question: q.question,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correct: q.correct_option
        }));
        setQuestions(formattedData);
      } catch (error) {
        console.error("Gagal mengambil soal ujian:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [courseId]);

  // Logika Timer
  useEffect(() => {
    if (currentStep === 'ongoing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && currentStep === 'ongoing') {
      finishQuiz();
    }
  }, [currentStep, timeLeft]);

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const finishQuiz = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const isPassed = finalScore >= 75;

    try {
      // Pastikan menggunakan 'course_id' bukan 'courseId' agar sinkron dengan index.js
      await api.post('/api/quiz/submit', {
        userId: user.id,
        course_id: courseId, 
        score: finalScore,
        isPassed: isPassed
      });

      setScore(finalScore);
      setCurrentStep('result');
    } catch (error) {
      console.error("Gagal menyimpan hasil kuis ke database:", error);
      alert("Terjadi kesalahan saat menyimpan nilai. Silakan coba lagi.");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500">Menyiapkan soal ujian...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
        
        {/* STEP 1: START SCREEN */}
        {currentStep === 'start' && (
          <div className="p-12 text-center space-y-8">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
              <AlertCircle size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Ujian Akhir Kompetensi</h1>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                Anda memiliki waktu <span className="font-bold text-slate-800">10 menit</span> untuk menyelesaikan {questions.length} soal pilihan ganda. 
                Minimal kelulusan adalah <span className="font-bold text-blue-600">75</span>.
              </p>
            </div>
            <button 
              onClick={() => setCurrentStep('ongoing')}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-blue-600 transition shadow-xl"
            >
              Mulai Ujian Sekarang
            </button>
          </div>
        )}

        {/* STEP 2: ONGOING QUIZ */}
        {currentStep === 'ongoing' && (
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black">
                  {currentQuestion + 1}
                </span>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Soal dari {questions.length}</p>
              </div>
              <div className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2 rounded-full font-black text-sm border border-red-100">
                <Timer size={18} className="animate-pulse" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-800 mb-8 leading-snug">
              {questions[currentQuestion]?.question}
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion]?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-6 text-left border-2 rounded-2xl transition-all font-bold text-sm ${
                    answers[currentQuestion] === idx 
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md translate-x-2' 
                    : 'border-slate-50 hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${
                      answers[currentQuestion] === idx ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-100'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button 
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="flex items-center gap-2 text-slate-400 font-bold disabled:opacity-0 transition"
              >
                <ChevronLeft size={20} /> Sebelumnya
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button 
                  onClick={finishQuiz}
                  className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-lg shadow-green-100"
                >
                  Selesaikan Ujian
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition flex items-center gap-2"
                >
                  Selanjutnya <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: RESULT SCREEN */}
        {currentStep === 'result' && (
          <div className="p-12 text-center space-y-6">
            {score >= 75 ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={56} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Selamat, Anda Lulus!</h2>
                  <p className="text-slate-500 mt-2">Anda telah menunjukkan kompetensi yang luar biasa.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Akhir</p>
                  <h3 className="text-6xl font-black text-blue-600">{score}</h3>
                </div>
                <div className="pt-6 space-y-3">
                  <button 
                    onClick={() => navigate('/dashboard/certificates')}
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition"
                  >
                    Klaim Sertifikat Digital
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="text-slate-400 font-bold hover:text-slate-600 transition text-sm">Kembali ke Dashboard</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <XCircle size={56} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Maaf, Anda Gagal</h2>
                  <p className="text-slate-500 mt-2">Skor Anda belum mencapai ambang batas kelulusan 75.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Anda</p>
                  <h3 className="text-6xl font-black text-red-600">{score}</h3>
                </div>
                <div className="pt-6 space-y-3">
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition"
                  >
                    Ulangi Ujian (Remedial)
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="text-slate-400 font-bold hover:text-slate-600 transition text-sm">Kembali ke Dashboard</button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}