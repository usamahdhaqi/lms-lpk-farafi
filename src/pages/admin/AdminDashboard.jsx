import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Users, CreditCard, Search } from 'lucide-react';
import api from '../../api/api';

export default function AdminDashboard() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/api/admin/pending-payments');
        setPendingPayments(response.data);
      } catch (error) {
        console.error("Gagal memuat pembayaran:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleVerify = async (enrollmentId) => {
    try {
      await api.post(`/api/payments/verify/${enrollmentId}`);
      setPendingPayments(prev => prev.filter(p => p.id !== enrollmentId));
      alert("Pembayaran berhasil diverifikasi!");
    } catch (error) {
      alert("Gagal memverifikasi pembayaran.");
    }
  };

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-3xl font-black text-slate-800">Admin Panel</h1>
      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <h2 className="font-black text-xl text-slate-800">Verifikasi Pembayaran</h2>
          <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-xs font-bold">
            {pendingPayments.length} Menunggu
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                <th className="p-6">Siswa</th>
                <th className="p-6">Kursus</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingPayments.map((p) => (
                <tr key={p.id}>
                  <td className="p-6">
                    <p className="font-bold text-slate-800">{p.student_name}</p>
                    <p className="text-xs text-slate-400">{p.email}</p>
                  </td>
                  <td className="p-6 text-sm font-medium text-slate-600">{p.course_title}</td>
                  <td className="p-6 flex justify-center gap-2">
                    <button 
                      onClick={() => handleVerify(p.id)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition"
                    >
                      <CheckCircle size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}