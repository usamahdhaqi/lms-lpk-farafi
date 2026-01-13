import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  Phone, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Ambil courseId jika user datang dari tombol "Ambil Kursus" di Landing Page
  const queryParams = new URLSearchParams(location.search);
  const selectedCourseId = queryParams.get('courseId');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: ''
  });

  // Redirect jika sudah login
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'instruktur') navigate('/instructor');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        await authService.register(formData);
        setSuccess(true);
        setTimeout(() => {
          setIsRegister(false);
          setSuccess(false);
        }, 2000);
      } else {
        // --- LOGIKA LOGIN & REDIRECT BERDASARKAN ROLE ---
        const res = await authService.login({
          email: formData.email,
          password: formData.password
        });

        // Simpan data user dan token ke Global State
        login(res.user, res.token);

        // Pengalihan cerdas berdasarkan Role
        const role = res.user.role;
        
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'instruktur') {
          navigate('/instructor'); // Langsung ke Panel Instruktur
        } else {
          // Jika siswa baru saja memilih kursus dari Landing Page
          if (selectedCourseId) {
            navigate(`/dashboard/course/${selectedCourseId}`);
          } else {
            navigate('/dashboard'); // Ke Dashboard Siswa
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        {/* SISI KIRI: BRANDING & INFO */}
        <div className="w-full md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter mb-2">LPK FARAFI</h2>
            <p className="text-blue-100 font-medium text-sm tracking-widest uppercase">Pusat Pelatihan Kompetensi Digital</p>
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-4xl font-black leading-tight">Mulai Karir Profesional Anda di Sini.</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <CheckCircle2 size={24} className="text-blue-300" />
                <p className="text-sm font-medium">Akses materi selamanya & Terupdate</p>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <ShieldCheck size={24} className="text-blue-300" />
                <p className="text-sm font-medium">Sertifikat Resmi Terverifikasi</p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-[10px] font-bold text-blue-200 uppercase tracking-widest">
            © 2024 LPK Farafi. All rights reserved.
          </p>
        </div>

        {/* SISI KANAN: FORM */}
        <div className="w-full md:w-1/2 p-12 md:p-16">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {isRegister ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {isRegister ? 'Lengkapi data untuk memulai pelatihan.' : 'Masuk ke dashboard untuk melanjutkan belajar.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-bounce">
              <CheckCircle2 size={20} /> Registrasi Berhasil! Mengalihkan...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="relative group">
                <User className="absolute left-5 top-4 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
                <input 
                  name="name" type="text" placeholder="Nama Lengkap" required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition font-medium"
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-5 top-4 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
              <input 
                name="email" type="email" placeholder="Alamat Email" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition font-medium"
                onChange={handleChange}
              />
            </div>

            {isRegister && (
              <div className="relative group">
                <Phone className="absolute left-5 top-4 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
                <input 
                  name="whatsapp" type="text" placeholder="Nomor WhatsApp (Aktif)" required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition font-medium"
                  onChange={handleChange}
                />
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-5 top-4 text-slate-400 group-focus-within:text-blue-600 transition" size={20} />
              <input 
                name="password" type="password" placeholder="Kata Sandi" required
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none transition font-medium"
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <> {isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE DASHBOARD'} <ArrowRight size={20} /> </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              {isRegister ? 'Sudah punya akun?' : 'Belum memiliki akun?'} 
              <button 
                onClick={() => setIsRegister(!isRegister)} 
                className="ml-2 text-blue-600 font-black hover:underline underline-offset-4"
              >
                {isRegister ? 'Login di Sini' : 'Daftar Sekarang'}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}