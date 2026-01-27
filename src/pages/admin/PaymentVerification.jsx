import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, CreditCard, Search, Loader2, 
  RefreshCw, User, BookOpen, X, Info, ShieldCheck, AlertCircle,
  ChevronRight, Wallet
} from 'lucide-react';
import api from '../../api/api';

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
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
      setSelectedPayment(null);
      fetchPayments();
    } catch (error) {
      alert("Gagal memverifikasi pembayaran.");
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    p.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 lg:space-y-10 pb-20 px-2 lg:px-4 animate-in fade-in duration-700">
      
      {/* 1. Enhanced Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 bg-white p-6 lg:p-0 rounded-[2.5rem] lg:bg-transparent">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 mb-3">
            <CreditCard size={12} className="fill-amber-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Financial Control</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
            Verifikasi <span className="text-blue-600">Pembayaran</span>
          </h1>
          <p className="text-slate-500 mt-2 text-xs lg:text-base font-medium">Validasi bukti transfer untuk aktivasi akses kursus.</p>
        </div>

        <div className="bg-slate-900 px-8 py-5 rounded-[2rem] flex items-center gap-5 shadow-2xl min-w-[240px]">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menunggu</p>
            <p className="text-3xl font-black text-white italic">{payments.length} <span className="text-xs text-slate-500 not-italic uppercase tracking-widest ml-1">Siswa</span></p>
          </div>
        </div>
      </div>

      {/* 2. Optimized Action Bar (Sticky on Mobile) */}
      <div className="sticky top-4 z-40 flex flex-col lg:flex-row gap-3 bg-white/80 backdrop-blur-xl p-2 rounded-3xl lg:rounded-full border border-white shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama siswa atau kursus..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-100/50 border-none rounded-full focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={fetchPayments} className="p-4 bg-white rounded-full border border-slate-200 text-slate-500 hover:text-blue-600 hover:rotate-180 transition-all duration-500 shadow-sm self-end lg:self-auto">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* 3. Responsive Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
        {loading ? (
          <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sinkronisasi data...</p>
          </div>
        ) : filteredPayments.map(p => (
          <div key={p.id} className="group bg-white p-5 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
            
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-base lg:text-xl font-black text-slate-800 uppercase italic leading-tight">{p.student_name}</h3>
                <div className="flex items-center gap-2 mt-1 lg:mt-2">
                  <div className="px-2 py-0.5 bg-blue-50 rounded-md border border-blue-100 flex items-center gap-1.5">
                    <BookOpen size={10} className="text-blue-600" />
                    <span className="text-[9px] font-black uppercase text-blue-600">{p.course_title}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-none border-slate-50">
              <div className="text-left lg:text-right">
                <p className="text-lg lg:text-2xl font-black text-slate-900 tabular-nums">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-tighter italic">{p.payment_method}</span>
              </div>
              <button 
                onClick={() => setSelectedPayment(p)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-black shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95 group/btn"
              >
                <span className="text-[10px] lg:text-xs uppercase tracking-widest">Tinjau</span>
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Optimized Verification Modal (Mobile Friendly) */}
      {selectedPayment && (
        <div className="fixed inset-0 z-[999] flex items-end lg:items-center justify-center p-0 lg:p-4">
          {/* Overlay dengan blur yang lebih halus */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" 
            onClick={() => setSelectedPayment(null)}
          ></div>
          
          {/* Container Modal Utama */}
          <div className="bg-white w-full max-w-xl h-[85vh] lg:h-auto lg:max-h-[90vh] rounded-t-[2.5rem] lg:rounded-[3.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom lg:zoom-in-95 duration-500">
            
            {/* Header: Visual yang lebih kuat */}
            <div className="p-6 lg:p-8 bg-white border-b border-slate-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 rotate-3 group-hover:rotate-0 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none">Validasi</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Konfirmasi Pembayaran</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPayment(null)} 
                className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-slate-300 hover:text-red-500 active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body: Scrollable dengan visual hierarchy yang rapi */}
            <div className="p-6 lg:p-10 space-y-8 overflow-y-auto flex-grow custom-scrollbar">
              
              {/* Ringkasan Transaksi dalam Card */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Nama Peserta</span>
                    <p className="font-bold text-slate-800 text-base">{selectedPayment.student_name}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Metode</span>
                    <p className="font-black text-blue-600 text-base uppercase italic">{selectedPayment.payment_method}</p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Program Pelatihan</span>
                    <p className="font-black text-slate-800 text-xs lg:text-sm uppercase italic leading-tight">{selectedPayment.course_title}</p>
                  </div>
                </div>

                {/* Display Nominal Utama */}
                <div className="relative overflow-hidden p-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] shadow-xl shadow-blue-100 text-center group">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.4em] mb-2 drop-shadow-sm">Total Dana Diterima</p>
                  <p className="font-black text-white text-3xl lg:text-4xl tracking-tight tabular-nums drop-shadow-md">
                    Rp {Number(selectedPayment.price).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Instruksi Admin */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-amber-50/50 rounded-3xl border border-amber-100/50 group">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0 group-hover:shake transition-transform">
                    <Info size={20} />
                  </div>
                  <p className="text-[11px] font-bold text-amber-700 leading-relaxed italic">
                    Mohon pastikan nominal mutasi di rekening bank Anda <span className="underline decoration-amber-300 decoration-2 font-black">tepat sesuai</span> dengan angka di atas sebelum melakukan aktivasi.
                  </p>
                </div>

                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Aktivasi Otomatis Ready</p>
                </div>
              </div>
            </div>

            {/* Footer: Tombol yang menempel dan responsif */}
            <div className="p-6 lg:p-8 border-t border-slate-50 bg-white shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col-reverse lg:flex-row gap-4">
                <button 
                  onClick={() => setSelectedPayment(null)}
                  className="flex-1 py-5 rounded-[1.5rem] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
                >
                  Tutup Panel
                </button>
                <button 
                  onClick={handleConfirmVerify}
                  disabled={isVerifying}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] italic active:scale-95 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CheckCircle size={20} className="text-blue-300" />
                  )}
                  {isVerifying ? "Memproses Data..." : "Konfirmasi & Buka Akses"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}