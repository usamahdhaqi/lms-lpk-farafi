import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/authService';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Menangkap data kursus jika user diarahkan dari Landing Page
  const selectedCourseId = location.state?.selectedCourse || null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        // --- LOGIKA REGISTRASI ---
        const dataToSend = {
          name: formData.name,
          email: formData.email,
          whatsapp: formData.phone,
          password: formData.password
        };
        
        await authService.register(dataToSend);
        alert("✅ Registrasi Berhasil! Silakan masuk menggunakan email Anda.");
        setIsRegister(false);
      } else {
        // --- LOGIKA LOGIN ---
        const response = await authService.login({ 
          email: formData.email, 
          password: formData.password 
        });

        // Simpan token untuk keamanan session
        localStorage.setItem('token', response.data.token);
        
        // Update global auth state
        login(response.data.user);
        
        // LOGIKA PENGALIHAN CERDAS (Sesuai Permintaan)
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else if (selectedCourseId) {
          // Jika sebelumnya sudah pilih kursus, langsung ke pembayaran
          navigate('/register', { state: { courseId: selectedCourseId, step: 2 } });
        } else {
          // Jika login biasa, ke dashboard
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan pada server. Mohon coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        
        {/* Toggle Masuk / Daftar */}
        <div className="flex border-b bg-slate-50/50">
          <button 
            disabled={loading}
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-5 font-bold transition-all duration-300 ${!isRegister ? 'text-blue-600 bg-white border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Masuk
          </button>
          <button 
            disabled={loading}
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-5 font-bold transition-all duration-300 ${isRegister ? 'text-blue-600 bg-white border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Daftar Baru
          </button>
        </div>

        <div className="p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">LPK FARAFI</h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              {isRegister 
                ? 'Buat akun untuk mulai klaim sertifikat resmi' 
                : 'Lanjutkan progres belajar digital Anda'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs flex items-center gap-3 animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative group">
                <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition" size={20} />
                <input 
                  type="text"
                  placeholder="Nama Lengkap (Sesuai Sertifikat)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  required
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition" size={20} />
              <input 
                type="email"
                placeholder="Email Aktif"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {isRegister && (
              <div className="relative group">
                <Phone className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition" size={20} />
                <input 
                  type="tel"
                  placeholder="WhatsApp (628...)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  required
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition" size={20} />
              <input 
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition shadow-xl shadow-blue-100 disabled:bg-blue-300 mt-6"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                isRegister ? <UserPlus size={22}/> : <LogIn size={22}/>
              )}
              {loading ? 'Sedang Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Ke Dashboard')}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">Belum punya akun? </span>
              <button 
                onClick={() => setIsRegister(true)} 
                className="text-blue-600 font-black hover:underline underline-offset-4"
              >
                Daftar Akun Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}