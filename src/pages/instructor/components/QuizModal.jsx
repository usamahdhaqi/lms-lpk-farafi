import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, HelpCircle, Save, 
  Loader2, CheckCircle2, AlertCircle, 
  ChevronDown, MessageSquarePlus 
} from 'lucide-react';
import api from '../../../api/api';

export default function QuizModal({ course, onClose }) {
  // --- STATE MANAGEMENT ---
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [noti, setNoti] = useState(null); // State notifikasi
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'a'
  });

  // --- NOTIFICATION HANDLER ---
  const showNotification = (message, type = 'success') => {
    setNoti({ message, type });
    setTimeout(() => setNoti(null), 3000); // Otomatis hilang dalam 3 detik
  };

  // --- API OPERATIONS ---
  const fetchQuestions = async () => {
    if (!course?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/instructor/quiz-questions/${course.id}`);
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal mengambil soal:", err);
      showNotification("Gagal memuat bank soal", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [course?.id]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      // Mengirim course_id string (misal: ADM-7510)
      await api.post('/api/instructor/quiz-questions', { 
        ...newQuestion, 
        course_id: course.id 
      });
      
      showNotification("Soal berhasil ditambahkan!");
      setNewQuestion({ 
        question: '', option_a: '', option_b: '', 
        option_c: '', option_d: '', correct_option: 'a' 
      });
      setShowAddForm(false);
      fetchQuestions();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Gagal menyimpan soal";
      showNotification(errorMsg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pertanyaan ini secara permanen?")) return;
    try {
      await api.delete(`/api/instructor/quiz-questions/${id}`);
      showNotification("Soal berhasil dihapus");
      fetchQuestions();
    } catch (err) {
      showNotification("Gagal menghapus soal", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop dengan Blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* --- TOAST NOTIFICATION --- */}
      {noti && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-5 duration-300 ${
          noti.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {noti.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="font-black text-sm uppercase tracking-widest">{noti.message}</span>
        </div>
      )}

      {/* --- MAIN MODAL CONTAINER --- */}
      <div className="relative bg-white w-full max-w-4xl h-[85vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="p-8 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">Bank Soal Kuis</h2>
              <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mt-1">{course?.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
          
          {/* Form Tambah Soal (Tampil jika showAddForm true) */}
          {showAddForm ? (
            <form onSubmit={handleAddQuestion} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block">Pertanyaan</label>
                <textarea 
                  className="w-full p-5 rounded-2xl border-none outline-none font-bold shadow-sm focus:ring-2 focus:ring-amber-500 transition-all"
                  placeholder="Tuliskan pertanyaan di sini..."
                  required
                  value={newQuestion.question}
                  onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <div key={opt}>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Opsi {opt.toUpperCase()}</label>
                    <input 
                      className="w-full p-4 rounded-xl border-none outline-none font-bold text-sm shadow-sm focus:ring-2 focus:ring-amber-400 transition-all"
                      placeholder={`Jawaban ${opt.toUpperCase()}...`}
                      required
                      value={newQuestion[`option_${opt}`]}
                      onChange={e => setNewQuestion({...newQuestion, [`option_${opt}`]: e.target.value})}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="w-full sm:w-auto">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block">Kunci Jawaban</label>
                  <select 
                    className="w-full sm:w-48 p-4 rounded-xl bg-white border-none outline-none font-black text-xs shadow-sm cursor-pointer"
                    value={newQuestion.correct_option}
                    onChange={e => setNewQuestion({...newQuestion, correct_option: e.target.value})}
                  >
                    <option value="a">OPSI A</option>
                    <option value="b">OPSI B</option>
                    <option value="c">OPSI C</option>
                    <option value="d">OPSI D</option>
                  </select>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 sm:flex-none px-8 py-4 text-slate-400 font-black uppercase text-xs"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 sm:flex-none px-8 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-xl shadow-amber-100 hover:bg-amber-600 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Save size={18} /> SIMPAN SOAL
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full py-6 border-2 border-dashed border-amber-200 rounded-[2.5rem] text-amber-600 font-black uppercase tracking-widest hover:bg-amber-50 hover:border-amber-400 transition-all flex items-center justify-center gap-3 group"
            >
              <MessageSquarePlus className="group-hover:scale-110 transition-transform" />
              Buat Pertanyaan Baru
            </button>
          )}

          {/* List Soal */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 className="animate-spin text-amber-500" size={40} />
              <p className="font-bold text-slate-400 uppercase text-xs tracking-widest">Sinkronisasi Soal...</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={q.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex justify-between items-start group hover:border-amber-200 transition-all shadow-sm">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xs">
                        {i + 1}
                      </span>
                      <p className="font-bold text-slate-800 text-lg leading-tight">{q.question}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['a', 'b', 'c', 'd'].map(opt => (
                        <div 
                          key={opt}
                          className={`p-3 rounded-xl text-[10px] font-black uppercase border transition-all ${
                            q.correct_option === opt 
                              ? 'bg-green-50 text-green-600 border-green-200' 
                              : 'bg-slate-50 text-slate-400 border-transparent'
                          }`}
                        >
                          <span className="opacity-50 mr-1">{opt}:</span> {q[`option_${opt}`]}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="ml-4 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : !showAddForm && (
            <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[3rem]">
              <p className="text-slate-400 font-bold">Bank soal masih kosong.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Total: {questions.length} Pertanyaan</span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-green-500" /> Database Terhubung
          </span>
        </div>
      </div>
    </div>
  );
}