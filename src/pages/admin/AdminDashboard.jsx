import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Users, CreditCard, Search, Loader2, 
  AlertCircle, Mail, BookOpen, RefreshCw, BarChart3, 
  GraduationCap, Award, TrendingUp, PlusCircle, Trash2, Edit3
} from 'lucide-react';
import api from '../../api/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('payments');
  const [pendingPayments, setPendingPayments] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ totalPending: 0, totalRevenue: 0, avgProgress: 0 });

  // --- STATE BARU UNTUK MANAJEMEN KURSUS ---
  const [instructors, setInstructors] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // Daftar kursus untuk list
  const [editingCourseId, setEditingCourseId] = useState(null); // Penanda mode edit
  const [newCourse, setNewCourse] = useState({
    title: '', description: '', price: '', instructor_id: '', image_url: '', category: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, progRes, instRes, courseRes] = await Promise.all([
        api.get('/api/admin/pending-payments'),
        api.get('/api/admin/student-progress'),
        api.get('/api/admin/instructors'),
        api.get('/api/courses') // Ambil katalog kursus
      ]);

      setPendingPayments(payRes.data);
      setStudentProgress(progRes.data);
      setInstructors(instRes.data);
      setAllCourses(courseRes.data);
      
      const revenue = payRes.data.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
      const avgProg = progRes.data.length > 0 
        ? progRes.data.reduce((acc, curr) => acc + curr.progress_percentage, 0) / progRes.data.length 
        : 0;

      setStats({
        totalPending: payRes.data.length,
        totalRevenue: revenue,
        avgProgress: Math.round(avgProg)
      });
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (enrollmentId, studentName) => {
    if (!window.confirm(`Setujui akses kursus untuk ${studentName}?`)) return;
    try {
      await api.post(`/api/payments/verify/${enrollmentId}`);
      alert("✅ Verifikasi berhasil!");
      fetchData();
    } catch (error) {
      alert("❌ Gagal memverifikasi.");
    }
  };

  // --- FUNGSI CREATE ATAU UPDATE KURSUS ---
  const handleSubmitCourse = async (e) => {
    e.preventDefault();

    // Membangun data yang akan dikirim ke server
    const payload = {
      title: newCourse.title,           // Judul kursus
      description: newCourse.description, // Deskripsi lengkap
      price: Number(newCourse.price),   // Memastikan harga dikirim sebagai angka
      instructor_id: newCourse.instructor_id, // ID pengajar dari dropdown
      category: newCourse.category,     // Kategori untuk generate ID (COMP/TEK)
      image_url: newCourse.image_url    // URL gambar/thumbnail
    };

    try {
      if (editingCourseId) {
        // Jika sedang dalam mode edit, kirim ke endpoint PUT
        await api.put(`/api/admin/courses/${editingCourseId}`, payload);
        alert("✅ Kursus Berhasil Diperbarui!");
      } else {
        // Jika kursus baru, kirim ke endpoint POST untuk generate ID
        await api.post('/api/admin/courses', payload);
        alert("✅ Kursus Berhasil Ditambahkan!");
      }
      
      // Reset form ke keadaan kosong setelah sukses
      setNewCourse({ 
        title: '', 
        description: '', 
        price: '', 
        instructor_id: '', 
        image_url: '', 
        category: '' 
      });
      
      setEditingCourseId(null); // Keluar dari mode edit
      fetchData(); // Muat ulang data untuk memperbarui list
      
    } catch (error) {
      console.error("Error saat menyimpan kursus:", error);
      alert("❌ Gagal memproses data kursus. Periksa konsol untuk detail.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Hapus kursus ini secara permanen?")) return;
    try {
      await api.delete(`/api/admin/courses/${courseId}`);
      alert("✅ Kursus dihapus!");
      fetchData();
    } catch (error) {
      alert("❌ Gagal menghapus kursus.");
    }
  };

  const filteredPayments = pendingPayments.filter(p => 
    p.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProgress = studentProgress.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
          <p className="text-slate-500 mt-2 font-medium">Manajemen pembayaran dan pemantauan akademik LPK FARAFI.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl shadow-blue-200 flex items-center gap-4">
             <TrendingUp size={24} />
             <div>
                <p className="text-[10px] font-bold uppercase opacity-80">Rata-rata Progres</p>
                <p className="text-xl font-black">{stats.avgProgress}%</p>
             </div>
          </div>
          <button onClick={fetchData} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:bg-slate-50 transition">
            <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[2rem] w-fit">
        <button onClick={() => setActiveTab('payments')} className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'payments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Verifikasi Pembayaran ({stats.totalPending})
        </button>
        <button onClick={() => setActiveTab('monitoring')} className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'monitoring' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          Monitoring Siswa
        </button>
        <button onClick={() => setActiveTab('add_course')} className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeTab === 'add_course' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
          Manajemen Kursus
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
        ) : (
          <div>
            {activeTab === 'payments' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-8">Siswa</th>
                      <th className="p-8">Pelatihan</th>
                      <th className="p-8">Metode & Harga</th>
                      <th className="p-8 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">{p.student_name[0]}</div>
                            <div>
                              <p className="font-bold text-slate-800">{p.student_name}</p>
                              <p className="text-xs text-slate-400">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 font-medium">{p.course_title}</td>
                        <td className="p-8">
                          <p className="text-sm font-bold text-blue-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{p.payment_method}</p>
                        </td>
                        <td className="p-8 flex justify-center">
                          <button onClick={() => handleVerify(p.id, p.student_name)} className="bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-green-600 transition shadow-lg shadow-green-100">SETUJUI</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-8">Siswa & Kursus</th>
                      <th className="p-8">Progres Belajar</th>
                      <th className="p-8">Nilai Kuis</th>
                      <th className="p-8">Status Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProgress.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-8">
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-xs text-blue-500 font-medium">{p.course_title}</p>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 transition-all" style={{ width: `${p.progress_percentage}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-slate-700">{p.progress_percentage}%</span>
                          </div>
                        </td>
                        <td className="p-8">
                          <p className={`text-sm font-black ${p.quiz_score >= 75 ? 'text-green-600' : 'text-slate-400'}`}>
                            {p.quiz_score || 0} / 100
                          </p>
                        </td>
                        <td className="p-8">
                          {p.is_passed ? (
                            <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase">
                              <Award size={14} /> Lulus & Bersertifikat
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[10px] font-black uppercase">Dalam Proses</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- TAB MANAJEMEN KURSUS (DUAL MODE: LIST & FORM) --- */}
            {activeTab === 'add_course' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 divide-x divide-slate-100">
                {/* Bagian Form (Kiri) */}
                <div className="lg:col-span-2 p-10 bg-slate-50/50">
                  <div className="sticky top-10">
                    <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                      {editingCourseId ? <RefreshCw className="text-amber-500" /> : <PlusCircle className="text-blue-600" />}
                      {editingCourseId ? "Edit Kursus" : "Tambah Kursus"}
                    </h2>
                    <form onSubmit={handleSubmitCourse} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Nama Kursus</label>
                        <input required type="text" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                          value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Harga (Rp)</label>
                        <input required type="number" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                          value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Pilih Instruktur</label>
                        <select required className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white"
                          value={newCourse.instructor_id} onChange={e => setNewCourse({...newCourse, instructor_id: e.target.value})}>
                          <option value="">-- Pilih Instruktur --</option>
                          {instructors.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Deskripsi</label>
                        <textarea className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold h-24"
                          value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Kategori Pelatihan</label>
                        <select 
                          required 
                          className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold bg-white"
                          value={newCourse.category} 
                          onChange={e => setNewCourse({...newCourse, category: e.target.value})}
                        >
                          <option value="">-- Pilih Kategori --</option>
                          <option value="Administrasi">Administrasi (ADM)</option>
                          <option value="RPL">Rekayasa Perangkat Lunak (PROG)</option>
                          <option value="Desain Grafis">Desain Grafis (DSGN)</option>
                          <option value="Drone">Drone (DRN)</option>
                          <option value="Komputer">Komputer (COMP)</option>
                          <option value="Teknisi">Teknisi (TEK)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button type="submit" className={`w-full ${editingCourseId ? 'bg-amber-500' : 'bg-blue-600'} text-white py-5 rounded-[2rem] font-black shadow-xl transition active:scale-95`}>
                          {editingCourseId ? "SIMPAN PERUBAHAN" : "PUBLIKASIKAN KURSUS"}
                        </button>
                        {editingCourseId && (
                          <button type="button" onClick={() => { setEditingCourseId(null); setNewCourse({title:'', description:'', price:'', instructor_id:'', image_url:''}); }} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition">Batal Edit</button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* Bagian List Kursus (Kanan) */}
                <div className="lg:col-span-3 p-10 space-y-4">
                  <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-6">Daftar Kursus LPK FARAFI</h3>
                  <div className="grid gap-4">
                    {allCourses.map(course => (
                      <div key={course.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:border-blue-500 transition-all duration-300 shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">
                            {course.id.toString().substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-base">{course.title}</p>
                            <p className="text-[10px] font-black text-blue-600 uppercase">
                              Rp {Number(course.price).toLocaleString('id-ID')} • 
                              <span className="text-slate-400"> Ins: {course.instructor_name || 'N/A'}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            setEditingCourseId(course.id);
                            setNewCourse({
                              title: course.title,
                              description: course.description,
                              price: course.price,
                              instructor_id: course.instructor_id,
                              image_url: course.image_url
                            });
                          }} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"><Edit3 size={16} /></button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}