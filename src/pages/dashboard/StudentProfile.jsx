import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");

  const handleSave = (e) => {
    e.preventDefault();
    login({ ...user, name: name });
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Profil Saya</h1>
        <p className="text-slate-500">Pastikan nama sesuai KTP untuk keperluan sertifikat.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 md:p-12">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-black border-4 border-white shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-300" size={20} />
                <input 
                  type="text"
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-60"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Email (ID)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
                <input type="email" disabled value={user?.email || "email@lpkfarafi.com"} className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl outline-none opacity-60 cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="pt-8">
            {isEditing ? (
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                  <Save size={20} /> Simpan Perubahan
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold">Batal</button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition">
                Edit Profil
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}