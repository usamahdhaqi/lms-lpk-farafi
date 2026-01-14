import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Loader2, GraduationCap, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/api';

export default function StudentMonitoring() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Mengambil data progres siswa dari endpoint instruktur
        const response = await api.get(`/api/admin/student-progress`); 
        // Filter agar instruktur hanya melihat progres kursus yang mereka ajar
        setStudents(response.data);
      } catch (error) {
        console.error("Gagal memuat data monitoring:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchStudentData();
  }, [user]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Menganalisis Progres Siswa...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Monitoring Akademik</h1>
          <p className="text-slate-500 font-medium">Pantau nilai kuis dan progres belajar siswa Anda secara real-time.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau kursus..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="p-8">Nama Siswa</th>
                <th className="p-8">Kursus</th>
                <th className="p-8">Progres</th>
                <th className="p-8 text-center">Nilai Akhir</th>
                <th className="p-8 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 font-medium text-slate-600 text-sm">{s.course_title}</td>
                  <td className="p-8 w-64">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${s.progress_percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${s.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-slate-700">{s.progress_percentage}%</span>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <span className={`text-sm font-black ${s.quiz_score >= 75 ? 'text-green-600' : 'text-slate-400'}`}>
                      {s.quiz_score || 0}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center">
                      {s.is_passed ? (
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-green-100">
                          <CheckCircle size={12} /> Lulus
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-amber-100">
                          <Clock size={12} /> Belum Lulus
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="p-20 text-center">
              <Users className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold">Tidak ada data siswa ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}