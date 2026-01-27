import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, ShieldCheck, Loader2, Landmark, Zap, ChevronRight, FileText } from 'lucide-react';
import api from '../../api/api';
import { jsPDF } from 'jspdf';

export default function CertificatePage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await api.get(`/api/certificates/user/${user.id}`);
        setCertificates(response.data);
      } catch (error) {
        console.error("Gagal memuat sertifikat:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCertificates();
  }, [user]);

  const downloadPDF = (cert) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Helper Function agar teks tetap center secara presisi meski ada charSpace
    const centeredText = (text, y, fontSize, charSpace = 0, style = 'normal', font = 'helvetica', color = [15, 23, 42]) => {
      doc.setFont(font, style);
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      const totalCharSpace = (text.length - 1) * charSpace;
      const finalWidth = textWidth + totalCharSpace;
      
      const xPos = (width - finalWidth) / 2;
      doc.text(text, xPos, y, { charSpace: charSpace });
    };

    // --- 1. LATAR BELAKANG & ELEMEN ESTETIKA ---
    doc.setFillColor(255, 255, 255); // Putih bersih
    doc.rect(0, 0, width, height, 'F');

    // Watermark Lingkaran Halus di Latar Belakang
    doc.setDrawColor(240, 240, 230);
    doc.setLineWidth(0.1);
    doc.circle(width / 2, height / 2, 80, 'S');
    doc.circle(width / 2, height / 2, 85, 'S');

    // Bingkai Luar (Navy)
    doc.setDrawColor(15, 23, 42); 
    doc.setLineWidth(1);
    doc.rect(8, 8, width - 16, height - 16);

    // Bingkai Dalam Double Line (Gold)
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.4);
    doc.rect(12, 12, width - 24, height - 24);
    doc.rect(13.5, 13.5, width - 27, height - 27);

    // Ornamen Sudut Solid
    doc.setFillColor(15, 23, 42);
    // Kiri Atas
    doc.rect(8, 8, 25, 3, 'F'); doc.rect(8, 8, 3, 25, 'F');
    // Kanan Atas
    doc.rect(width - 33, 8, 25, 3, 'F'); doc.rect(width - 11, 8, 3, 25, 'F');
    // Kiri Bawah
    doc.rect(8, height - 11, 25, 3, 'F'); doc.rect(8, height - 33, 3, 25, 'F');
    // Kanan Bawah
    doc.rect(width - 33, height - 11, 25, 3, 'F'); doc.rect(width - 11, height - 33, 3, 25, 'F');

    // --- 2. HEADER ---
    centeredText('LEMBAGA PELATIHAN KERJA', 28, 10, 2, 'bold', 'times', [100, 100, 100]);
    centeredText('LPK FARAFI', 38, 26, 1, 'bold', 'times', [15, 23, 42]);

    // Divider
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.8);
    doc.line(width / 2 - 15, 42, width / 2 + 15, 42);

    // --- 3. JUDUL SERTIFIKAT ---
    centeredText('CERTIFICATE', 65, 42, 5, 'bold', 'helvetica', [197, 160, 89]);
    centeredText('OF ACHIEVEMENT', 73, 14, 10, 'normal', 'helvetica', [71, 85, 105]);

    // --- 4. ISI ---
    centeredText('Dengan bangga diberikan kepada:', 90, 12, 0, 'italic', 'helvetica', [100, 100, 100]);

    // Nama Penerima
    const userName = user.name.toUpperCase();
    centeredText(userName, 108, 38, 0, 'bold', 'times', [15, 23, 42]);

    // Garis Nama (Emas)
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 60, 112, width / 2 + 60, 112);

    centeredText('Telah menunjukkan dedikasi luar biasa dalam menyelesaikan program:', 125, 13, 0, 'normal', 'helvetica', [71, 85, 105]);

    // Nama Kursus
    centeredText(cert.course_name, 136, 20, 0, 'bold', 'helvetica', [15, 23, 42]);

    // Footer Info
    const tgl = cert.date ? new Date(cert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    centeredText(`Diterbitkan pada ${tgl} | Skor Akhir: ${cert.quiz_score}/100`, 146, 10, 0, 'italic', 'helvetica', [120, 120, 120]);

    // --- 5. FOOTER & TANDA TANGAN ---
    // QR Code Area (Kiri)
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(35, 160, 22, 22);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text('ID: ' + cert.cert_id.toString().padStart(8, '0'), 46, 186, { align: 'center' });

    // Gold Seal (Tengah)
    // Membuat efek gerigi sederhana dengan dua lingkaran bertumpuk
    doc.setFillColor(197, 160, 89);
    doc.circle(width / 2, 172, 13, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.circle(width / 2, 172, 11, 'S');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text('CERTIFIED', width / 2, 171, { align: 'center' });
    doc.text('QUALITY', width / 2, 174, { align: 'center' });

    // Tanda Tangan (Kanan)
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text('Pimpinan LPK Farafi', width - 65, 163, { align: 'center' });
    
    // Garis Tangan
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(width - 90, 180, width - 40, 180);
    
    doc.setFontSize(11);
    doc.text('M. Jazim R. S.Sos.', width - 65, 185, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");

    doc.save(`Sertifikat_LPK_Farafi_${user.name.replace(/\s+/g, '_')}.pdf`);

    //pemicu notifikasi setelah download selesai
    setShowToast(true);
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="font-black text-slate-300 uppercase tracking-[0.3em] text-[10px]">Menyusun Berkas Resmi...</p>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 lg:space-y-12 pb-20 px-4 animate-in fade-in duration-700 mt-4">
      
      {/* 1. Enhanced Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-2">
            <Zap size={14} className="fill-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Achievement Center</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
            Sertifikat <span className="text-blue-600">Kompetensi</span>
          </h1>
          <p className="text-slate-500 font-medium">Bukti resmi keahlian Anda yang diakui secara digital.</p>
        </div>

        <div className="bg-slate-900 px-8 py-5 rounded-[2rem] flex items-center gap-5 shadow-2xl self-center lg:self-auto">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Koleksi</p>
            <p className="text-3xl font-black text-white italic">{certificates.length} <span className="text-xs text-slate-500 not-italic uppercase tracking-widest ml-1">Berkas</span></p>
          </div>
        </div>
      </header>

      {/* 2. Grid Area */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {certificates.map((cert) => (
            <div key={cert.cert_id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl hover:border-blue-500 transition-all duration-500 overflow-hidden flex flex-col">
              
              <div className="bg-slate-50 p-8 lg:p-12 relative overflow-hidden flex-1">
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 text-blue-600/5 group-hover:text-blue-600/10 group-hover:scale-125 transition-all duration-700">
                  <Award size={300} />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full text-blue-600 font-black text-[9px] uppercase tracking-[0.2em] shadow-sm border border-blue-50 mb-8 lg:mb-12">
                    <ShieldCheck size={14} /> Terverifikasi Sistem
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors uppercase italic">
                    {cert.course_name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">
                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-slate-600">
                       <Award size={14} className="text-blue-500" /> Skor: {cert.quiz_score}
                    </span>
                    <span className="flex items-center gap-2">
                       <FileText size={14} /> ID: {cert.cert_id}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => downloadPDF(cert)}
                    className="group/btn w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest text-xs italic"
                  >
                    <Download size={20} className="group-hover/btn:-translate-y-1 transition-transform" /> 
                    Unduh Sertifikat PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 lg:p-24 rounded-[4rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
          <div className="bg-slate-50 w-32 h-32 rounded-[3rem] flex items-center justify-center mb-8 text-slate-200 shadow-inner">
            <Award size={64} />
          </div>
          <h3 className="text-3xl font-black text-slate-800 mb-3 uppercase italic">Belum Ada Kelulusan</h3>
          <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">
            Selesaikan pelatihan Anda dan raih skor minimal <span className="text-blue-600 font-bold underline">75</span> pada ujian akhir untuk menerbitkan sertifikat kompetensi resmi.
          </p>
          <button className="mt-10 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest group">
            Mulai Belajar Sekarang <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* MODAL NOTIFIKASI BERHASIL (STYLE BENTO CENTER) */}
      {showToast && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowToast(false)}
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Aksen Hijau Tetap Ada */}
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

            <div className="w-24 h-24 mx-auto mb-6 rounded-[2rem] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg transform rotate-3">
              <ShieldCheck size={48} />
            </div>

            <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">
              Berhasil!
            </h3>
            
            <p className="text-slate-500 mt-4 font-medium leading-relaxed">
              Sertifikat Anda telah berhasil <br/>
              <span className="font-bold text-slate-800 underline decoration-emerald-200">diunduh secara resmi.</span>
            </p>

            {/* Tombol yang lebih tegas untuk menutup */}
            <div className="mt-10">
              <button 
                onClick={() => setShowToast(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest text-xs italic"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}