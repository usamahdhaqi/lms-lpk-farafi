import React, { useState } from 'react';
import { 
  User, Lock, Shield, Save, LogOut, 
  Camera, Mail, Key, CheckCircle2, 
  Loader2, Settings as SettingsIcon, ShieldCheck,
  AlertCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

export default function Settings() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/admin/update-profile', { id: user.id, ...profileData });
      alert("✅ Profil diperbarui! Silakan login ulang untuk melihat perubahan.");
    } catch (error) {
      alert("❌ Gagal memperbarui profil.");
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) return alert("❌ Password baru tidak cocok!");
    setLoading(true);
    try {
      await api.put('/api/admin/change-password', { id: user.id, ...passwordData });
      alert("✅ Password berhasil diubah!");
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert("❌ Gagal mengubah password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 px-4 animate-in fade-in duration-700 mt-4">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 text-center lg:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-3">
            <SettingsIcon size={12} className="fill-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Account Control</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
            Pengaturan <span className="text-blue-600">Sistem</span>
          </h1>
          <p className="text-slate-500 mt-2 text-xs lg:text-base font-medium">Kelola identitas profil dan keamanan akses akun LPK FARAFI.</p>
        </div>

        <button 
          onClick={logout}
          className="group flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-100/50"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          KELUAR APLIKASI
        </button>
      </div>

      {/* 2. Main Layout (Sidebar + Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
        
        {/* Left: Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-2">
            {[
              { id: 'profile', label: 'Profil Pengguna', icon: <User size={18}/>, desc: 'Nama & Alamat Email' },
              { id: 'security', label: 'Keamanan Akun', icon: <ShieldCheck size={18}/>, desc: 'Kata Sandi & Akses' }
            ].map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between p-5 rounded-[1.8rem] transition-all group ${
                  activeSection === section.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2' 
                  : 'hover:bg-slate-50 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${activeSection === section.id ? 'bg-slate-800' : 'bg-slate-100 group-hover:bg-white'}`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase italic">{section.label}</p>
                    <p className={`text-[10px] font-medium opacity-60 ${activeSection === section.id ? 'text-white' : 'text-slate-400'}`}>
                      {section.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className={activeSection === section.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 overflow-hidden relative group">
            <Shield className="absolute -right-4 -bottom-4 text-blue-500 opacity-20 rotate-12 group-hover:scale-110 transition-transform" size={160} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Privasi Keamanan</p>
            <p className="text-sm font-bold leading-relaxed relative z-10">
              Data Anda dilindungi secara enkripsi sistem LPK FARAFI. Jangan bagikan password kepada siapapun.
            </p>
          </div>
        </div>

        {/* Right: Active Form Section */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-8 lg:p-12 animate-in slide-in-from-right-10 duration-500">
            {activeSection === 'profile' ? (
              <div className="space-y-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 border-b border-slate-50 pb-10">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden shadow-inner">
                      <User size={60} />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                      <Camera size={18} />
                    </button>
                  </div>
                  <div className="text-center lg:text-left">
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic">Identitas <span className="text-blue-600">Profil</span></h2>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">ID Pengguna: #{user?.id || '---'}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nama Lengkap</label>
                      <input 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Alamat Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="email"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    disabled={loading}
                    className="w-full lg:w-max px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    SIMPAN PERUBAHAN
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="border-b border-slate-50 pb-10">
                  <h2 className="text-2xl font-black text-slate-800 uppercase italic">Proteksi <span className="text-red-500">Keamanan</span></h2>
                  <p className="text-slate-400 text-xs font-medium mt-1">Perbarui kata sandi secara berkala untuk menjaga akun tetap aman.</p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Password Saat Ini</label>
                    <input 
                      type="password"
                      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-red-100 outline-none font-bold text-sm"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Password Baru</label>
                      <input 
                        type="password"
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Konfirmasi</label>
                      <input 
                        type="password"
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-3xl border border-amber-100">
                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-[10px] text-amber-700 font-bold uppercase leading-relaxed">
                      Sistem akan memaksa Logout secara otomatis setelah password berhasil diubah demi keamanan akses.
                    </p>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Key size={18} />}
                    PERBARUI KATA SANDI
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}