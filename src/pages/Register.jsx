import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCard, CheckCircle2, Loader2, ChevronLeft, AlertCircle, Wallet } from 'lucide-react';
import api from '../api/api';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Ambil ID kursus dari navigasi sebelumnya (Landing Page)
    const courseId = location.state?.courseId;
    
    if (courseId) {
      // Ambil detail kursus langsung dari database untuk memastikan harga terbaru
      const fetchCourseDetail = async () => {
        try {
          const response = await api.get(`/api/courses`);
          const found = response.data.find(c => c.id === courseId);
          if (found) setSelectedCourse(found);
        } catch (err) {
          console.error("Gagal mengambil detail kursus");
        }
      };
      fetchCourseDetail();
    } else {
      navigate('/');
    }
  }, [user, location, navigate]);

  const handlePaymentSubmit = async (method) => {
    setLoading(true);
    try {
        // Mengirim data user_id, course_id, dan payment_method secara dinamis
        const response = await api.post('/api/enrollments/add', {
            user_id: user.id,
            course_id: selectedCourse.id,
            payment_method: method
        });

        if (response.data.enrollmentId) {
            alert(`✅ Pesanan Berhasil!\n\nKursus: ${selectedCourse.title}\nMetode: ${method}\n\nSilakan cek Dashboard untuk instruksi pembayaran.`);
            navigate('/dashboard'); // Kembali ke dashboard setelah sukses
        }
    } catch (err) {
        // Menangkap pesan error "Sudah terdaftar" (400) dari backend
        const msg = err.response?.data?.message || "Gagal memproses pesanan";
        alert("❌ Error: " + msg);
    } finally {
        setLoading(false);
    }
  };

  if (!selectedCourse) return <div className="p-10 text-center font-bold">Menyiapkan Pesanan...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-blue-600 transition">
          <ChevronLeft size={20} /> Kembali
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="bg-slate-900 p-10 text-white">
            <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-2">Konfirmasi Pesanan</p>
            <h2 className="text-2xl font-black">{selectedCourse.title}</h2>
            <div className="mt-6 flex justify-between items-end border-t border-white/10 pt-6">
              <span className="text-slate-400">Total Pembayaran:</span>
              <span className="text-3xl font-black text-blue-400">
                Rp {Number(selectedCourse.price).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="p-10">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" /> Pilih Metode Pembayaran
            </h3>

            <div className="space-y-4">
              <button 
                disabled={loading}
                onClick={() => handlePaymentSubmit('Transfer Bank Manual')}
                className="w-full flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">Transfer Bank Manual</p>
                    <p className="text-xs text-slate-500">Konfirmasi manual oleh Admin</p>
                  </div>
                </div>
                <CheckCircle2 className="text-slate-200 group-hover:text-blue-500" />
              </button>
            </div>

            {loading && (
              <div className="mt-8 flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-blue-600" />
                <p className="text-xs font-bold text-slate-400">MEMPROSES TRANSAKSI...</p>
              </div>
            )}

            <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-dashed border-blue-200 flex gap-3">
              <AlertCircle className="text-blue-400 shrink-0" size={20} />
              <p className="text-[10px] text-blue-600 leading-relaxed font-medium">
                Setelah memilih metode, Anda akan diarahkan ke Dashboard. Kursus akan otomatis aktif setelah Admin memverifikasi pembayaran Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}