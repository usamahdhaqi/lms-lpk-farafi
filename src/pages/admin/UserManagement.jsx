import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, Search, Loader2, 
  UserCog, GraduationCap, UserX, UserCheck,
  Calendar, RefreshCw, AlertCircle
} from 'lucide-react';
import api from '../../api/api';
import UserStatusModal from './components/UserStatusModal';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState('semua'); 

  // --- FUNGSI AMBIL DATA ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal memuat pengguna:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [statusModal, setStatusModal] = useState({ 
    open: false, 
    id: null, 
    name: '', 
    isActivating: false 
  });

  // --- FUNGSI UPDATE ROLE ---
  const handleUpdateRole = async (userId, currentName, newRole) => {
    if (!window.confirm(`Ubah peran ${currentName} menjadi ${newRole.toUpperCase()}?`)) return;
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      alert("❌ Gagal memperbarui peran.");
    }
  };

  // --- FUNGSI TOGGLE STATUS (PENGGANTI HAPUS) ---
  const handleToggleStatus = (userId, name, currentStatus) => {
    // Bukan langsung panggil API, tapi buka modal dulu
    setStatusModal({
      open: true,
      id: userId,
      name: name,
      isActivating: !currentStatus // Jika sekarang aktif, maka tujuannya menonaktifkan
    });
  };

  const confirmToggleStatus = async () => {
    try {
      await api.put(`/api/admin/users/${statusModal.id}/status`, { 
        is_active: statusModal.isActivating ? 1 : 0 
      });
      
      // Tutup modal dan refresh data
      setStatusModal({ ...statusModal, open: false });
      fetchUsers();
    } catch (error) {
      alert("❌ Gagal memperbarui status.");
    }
  };

  // --- LOGIKA FILTER ---
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'semua') return matchSearch;
    return u.role === activeTab && matchSearch;
  });

  const countRole = (role) => users.filter(u => u.role === role).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 lg:space-y-10 pb-20 px-4 animate-in fade-in duration-700 mt-4">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 text-center lg:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-3">
            <Users size={12} className="fill-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">User Management</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
            Database <span className="text-blue-600">Pengguna</span>
          </h1>
          <p className="text-slate-500 mt-2 text-xs lg:text-base font-medium italic">Kendali otoritas akses admin, instruktur, dan siswa LPK FARAFI.</p>
        </div>
        
        <div className="flex gap-3 bg-white p-2 rounded-3xl shadow-xl border border-slate-50">
            <div className="px-6 py-3 bg-slate-900 rounded-2xl text-center min-w-[100px]">
                <p className="text-[9px] font-black text-slate-500 uppercase">Total User</p>
                <p className="text-xl font-black text-white">{users.length}</p>
            </div>
            <button onClick={fetchUsers} className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* 2. Sticky Search & Tab Navigation */}
      <div className="sticky top-4 z-40 flex flex-col lg:flex-row justify-between gap-4 bg-white/80 backdrop-blur-xl p-2 lg:p-3 rounded-[2rem] lg:rounded-full border border-white shadow-xl">
        <div className="flex gap-1 bg-slate-100/50 p-1 rounded-full overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'semua', label: 'Semua', count: users.length, icon: <Users size={14}/> },
            { id: 'admin', label: 'Admin', count: countRole('admin'), icon: <ShieldCheck size={14}/> },
            { id: 'instruktur', label: 'Instruktur', count: countRole('instruktur'), icon: <UserCog size={14}/> },
            { id: 'siswa', label: 'Siswa', count: countRole('siswa'), icon: <GraduationCap size={14}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 lg:px-8 py-2.5 lg:py-3 rounded-full font-bold text-[11px] lg:text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.icon} {tab.label.toUpperCase()} 
              <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau email..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-full focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. Database Display Area */}
      <div className="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed text-center">Menyinkronkan data<br/>ke server...</p>
          </div>
        ) : (
          <div className="p-4 lg:p-0">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <tr>
                    <th className="px-10 py-6">Profil Pengguna</th>
                    <th className="px-10 py-6">Otoritas Akses</th>
                    <th className="px-10 py-6">Tanggal Daftar</th>
                    <th className="px-10 py-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className={`group hover:bg-blue-50/30 transition-all duration-300 ${!u.is_active && 'bg-red-50/20 opacity-80'}`}>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-transform group-hover:rotate-6 ${
                             !u.is_active ? 'bg-slate-200 text-slate-400' :
                             u.role === 'admin' ? 'bg-red-100 text-red-600' : 
                             u.role === 'instruktur' ? 'bg-amber-100 text-amber-600' : 'bg-blue-600 text-white'
                          }`}>
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-black uppercase italic text-sm ${!u.is_active ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                {u.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-bold">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <select 
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none cursor-pointer shadow-sm transition-all ${
                            u.role === 'admin' ? 'bg-red-50 text-red-600' : 
                            u.role === 'instruktur' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                          }`}
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, u.name, e.target.value)}
                          disabled={u.role === 'admin'}
                        >
                          <option value="siswa">Siswa</option>
                          <option value="instruktur">Instruktur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-2 text-slate-500">
                            <Calendar size={14} />
                            <p className="text-[11px] font-bold uppercase">
                                {new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => handleToggleStatus(u.id, u.name, u.is_active)}
                            disabled={u.role === 'admin'}
                            className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
                              u.role === 'admin' 
                                ? 'text-slate-200 bg-slate-50 cursor-not-allowed' 
                                : u.is_active 
                                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white' 
                                  : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white'
                            }`}
                          >
                            {u.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards: Tampilan untuk Smartphone */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {filteredUsers.map(u => {
                // Gunakan logika isActive yang sama dengan versi desktop
                const isActive = Number(u.is_active) === 1;

                return (
                  /* GANTI <tr> MENJADI <div> */
                  <div 
                    key={u.id} 
                    className={`p-5 rounded-[2rem] border transition-all ${
                      isActive ? 'bg-slate-50/80 border-slate-100' : 'bg-red-50/30 border-red-100 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${
                          !isActive ? 'bg-slate-400' :
                          u.role === 'admin' ? 'bg-red-500' : 
                          u.role === 'instruktur' ? 'bg-amber-500' : 'bg-blue-600'
                      }`}>
                        {u.name[0].toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-black uppercase italic text-sm truncate ${!isActive ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold truncate">{u.email}</p>
                      </div>

                      {/* Tombol Toggle Status */}
                      <button 
                        onClick={() => handleToggleStatus(u.id, u.name, isActive)}
                        disabled={u.role === 'admin'}
                        className={`p-3 rounded-2xl bg-white shadow-sm transition-all active:scale-90 ${
                          isActive ? 'text-amber-500' : 'text-emerald-500'
                        } ${u.role === 'admin' ? 'opacity-20' : 'opacity-100'}`}
                      >
                        {isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                    
                    {/* Bagian Bawah Card */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/50">
                      <div className="flex items-center gap-2 text-slate-400">
                          <Calendar size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {new Date(u.created_at).toLocaleDateString('id-ID')}
                          </span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase ${
                          u.role === 'admin' ? 'bg-red-100 text-red-600' : 
                          u.role === 'instruktur' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                          {u.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="py-24 text-center">
                <AlertCircle className="mx-auto text-slate-100 mb-4" size={64} />
                <p className="text-slate-400 font-black uppercase italic tracking-widest text-xs">Pencarian tidak ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <UserStatusModal 
        isOpen={statusModal.open}
        targetName={statusModal.name}
        isActivating={statusModal.isActivating}
        onClose={() => setStatusModal({ ...statusModal, open: false })}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}