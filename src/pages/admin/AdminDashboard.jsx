import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Users, Layers, PlusCircle, RefreshCw, 
  Loader2, ArrowRight, CheckCircle2, AlertTriangle, Pencil, 
  Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

// Import Komponen Terpisah
import StatsBento from './components/StatsBento';
import CourseModal from './components/CourseModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState('payments');
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

  // --- DATA STATES ---
  const [studentProgress, setStudentProgress] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [stats, setStats] = useState({ totalPending: 0, totalRevenue: 0, avgProgress: 0 });
  
  // --- FORM STATES ---
  const [editingId, setEditingId] = useState(null);
  const [courseData, setCourseData] = useState({ 
    title: '', description: '', price: '', instructor_id: '', category: '' 
  });

  // --- FUNGSI AMBIL DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, progRes, instRes, courseRes] = await Promise.all([
        api.get('/api/admin/pending-payments'),
        api.get('/api/admin/student-progress'),
        api.get('/api/admin/instructors'),
        api.get('/api/courses')
      ]);

      setStudentProgress(progRes.data);
      setInstructors(instRes.data);
      setAllCourses(courseRes.data);
      
      setStats({
        totalPending: payRes.data.length,
        totalRevenue: payRes.data.reduce((acc, curr) => acc + Number(curr.price || 0), 0),
        avgProgress: Math.round(progRes.data.length > 0 ? 
          progRes.data.reduce((acc, curr) => acc + curr.progress_percentage, 0) / progRes.data.length : 0)
      });
    } catch (error) {
      showToast("Gagal sinkronisasi data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, open: false })), 3000);
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setCourseData({ title: '', description: '', price: '', instructor_id: '', category: '' });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (course) => {
    setEditingId(course.id);
    setCourseData({
      title: course.title,
      description: course.description,
      price: course.price,
      instructor_id: course.instructor_id,
      category: course.category || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/admin/courses/${editingId}`, courseData);
        showToast("Kursus berhasil diperbarui");
      } else {
        await api.post('/api/admin/courses', courseData);
        showToast("Kursus baru berhasil diterbitkan");
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      showToast("Gagal memproses data", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/courses/${deleteModal.id}`);
      showToast("Materi telah dihapus");
      setDeleteModal({ open: false, id: null, name: '' });
      fetchData();
    } catch (error) {
      // 1. Cek apakah server mengirimkan status 500 atau 400 (Constraint Error)
      const isConstraintError = error.response?.status === 500 || error.response?.status === 400;
      
      // 2. Tentukan pesan yang lebih ramah pengguna
      const errorMessage = isConstraintError 
        ? "Gagal: Kursus tidak bisa dihapus karena masih ada siswa yang terdaftar atau materi di dalamnya."
        : "Gagal menghapus materi. Silakan coba lagi nanti.";

      // 3. Tampilkan toast dengan pesan tersebut
      showToast(errorMessage, "error");
      
      // Log detail untuk kebutuhan debugging di konsol
      console.error("Delete Error:", error.response?.data || error.message);
      
      // Tutup modal agar tidak menutupi notifikasi
      setDeleteModal({ open: false, id: null, name: '' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 lg:space-y-10 pb-20 px-4 animate-in fade-in duration-700 mt-4 lg:mt-8">
      
      {/* 1. Statistik (Adaptif) */}
      <StatsBento stats={stats} />

      {/* 2. Top Bar & Navigasi (Sticky on Mobile) */}
      <div className="sticky top-4 z-[40] flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white/80 backdrop-blur-xl p-2 lg:p-3 rounded-3xl lg:rounded-[3rem] border border-white shadow-xl">
        <div className="flex gap-1 bg-slate-100/50 p-1 rounded-full overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'payments', label: `Verifikasi (${stats.totalPending})`, icon: <CreditCard size={14}/> },
            { id: 'monitoring', label: 'Monitoring', icon: <Users size={14}/> },
            { id: 'add_course', label: 'Kursus', icon: <Layers size={14}/> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 lg:px-8 py-2.5 lg:py-3 rounded-full font-bold text-[11px] lg:text-sm transition-all whitespace-nowrap
                ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between lg:justify-end gap-2 px-2 lg:px-0">
          {activeTab === 'add_course' && (
            <button 
              onClick={handleOpenAddForm}
              className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 text-white rounded-full font-black text-[10px] shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest"
            >
              <PlusCircle size={16} className="inline mr-2" /> Tambah
            </button>
          )}
          <button onClick={fetchData} className="p-3 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-blue-600 transition-all">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-[9px]">Sinkronisasi Sistem...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {/* Tab: Verifikasi Pembayaran */}
            {activeTab === 'payments' && (
              <div className="p-10 lg:p-20 flex flex-col items-center text-center">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-blue-50 text-blue-600 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center mb-6 lg:mb-8 shadow-inner">
                  <CreditCard size={48} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight italic uppercase leading-tight">Verifikasi Pembayaran</h3>
                <p className="text-slate-500 mt-3 max-w-sm text-base lg:text-lg font-medium">
                  Terdapat <span className="text-blue-600 font-bold">{stats.totalPending} transaksi</span> baru menunggu tindakan.
                </p>
                <button 
                  onClick={() => navigate('/admin/payments')}
                  className="mt-8 lg:mt-10 group inline-flex items-center justify-center px-8 py-4 lg:px-10 lg:py-5 font-black text-white bg-blue-600 rounded-full shadow-2xl hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px] lg:text-xs italic"
                >
                  Buka Panel Verifikasi <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}

            {/* Tab: Monitoring (Responsive Table & Card) */}
            {activeTab === 'monitoring' && (
              <div className="p-4 lg:p-8">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                        <th className="px-8 py-4 text-left">Siswa & Kursus</th>
                        <th className="px-8 py-4 text-left">Progres</th>
                        <th className="px-8 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentProgress.map(p => (
                        <tr key={p.id} className="bg-slate-50/50 hover:bg-blue-50/50 transition-all">
                          <td className="px-8 py-6 rounded-l-[2rem]">
                            <p className="font-black text-slate-800 italic uppercase text-sm">{p.name}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">{p.course_title}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-white rounded-full overflow-hidden border border-slate-100">
                                   <div className="h-full bg-blue-600" style={{ width: `${p.progress_percentage}%` }}></div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500">{p.progress_percentage}%</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 rounded-r-[2rem] text-right">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${p.is_passed ? 'text-emerald-500' : 'text-slate-300'}`}>
                               {p.is_passed ? 'Lulus' : 'Belajar'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (Card Style) */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                  {studentProgress.map(p => (
                    <div key={p.id} className="bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-black text-slate-800 uppercase italic text-xs">{p.name}</p>
                          <p className="text-[9px] font-bold text-blue-500 uppercase">{p.course_title}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase ${p.is_passed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                           {p.is_passed ? 'Lulus' : 'Siswa'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${p.progress_percentage}%` }}></div>
                         </div>
                         <span className="text-[10px] font-black text-slate-500">{p.progress_percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Manajemen Kursus */}
            {activeTab === 'add_course' && (
              <div className="p-6 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {allCourses.map(course => (
                    <div key={course.id} className="group bg-white border border-slate-100 p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] hover:border-blue-500 hover:shadow-2xl transition-all duration-500 relative">
                      
                      <div className="flex justify-between items-start mb-6 lg:mb-8">
                        {/* ID / Badge Kursus */}
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-black text-xs uppercase italic group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                          {course.id.toString().padStart(2, '0').substring(0, 2)}
                        </div>

                        {/* Tombol Aksi yang Diperbarui */}
                        <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-y-2 lg:group-hover:translate-y-0">
                          <button 
                            onClick={() => handleOpenEditForm(course)} 
                            className="p-3 text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm hover:shadow-amber-200"
                            title="Edit Kursus"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteModal({ open: true, id: course.id, name: course.title })} 
                            className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                            title="Hapus Kursus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-black text-slate-800 text-base lg:text-lg uppercase italic group-hover:text-blue-600 transition-colors leading-tight min-h-[3rem]">
                        {course.title}
                      </h4>
                      
                      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Harga Kursus</span>
                            <p className="text-blue-600 font-black text-sm lg:text-base">Rp {Number(course.price).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block">Instruktur</span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{course.instructor_name || 'Staff'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals & Toasts */}
      <CourseModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSubmitCourse}
        editingId={editingId}
        data={courseData}
        setData={setCourseData}
        instructors={instructors}
      />

      <ConfirmDeleteModal 
        isOpen={deleteModal.open}
        targetName={deleteModal.name}
        onClose={() => setDeleteModal({ open: false, id: null, name: '' })}
        onConfirm={handleDelete}
      />

      {toast.open && (
        <div className={`fixed bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 px-6 lg:px-8 py-3 lg:py-4 rounded-full shadow-2xl animate-in slide-in-from-bottom-10 duration-500 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={18} /> : <AlertTriangle size={18} />}
          <p className="font-black uppercase italic tracking-widest text-[10px] lg:text-[11px] whitespace-nowrap">{toast.message}</p>
        </div>
      )}

    </div>
  );
}