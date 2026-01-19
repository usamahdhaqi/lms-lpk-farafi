import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, CreditCard, Search, Loader2, 
  RefreshCw, User, BookOpen, X, Info, ShieldCheck, AlertCircle,
  Calendar, DollarSign, ExternalLink
} from 'lucide-react';
import api from '../../api/api';

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State untuk Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/pending-payments');
      setPayments(response.data);
    } catch (error) {
      console.error("Gagal memuat data pembayaran:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleConfirmVerify = async () => {
    if (!selectedPayment) return;
    
    setIsVerifying(true);
    try {
      await api.post(`/api/payments/verify/${selectedPayment.id}`);
      alert(`✅ Akses kursus untuk ${selectedPayment.student_name} telah aktif!`);
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      alert("❌ Gagal memverifikasi pembayaran.");
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats Tetap Sama */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-xl italic uppercase tracking-tighter">Verifikasi Pembayaran</h1>
          <p className="text-slate-500 mt-2 font-medium">Validasi bukti transfer siswa untuk membuka akses materi.</p>
        </div>
        <div className="bg-amber-50 px-6 py-4 rounded-[2rem] border border-amber-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Antrean</p>
            <p className="text-2xl font-black text-slate-800">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari siswa atau pelatihan..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={fetchPayments} className="flex items-center gap-2 bg-white px-6 py-4 rounded-2xl border border-slate-100 font-bold text-slate-600">
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> REFRESH
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPayments.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{p.student_name}</h3>
                <div className="flex items-center gap-2 mt-2 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                  <BookOpen size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase text-slate-500">{p.course_title}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xl font-black text-blue-600">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                <span className="text-[10px] font-black bg-blue-50 text-blue-500 px-2 py-0.5 rounded uppercase">{p.payment_method}</span>
              </div>
              <button 
                onClick={() => setSelectedPayment(p)} // Buka Modal
                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-green-600 transition-all active:scale-95"
              >
                TINJAU PEMBAYARAN
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL VERIFIKASI SUPER LENGKAP --- */}
      {selectedPayment && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedPayment(null)}></div>
          
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Konfirmasi Validasi</h2>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-slate-200 rounded-full transition">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Info Utama */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Peserta</p>
                  <p className="font-bold text-slate-800 text-lg">{selectedPayment.student_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Pembayaran</p>
                  <p className="font-bold text-blue-600 text-lg uppercase">{selectedPayment.payment_method}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Program Pelatihan</p>
                  <p className="font-bold text-slate-800">{selectedPayment.course_title}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bayar</p>
                  <p className="font-black text-green-600 text-xl">Rp {Number(selectedPayment.price).toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Box Bukti Transfer (Placeholder jika belum ada upload) */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Info size={32} className="text-slate-300" />
                  <p className="text-sm font-bold text-slate-500 italic">Admin harap memeriksa mutasi rekening secara manual pada m-banking sesuai nominal di atas.</p>
                </div>
              </div>

              {/* Warning Area */}
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs font-medium text-amber-700 leading-relaxed">
                  Dengan menyetujui, sistem akan secara otomatis membuka seluruh materi kursus dan mengirimkan notifikasi akses kepada siswa yang bersangkutan.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-0 flex gap-4">
              <button 
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition"
              >
                BATALKAN
              </button>
              <button 
                onClick={handleConfirmVerify}
                disabled={isVerifying}
                className="flex-[2] py-4 bg-green-500 text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
              >
                {isVerifying ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                {isVerifying ? "MEMPROSES..." : "YA, SUDAH MASUK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}