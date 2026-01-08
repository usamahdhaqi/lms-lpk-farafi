import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, 
  CheckCircle2, 
  Loader2, 
  ChevronLeft,
  AlertCircle,
  Wallet,
  ShieldCheck
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Daftar harga kursus (Sinkronkan dengan Landing.jsx)
  const coursesData = {
    'comp-001': { title: 'Pelatihan Operator Komputer Dasar', price: 'Rp 500.000' },
    'hp-001': { title: 'Teknisi Handphone', price: 'Rp 750.000' }
  };

  useEffect(() => {
    // Jika user belum login, lempar balik ke login
    if (!user) {
      navigate('/login');
      return;
    }

    // Ambil ID kursus dari state router (kiriman dari Landing/Login)
    const courseId = location.state?.courseId;
    if (courseId && coursesData[courseId]) {
      setSelectedCourse({ id: courseId, ...coursesData[courseId] });
    } else {
      // Jika tidak ada kursus yang dipilih, balik ke landing
      navigate('/');
    }
  }, [user, location, navigate]);

  const handlePaymentSubmit = async (method) => {
    setLoading(true);
    try {
      // Simulasi proses integrasi pembayaran
      // Di sini nantinya Anda memanggil paymentService.checkout(selectedCourse.id)
      
      alert(`✅ Pesanan Berhasil Dibuat!\n\nKursus: ${selectedCourse.title}\nMetode: ${method}\n\nSilakan lakukan pembayaran. Jika menggunakan Transfer Manual, admin akan memverifikasi dalam 1x24 jam.`);
      
      // Arahkan ke dashboard untuk melihat status "Pending"
      navigate('/dashboard');
    } catch (err) {
      alert("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCourse) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full">
        
        {/* Header Kembali */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-6 transition"
        >
          <ChevronLeft size={20} /> Kembali ke Katalog
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          
          {/* Ringkasan Pesanan */}
          <div className="bg-blue-600 p-8 text-white">
            <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Ringkasan Pesanan</p>
            <h1 className="text-2xl font-black mb-1">{selectedCourse.title}</h1>
            <div className="flex justify-between items-end mt-6">
              <span className="text-blue-100 text-sm">Total Biaya Pelatihan:</span>
              <span className="text-3xl font-black">{selectedCourse.price}</span>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Wallet size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Pilih Metode Aktivasi</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Opsi 1: Otomatis */}
              <button 
                onClick={() => handlePaymentSubmit("Virtual Account")}
                disabled={loading}
                className="group p-6 border-2 border-slate-100 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">Virtual Account / QRIS</p>
                    <p className="text-xs text-slate-500">Aktivasi Otomatis (Instan)</p>
                  </div>
                </div>
                <CheckCircle2 className="text-slate-200 group-hover:text-blue-500 transition" />
              </button>

              {/* Opsi 2: Manual */}
              <button 
                onClick={() => handlePaymentSubmit("Transfer Bank Manual")}
                disabled={loading}
                className="group p-6 border-2 border-slate-100 rounded-2xl text-left hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">Transfer Bank Manual</p>
                    <p className="text-xs text-slate-500">Verifikasi Admin (Max 24 Jam)</p>
                  </div>
                </div>
                <CheckCircle2 className="text-slate-200 group-hover:text-blue-500 transition" />
              </button>
            </div>

            {loading && (
              <div className="flex flex-col items-center gap-3 mt-8">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm text-slate-500 font-bold animate-pulse">MEMPROSES TRANSAKSI...</p>
              </div>
            )}

            <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="flex gap-3">
                <AlertCircle className="text-slate-400 shrink-0" size={20} />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Setelah memilih metode, Anda akan diarahkan ke instruksi pembayaran. Akses kursus akan terbuka di Dashboard secara otomatis setelah pembayaran divalidasi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs uppercase tracking-widest font-bold">
          Sistem Keamanan Terenkripsi LPK FARAFI
        </p>
      </div>
    </div>
  );
}