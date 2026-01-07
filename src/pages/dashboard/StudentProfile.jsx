import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Award, Save, CheckCircle } from 'lucide-react';

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [showToast, setShowToast] = useState(false);

  // Simulasi Progres (Nantinya dihitung dari database)
  const stats = [
    { label: "Kursus Diikuti", value: "2", icon: <User className="text-blue-600" /> },
    { label: "Progres Rata-rata", value: "65%", icon: <CheckCircle className="text-green-600" /> },
    { label: "Sertifikat Diraih", value: "1", icon: <Award className="text-purple-600" /> },
  ];

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Update state auth global
    login({ ...user, name: newName });
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          Profil Berhasil Diperbarui!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Kolom Kiri: Info & Stats */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-3xl">
              {user?.name?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-slate-500 text-sm">Siswa LPK Farafi</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  {stat.icon}
                  <span className="text-sm text-slate-600">{stat.label}</span>
                </div>
                <span className="font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Akun */}
        <div className="flex-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-6">Pengaturan Profil</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap (Sesuai Sertifikat)</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={newName}
                    disabled={!isEditing}
                    onChange={(e) => setNewName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition outline-none ${
                      isEditing ? 'border-blue-500 ring-2 ring-blue-100' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-yellow-600 mt-2 font-medium italic">
                  * Perubahan nama akan otomatis memperbarui nama pada sertifikat yang diterbitkan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input type="email" value={user?.email} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input type="text" value="62812345678" disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t flex gap-4">
                {isEditing ? (
                  <>
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <Save size={18} /> Simpan Perubahan
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold"
                  >
                    Edit Profil
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}