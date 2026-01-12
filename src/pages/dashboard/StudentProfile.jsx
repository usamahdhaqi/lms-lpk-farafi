import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Save, Loader2, ShieldCheck, Edit3 } from 'lucide-react';
import api from '../../api/api';

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    whatsapp: user?.whatsapp || ""
  });

  // Sinkronkan state jika data user di context berubah
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        whatsapp: user.whatsapp || ""
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API Backend untuk update profil
      const response = await api.put(`/api/users/profile/${user.id}`, formData);
      
      // Update data di Global Context (AuthContext) agar UI di sidebar dll ikut berubah
      login({ ...user, ...formData });
      
      setIsEditing(false);
      alert("✅ Profil Anda berhasil diperbarui di database!");
    } catch (error) {
      console.error(error);
      alert("❌ Gagal memperbarui profil. Pastikan koneksi stabil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profil Saya</h1>
        <p className="text-slate-500 mt-1">Informasi akun Anda yang digunakan untuk penerbitan sertifikat resmi.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        {/* Banner Profil */}
        <div className="h-32 bg-blue-600 relative">
          <div className="absolute -bottom-12 left-12">
            <div className="w-24 h-24 bg-white p-1.5 rounded-[2rem] shadow-xl">
              <div className="w-full h-full bg-blue-100 text-blue-600 rounded-[1.7rem] flex items-center justify-center text-3xl font-black border-2 border-white">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 pt-20">
          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Field: Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Nama Sesuai Identitas</label>
                <div className="relative group">
                  <User className={`absolute left-4 top-4 transition ${isEditing ? 'text-blue-500' : 'text-slate-300'}`} size={20} />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-60 disabled:bg-slate-50 font-bold text-slate-700"
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>
              </div>

              {/* Field: WhatsApp */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Nomor WhatsApp</label>
                <div className="relative group">
                  <Phone className={`absolute left-4 top-4 transition ${isEditing ? 'text-blue-500' : 'text-slate-300'}`} size={20} />
                  <input 
                    type="tel"
                    disabled={!isEditing}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-60 disabled:bg-slate-50 font-bold text-slate-700"
                    placeholder="628..."
                    required
                  />
                </div>
              </div>

              {/* Field: Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Email (ID Pengguna)</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ""} 
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none opacity-60 cursor-not-allowed font-medium text-slate-500" 
                  />
                </div>
                <p className="text-[10px] text-slate-400 ml-1 italic">* Email tidak dapat diubah demi keamanan akun.</p>
              </div>

              {/* Status Role */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Tipe Akun</label>
                <div className="flex items-center gap-2 px-4 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 font-black text-sm">
                   <ShieldCheck size={18} /> {user?.role?.toUpperCase()} LPK FARAFI
                </div>
              </div>

            </div>

            {/* Tombol Aksi */}
            <div className="pt-6 border-t border-slate-50 flex justify-end">
              {isEditing ? (
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)} 
                    disabled={loading}
                    className="flex-1 md:px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 md:px-12 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 disabled:bg-blue-300"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)} 
                  className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition shadow-xl"
                >
                  <Edit3 size={18} /> Edit Informasi Profil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}