import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Save, Loader2, ShieldCheck, Edit3, Zap, Camera, X, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/api';

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk Modal Notifikasi
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    whatsapp: user?.whatsapp || ""
  });

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
      await api.put(`/api/users/profile/${user.id}`, formData);
      login({ ...user, ...formData });
      setIsEditing(false);
      
      // Munculkan modal sukses daripada alert biasa
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("❌ Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 lg:space-y-12 pb-20 px-4 animate-in fade-in duration-700 mt-4">
      
      {/* 1. Enhanced Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-center lg:text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-2">
            <Zap size={14} className="fill-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Account Settings</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
            Profil <span className="text-blue-600">Siswa</span>
          </h1>
          <p className="text-slate-500 font-medium">Informasi resmi akun Anda untuk kebutuhan administrasi & sertifikasi.</p>
        </div>

        <div className="bg-slate-900 px-8 py-5 rounded-[2rem] flex items-center gap-5 shadow-2xl self-center lg:self-auto">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Akun</p>
            <p className="text-xl font-black text-white italic uppercase tracking-tighter">Verified Student</p>
          </div>
        </div>
      </header>

      {/* 2. Profile Bento Card */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        
        {/* Banner with Abstract Pattern */}
        <div className="h-40 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Avatar Section */}
        <div className="absolute top-24 left-8 lg:left-12">
          <div className="relative group">
            <div className="w-32 h-32 bg-white p-2 rounded-[2.5rem] shadow-2xl">
              <div className="w-full h-full bg-slate-100 text-slate-400 rounded-[2rem] flex items-center justify-center text-4xl font-black border-4 border-white overflow-hidden group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform active:scale-95 border-4 border-white">
              <Camera size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 lg:p-12 pt-24 lg:pt-28">
          <form onSubmit={handleSave} className="space-y-10">
            
            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 block">Nama Lengkap (Identitas)</label>
                <div className="relative group">
                  <User className={`absolute left-5 top-5 transition-colors duration-300 ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} size={20} />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 font-black text-slate-800 uppercase italic"
                    placeholder="BUDI SANTOSO"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 block">WhatsApp Aktif</label>
                <div className="relative group">
                  <Phone className={`absolute left-5 top-5 transition-colors duration-300 ${isEditing ? 'text-blue-600' : 'text-slate-300'}`} size={20} />
                  <input 
                    type="tel"
                    disabled={!isEditing}
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 font-black text-slate-800 tabular-nums"
                    placeholder="62812345678"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 block">Email (Read Only)</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-5 text-slate-300" size={20} />
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ""} 
                    className="w-full pl-14 pr-6 py-5 bg-slate-100 border-none rounded-[2rem] outline-none opacity-40 cursor-not-allowed font-bold text-slate-500 italic" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 block">Kategori Akses</label>
                <div className="flex items-center gap-3 px-6 py-5 bg-blue-50 border border-blue-100 rounded-[2rem] text-blue-700 font-black text-xs uppercase tracking-widest italic">
                   <ShieldCheck size={18} /> {user?.role} LPK FARAFI
                </div>
              </div>

            </div>

            {/* Action Buttons Section */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 max-w-md">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                  Nama Anda akan dicetak langsung pada sertifikat. Pastikan ejaan sudah sesuai dengan kartu identitas resmi.
                </p>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                {isEditing ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      disabled={loading}
                      className="flex-1 md:px-10 py-5 bg-slate-100 text-slate-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 md:px-12 py-5 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Simpan Data
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)} 
                    className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl active:scale-95 italic"
                  >
                    <Edit3 size={18} /> Edit Profil Saya
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SUCCESS MODAL (CENTERED BENTO STYLE) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSuccessModal(false)}></div>
          
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
            
            <div className="w-24 h-24 mx-auto mb-6 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg transform -rotate-3">
              <CheckCircle2 size={48} />
            </div>

            <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">
              Profil Update!
            </h3>
            
            <p className="text-slate-500 mt-4 font-medium leading-relaxed">
              Data identitas Anda telah berhasil <br/>
              <span className="font-bold text-slate-800 underline decoration-blue-200">diperbarui di sistem kami.</span>
            </p>

            <button 
              onClick={() => setShowSuccessModal(false)}
              className="mt-10 w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest text-xs italic"
            >
              Lanjutkan Belajar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}