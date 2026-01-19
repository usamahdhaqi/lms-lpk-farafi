import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, Trash2, Search, Loader2, 
  Mail, UserCog, UserCheck, GraduationCap 
} from 'lucide-react';
import api from '../../api/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // State untuk Tab aktif
  const [activeTab, setActiveTab] = useState('semua'); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/users'); // Mengambil semua user
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

  const handleUpdateRole = async (userId, currentName, newRole) => {
    if (!window.confirm(`Ubah peran ${currentName} menjadi ${newRole.toUpperCase()}?`)) return;
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole }); // Endpoint update role
      alert("✅ Peran berhasil diperbarui!");
      fetchUsers();
    } catch (error) {
      alert("❌ Gagal memperbarui peran.");
    }
  };

  // Logika Filter Berlapis: Berdasarkan Tab DAN Berdasarkan Pencarian Nama
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'semua') return matchSearch;
    return u.role === activeTab && matchSearch;
  });

  // Menghitung jumlah user per kategori untuk indikator di Tab
  const countRole = (role) => users.filter(u => u.role === role).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-xl italic uppercase tracking-tighter">Database Pengguna</h1>
          <p className="text-slate-500 mt-2 font-medium">Segmentasi akses admin, instruktur, dan siswa LPK FARAFI.</p>
        </div>
      </div>

      {/* SEARCH & TAB NAVIGATION */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 items-center">
        {/* Navigasi Tab Modern */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[2rem] w-fit overflow-x-auto no-scrollbar">
          {[
            { id: 'semua', label: 'Semua', count: users.length, icon: <Users size={14}/> },
            { id: 'admin', label: 'Admin', count: countRole('admin'), icon: <ShieldCheck size={14}/> },
            { id: 'instruktur', label: 'Instruktur', count: countRole('instruktur'), icon: <UserCog size={14}/> },
            { id: 'siswa', label: 'Siswa', count: countRole('siswa'), icon: <GraduationCap size={14}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} {tab.label.toUpperCase()} 
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Cari di tab ${activeTab}...`} 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-24 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={40} />
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Memproses Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-8">Profil Pengguna</th>
                  <th className="p-8">Otoritas Akses</th>
                  <th className="p-8">Tanggal Daftar</th>
                  <th className="p-8 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-all duration-300">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                           u.role === 'admin' ? 'bg-red-100 text-red-600' : 
                           u.role === 'instruktur' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 tracking-tight">{u.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <select 
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-none outline-none cursor-pointer shadow-sm transition-all ${
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
                    <td className="p-8">
                       <p className="text-xs font-bold text-slate-500 uppercase">
                         {new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                       </p>
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.name)} // Fungsi hapus user
                          disabled={u.role === 'admin'}
                          className={`p-3 rounded-xl transition-all ${
                            u.role === 'admin' ? 'text-slate-200 bg-slate-50 cursor-not-allowed' : 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="p-24 text-center">
                <Users className="mx-auto text-slate-100 mb-4" size={64} />
                <p className="text-slate-400 font-bold italic">Tidak ada pengguna ditemukan di kategori ini.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}