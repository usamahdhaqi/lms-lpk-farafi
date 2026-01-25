import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer, AlertCircle, CheckCircle2, XCircle, Loader2, ChevronRight, ChevronLeft, Award, Trophy } from 'lucide-react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState('start');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/api/quiz/${courseId}`);
        const formattedData = response.data.map(q => ({
          id: q.id,
          question: q.question,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correct: q.correct_option // Menggunakan 'a', 'b', 'c', 'd' sesuai database
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

  useEffect(() => {
    if (currentStep === 'ongoing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && currentStep === 'ongoing') {
      finishQuiz();
    }
  }, [currentStep, timeLeft]);

  const handleAnswer = (optionIndex) => {
    // 0 -> 'a', 1 -> 'b', 2 -> 'c', 3 -> 'd'
    const optionLetter = String.fromCharCode(97 + optionIndex); 
    setAnswers({ ...answers, [currentQuestion]: optionLetter });
  };

  const finishQuiz = async () => {
    let correctCount = 0;

    // Kita gunakan looping pada array questions
    questions.forEach((q, index) => {
      const jawabanSiswa = answers[index]; 
      const jawabanBenar = q.correct;   

      // Bandingkan secara langsung
      if (jawabanSiswa === jawabanBenar) {
        correctCount++;
      }
    });

    // Hitung Skor Akhir
    const totalSoal = questions.length;
    const finalScore = totalSoal > 0 ? Math.round((correctCount / totalSoal) * 100) : 0;


    const isPassed = finalScore >= 75;

    try {
      // Kirim ke database dengan nama kolom 'course_id' agar sinkron
      await api.post('/api/quiz/submit', {
        userId: user.id,
        course_id: courseId, 
        score: finalScore,
        isPassed: isPassed
      });

      setScore(finalScore);
      setCurrentStep('result');
    } catch (error) {
      console.error("Gagal simpan:", error);
      alert("Gagal menyimpan hasil ujian ke server.");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <div className="relative">
        <Loader2 className="animate-spin text-blue-600" size={50} />
        <div className="absolute inset-0 blur-xl bg-blue-400/20 animate-pulse"></div>
      </div>
      <p className="font-black text-slate-400 uppercase tracking-[0.2em] text-[10px]">Sinkronisasi Bank Soal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[3.5rem] shadow-[0_20px_70px_-15px_rgba(15,23,42,0.1)] overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px] animate-in zoom-in duration-500">
        
        {/* LEFT PANEL: INFO & PROGRESS */}
        <div className="w-full md:w-80 bg-slate-900 p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                    <Award size={24} />
                </div>
                <h2 className="text-2xl font-black leading-tight tracking-tighter uppercase mb-2">Final<br/>Assessment</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{user?.name}</p>
            </div>

            <div className="relative z-10 space-y-6">
                {currentStep === 'ongoing' && (
                    <>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Time Remaining</p>
                            <div className={`text-3xl font-black tabular-nums ${timeLeft < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Progress</p>
                            <div className="flex gap-1.5 flex-wrap">
                                {questions.map((_, i) => (
                                    <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                                        i === currentQuestion ? 'bg-blue-500 w-10' : answers[i] ? 'bg-green-500' : 'bg-white/10'
                                    }`} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* RIGHT PANEL: CONTENT */}
        <div className="flex-1 p-8 md:p-16 flex flex-col bg-white">
            
            {currentStep === 'start' && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner rotate-3">
                        <Trophy size={48} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none uppercase">Siap Mulai?</h1>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed italic">
                            Pastikan koneksi internet stabil. Ujian ini menentukan penerbitan sertifikat digital Anda.
                        </p>
                    </div>
                    <button 
                        onClick={() => setCurrentStep('ongoing')}
                        className="group relative bg-slate-900 text-white px-14 py-5 rounded-[2rem] font-black hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                    >
                        MULAI SEKARANG
                        <div className="absolute inset-0 rounded-[2rem] bg-blue-400 blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </button>
                </div>
            )}

            {currentStep === 'ongoing' && (
                <div className="h-full flex flex-col justify-between animate-in fade-in duration-300">
                    <div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 inline-block">
                            Question {currentQuestion + 1} of {questions.length}
                        </span>
                        <h2 className="text-2xl font-black text-slate-800 leading-tight mb-10 tracking-tight">
                            {questions[currentQuestion]?.question}
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {questions[currentQuestion]?.options.map((option, idx) => {
                                const optionLetter = String.fromCharCode(97 + idx);
                                const isSelected = answers[currentQuestion] === optionLetter;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`group relative w-full p-6 text-left border-2 rounded-2xl transition-all duration-300 flex items-center gap-5 ${
                                            isSelected 
                                            ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100/50 -translate-y-1' 
                                            : 'border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-md'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${
                                            isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 group-hover:bg-slate-100'
                                        }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`font-bold transition-colors ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-50">
                        <button 
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                            className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest disabled:opacity-0 transition-all hover:text-slate-800"
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        
                        {currentQuestion === questions.length - 1 ? (
                            <button 
                                onClick={finishQuiz}
                                className="bg-green-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-green-700 transition shadow-xl shadow-green-100 active:scale-95 text-xs tracking-widest uppercase"
                            >
                                Submit Final Exam
                            </button>
                        ) : (
                            <button 
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                                className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black hover:bg-blue-600 transition flex items-center gap-2 shadow-xl shadow-slate-200 active:scale-95 text-xs tracking-widest uppercase"
                            >
                                Next Question <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {currentStep === 'result' && (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-8 animate-in zoom-in duration-500">
                    <div className={`w-28 h-28 rounded-[3rem] flex items-center justify-center shadow-2xl ${
                        score >= 75 ? 'bg-green-100 text-green-600 shadow-green-100' : 'bg-red-100 text-red-500 shadow-red-100'
                    }`}>
                        {score >= 75 ? <Trophy size={56} /> : <XCircle size={56} />}
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">
                            {score >= 75 ? 'Assessment Passed' : 'Assessment Failed'}
                        </h2>
                        <p className="text-slate-400 font-medium text-sm">
                            {score >= 75 ? 'Selamat! Kompetensi Anda telah tervalidasi.' : 'Maaf, Anda belum mencapai batas skor kelulusan 75.'}
                        </p>
                    </div>

                    <div className="bg-slate-50 px-12 py-8 rounded-[2.5rem] border border-slate-100 relative group">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-slate-100 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                            Your Final Score
                        </div>
                        <h3 className={`text-7xl font-black ${score >= 75 ? 'text-blue-600' : 'text-red-500'}`}>
                            {score}
                        </h3>
                    </div>

                    <div className="pt-8 w-full space-y-4">
                        {score >= 75 ? (
                            <button 
                                onClick={() => navigate('/dashboard/certificates')}
                                className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
                            >
                                Claim Digital Certificate
                            </button>
                        ) : (
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black hover:bg-blue-600 transition-all uppercase tracking-widest text-xs"
                            >
                                Retake Assessment
                            </button>
                        )}
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="text-slate-400 font-black hover:text-slate-800 transition text-[10px] uppercase tracking-[0.2em]"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}