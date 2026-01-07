import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { authService } from '../api/authService';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // State Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = isRegister 
            ? await authService.register(formData) 
            : await authService.login({ email: formData.email, password: formData.password });

            // Simpan token ke localStorage (SRS Seksi 4.1)
            localStorage.setItem('token', response.data.token);
            
            // Masukkan data user asli dari database ke Context
            login(response.data.user);
            
            navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || "Terjadi kesalahan autentikasi");
        }
    };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Toggle */}
        <div className="flex border-b">
          <button 
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-4 font-bold transition ${!isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
          >
            Masuk
          </button>
          <button 
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-4 font-bold transition ${isRegister ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}
          >
            Daftar Baru
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-800">LPK FARAFI</h1>
            <p className="text-slate-500 text-sm mt-2">
              {isRegister ? 'Buat akun untuk mulai belajar digital' : 'Selamat datang kembali di LMS LPK Farafi'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Nama Lengkap (Sesuai Sertifikat)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {isRegister && (
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="tel"
                  placeholder="Nomor WhatsApp (628...)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 mt-6"
            >
              {isRegister ? <UserPlus size={20}/> : <LogIn size={20}/>}
              {isRegister ? 'Buat Akun Sekarang' : 'Masuk Ke Dashboard'}
            </button>
          </form>

          {!isRegister && (
            <p className="text-center text-sm text-slate-500 mt-6">
              Lupa password? <a href="#" className="text-blue-600 font-semibold">Hubungi Admin</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}