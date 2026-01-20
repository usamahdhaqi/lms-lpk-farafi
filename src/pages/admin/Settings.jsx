import React, { useState } from 'react';
import { 
  User, Lock, Bell, Shield, 
  Save, LogOut, Camera, Mail, 
  Key, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

export default function Settings() {
  const { user, logout } = useAuth(); // Mengambil data user yang sedang login
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profile'); // profile, security

  // State Form Profil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  // State Form Password
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
      alert("✅ Profil berhasil diperbarui! Silakan login ulang untuk melihat perubahan.");
    } catch (error) {
      alert("❌ Gagal memperbarui profil.");
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) return alert("Password baru tidak cocok!");
    
    setLoading(true);
    try {
      await api.put('/api/admin/update-password', { id: user.id, newPassword: passwordData.new });
      alert("✅ Password berhasil diganti!");
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      alert("❌ Gagal mengganti password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase tracking-tighter">Pengaturan Sistem</h1>
        <p className="text-slate-500 mt-2 font-medium">Kelola identitas admin dan konfigurasi keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigasi Settings */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Profil Saya', icon: <User size={18}/> },
            { id: 'security', label: 'Keamanan', icon: <Shield size={18}/> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                activeSection === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {item.icon} {item.label.toUpperCase()}
            </button>
          ))}
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm text-red-500 bg-red-50 hover:bg-red-100 mt-8 transition-all"
          >
            <LogOut size={18} /> KELUAR AKUN
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden p-10 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-50">
                <div className="relative group">
                  <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 font-black text-3xl overflow-hidden shadow-inner">
                    {user?.name[0].toUpperCase()}
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition active:scale-95">
                    <Camera size={16} />
                  </button>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{user?.name}</h2>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest bg-slate-50 px-3 py-1 rounded-lg inline-block mt-2">
                    Level Akses: {user?.role}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nama Lengkap Admin</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" 
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-400"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 ml-auto"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                  SIMPAN PERUBAHAN
                </button>
              </form>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden p-10 animate-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Ganti Kata Sandi</h2>
              <p className="text-slate-400 text-sm font-medium mb-8">Disarankan untuk mengganti password secara berkala setiap 3 bulan.</p>

              <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Password Baru</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="password" 
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="password" 
                      placeholder="Ulangi password baru"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                  PERBARUI KEAMANAN
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}