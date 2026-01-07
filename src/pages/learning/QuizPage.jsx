import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { quizService } from '../../api/quizService';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State Kuis
  const [currentStep, setCurrentStep] = useState('start'); // 'start', 'ongoing', 'result'
  const [timeLeft, setTimeLeft] = useState(600); // 10 menit (SRS 3.B: Timer)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  // Data Soal Mockup (SRS 3.B: Pilihan Ganda)
  const questions = [
    {
      id: 1,
      question: "Apa fungsi utama dari sistem operasi?",
      options: ["Desain Grafis", "Mengelola Sumber Daya Hardware", "Mengetik Dokumen", "Membuat Animasi"],
      correct: 1
    ,},
    {
      id: 2,
      question: "Manakah yang termasuk perangkat keras input?",
      options: ["Monitor", "Printer", "Keyboard", "Speaker"],
      correct: 2
    },
    // Tambahkan soal lainnya sesuai bank soal instruktur
  ];

  // Logika Timer (SRS 4.2: Performa & Batasan Waktu)
  useEffect(() => {
    if (currentStep === 'ongoing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      finishQuiz();
    }
  }, [currentStep, timeLeft]);

  const startQuiz = () => setCurrentStep('ongoing');

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const finishQuiz = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
        if (answers[index] === q.correct) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setCurrentStep('result');

    try {
        // 2. Bandingkan skor dengan min_score (75) di Backend
        await quizService.submitResult(courseId, finalScore);
        
            if (finalScore >= 75) {
            console.log("Status di MySQL: is_passed = true");
            }
        } catch (error) {
            console.error("Gagal mengirim nilai kuis:", error);
        }
    };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* STEP 1: START SCREEN */}
        {currentStep === 'start' && (
          <div className="p-10 text-center">
            <h1 className="text-3xl font-bold mb-4">Ujian Akhir Kursus</h1>
            <p className="text-gray-600 mb-8">
              Pastikan koneksi internet stabil. Anda memiliki waktu 10 menit untuk menyelesaikan {questions.length} soal. 
              Minimal nilai kelulusan adalah <span className="font-bold text-blue-600">75</span>.
            </p>
            <button 
              onClick={startQuiz}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
            >
              Mulai Ujian Sekarang
            </button>
          </div>
        )}

        {/* STEP 2: ONGOING QUIZ */}
        {currentStep === 'ongoing' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 bg-blue-50 p-4 rounded-2xl">
              <span className="font-medium text-blue-700">Soal {currentQuestion + 1} dari {questions.length}</span>
              <div className="flex items-center text-red-600 font-bold">
                <Timer size={20} className="mr-2" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 text-left border-2 rounded-2xl transition ${
                    answers[currentQuestion] === idx 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-10 flex justify-between">
              <button 
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                className="text-gray-500 font-medium disabled:opacity-30"
              >
                Sebelumnya
              </button>
              
              {currentQuestion === questions.length - 1 ? (
                <button 
                  onClick={finishQuiz}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold"
                >
                  Selesaikan Ujian
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
                >
                  Selanjutnya
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: RESULT SCREEN (Logika Kelulusan ) */}
        {currentStep === 'result' && (
          <div className="p-10 text-center">
            {score >= 75 ? (
              <>
                <div className="flex justify-center mb-6 text-green-500">
                  <CheckCircle2 size={80} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Selamat, Anda Lulus!</h2>
                <p className="text-gray-600 mt-2">Skor Anda: <span className="text-2xl font-bold text-green-600">{score}</span></p>
                <div className="mt-8 space-y-3">
                  <button 
                    onClick={() => navigate('/dashboard/certificates')}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
                  >
                    Klaim Sertifikat Anda
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="text-gray-500">Kembali ke Dashboard</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6 text-red-500">
                  <XCircle size={80} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Mohon Maaf, Anda Gagal</h2>
                <p className="text-gray-600 mt-2">Skor Anda: <span className="text-2xl font-bold text-red-600">{score}</span></p>
                <p className="text-sm text-gray-500 mt-4">Batas minimal kelulusan adalah 75. Silakan pelajari kembali materi.</p>
                <div className="mt-8 space-y-3">
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold"
                  >
                    Ulangi Ujian (Remedial)
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="text-gray-500">Pelajari Materi Lagi</button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}