import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, ShieldCheck, Trash2, 
  Search, Loader2, Mail, UserCog 
} from 'lucide-react';
import api from '../../api/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleUpdateRole = async (userId, currentName, newRole) => {
    if (!window.confirm(`Ubah peran ${currentName} menjadi ${newRole.toUpperCase()}?`)) return;
    try {
      await api.put(`/api/admin/users/${userId}/role`, { role: newRole });
      alert("✅ Peran berhasil diperbarui!");
      fetchUsers();
    } catch (error) {
      alert("❌ Gagal memperbarui peran.");
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Hapus akun ${name}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      alert("✅ Pengguna dihapus!");
      fetchUsers();
    } catch (error) {
      alert("❌ Gagal menghapus pengguna.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kelola Pengguna</h1>
          <p className="text-slate-500 mt-2 font-medium">Atur akses peran instruktur dan siswa LPK FARAFI.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl text-blue-600 font-bold border border-blue-100 flex items-center gap-2">
          <Users size={20} />
          {users.length} Total Akun
        </div>
      </div>

      {/* Search & Actions */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama atau email pengguna..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
                <tr>
                  <th className="p-8">Nama & Email</th>
                  <th className="p-8">Peran (Role)</th>
                  <th className="p-8">Bergabung Pada</th>
                  <th className="p-8 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                            <Mail size={12} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <select 
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase border-none outline-none cursor-pointer transition-all ${
                          u.role === 'admin' ? 'bg-red-50 text-red-600' : 
                          u.role === 'instruktur' ? 'bg-amber-50 text-amber-600' : 
                          'bg-blue-50 text-blue-600'
                        }`}
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, u.name, e.target.value)}
                        disabled={u.role === 'admin'} // Admin tidak bisa diubah rolenya sendiri di sini
                      >
                        <option value="siswa">Siswa</option>
                        <option value="instruktur">Instruktur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-8 text-sm text-slate-500 font-medium">
                      {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="p-8">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={u.role === 'admin'}
                          className={`p-3 rounded-xl transition shadow-sm ${
                            u.role === 'admin' ? 'text-slate-200 bg-slate-50 cursor-not-allowed' : 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white'
                          }`}
                          title="Hapus Pengguna"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
