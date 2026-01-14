import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, HelpCircle, Save, X, Loader2, 
  CheckCircle2, AlertCircle, ChevronLeft 
} from 'lucide-react';
import api from '../../api/api';

export default function QuizBank() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 0 // 0=A, 1=B, 2=C, 3=D
  });

  useEffect(() => {
    fetchQuestions();
  }, [courseId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get(`/api/instructor/quiz-questions/${courseId}`);
      setQuestions(response.data);
    } catch (err) {
      console.error("Gagal memuat soal");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/instructor/quiz-questions', {
        ...newQuestion,
        course_id: courseId
      });
      setShowAddForm(false);
      setNewQuestion({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 0 });
      fetchQuestions();
    } catch (err) {
      alert("Gagal menyimpan soal");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus soal ini?")) return;
    try {
      await api.delete(`/api/instructor/quiz-questions/${id}`);
      fetchQuestions();
    } catch (err) {
      alert("Gagal menghapus soal");
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full border border-slate-100 shadow-sm">
          <ChevronLeft />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bank Soal Ujian</h1>
          <p className="text-slate-500 font-medium italic">ID Kursus: {courseId}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8">
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-3"
        >
          <Plus size={20} /> TAMBAH SOAL BARU KE BANK DATA
        </button>

        <div className="mt-10 space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
              <button 
                onClick={() => handleDelete(q.id)}
                className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
              <div className="flex gap-4">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black shrink-0">
                  {idx + 1}
                </span>
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-lg pr-10">{q.question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => (
                      <div key={i} className={`p-4 rounded-xl border text-sm font-bold ${i === q.correct_option ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-500'}`}>
                        <span className="mr-2 uppercase">{String.fromCharCode(65 + i)}.</span> {opt}
                        {i === q.correct_option && <CheckCircle2 size={16} className="inline ml-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FORM TAMBAH SOAL */}
      {showAddForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <HelpCircle className="text-blue-600" /> Form Input Soal Baru
              </h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-50 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSaveQuestion} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pertanyaan</label>
                <textarea 
                  required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition font-bold min-h-[100px]"
                  value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['a', 'b', 'c', 'd'].map((char, i) => (
                  <div key={char} className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pilihan {char.toUpperCase()}</label>
                    <input 
                      type="text" required className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition font-bold"
                      value={newQuestion[`option_${char}`]} onChange={e => setNewQuestion({...newQuestion, [`option_${char}`]: e.target.value})}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jawaban Benar</label>
                <select 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition font-bold"
                  value={newQuestion.correct_option} onChange={e => setNewQuestion({...newQuestion, correct_option: parseInt(e.target.value)})}
                >
                  <option value={0}>Pilihan A</option>
                  <option value={1}>Pilihan B</option>
                  <option value={2}>Pilihan C</option>
                  <option value={3}>Pilihan D</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-700 transition flex items-center justify-center gap-3">
                <Save size={20} /> SIMPAN KE BANK SOAL
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}