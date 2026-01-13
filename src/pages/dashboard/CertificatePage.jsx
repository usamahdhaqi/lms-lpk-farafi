import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, ShieldCheck, Loader2, Landmark } from 'lucide-react';
import api from '../../api/api';
import { jsPDF } from 'jspdf';

export default function CertificatePage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // 1. BACKGROUND & BORDER MEWAH
    // Bingkai Luar (Emas/Biru Tua)
    doc.setDrawColor(30, 58, 138); // Blue-900
    doc.setLineWidth(2);
    doc.rect(5, 5, width - 10, height - 10); 
    
    // Bingkai Dalam (Double Line Effect)
    doc.setLineWidth(0.5);
    doc.rect(7, 7, width - 14, height - 14);

    // Ornamen Sudut (Simulasi)
    doc.setFillColor(30, 58, 138);
    doc.rect(5, 5, 15, 15, 'F'); // Kiri Atas
    doc.rect(width - 20, 5, 15, 15, 'F'); // Kanan Atas
    doc.rect(5, height - 20, 15, 15, 'F'); // Kiri Bawah
    doc.rect(width - 20, height - 20, 15, 15, 'F'); // Kanan Bawah

    // 2. HEADER
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text('LEMBAGA PELATIHAN KERJA', width / 2, 25, { align: 'center' });
    
    doc.setFontSize(28);
    doc.setTextColor(30, 58, 138);
    doc.text('LPK FARAFI', width / 2, 35, { align: 'center' });
    
    doc.setDrawColor(200);
    doc.line(60, 40, width - 60, 40); // Garis dekorasi bawah nama LPK

    // 3. JUDUL SERTIFIKAT
    doc.setFontSize(35);
    doc.setTextColor(184, 134, 11); // Gold Color
    doc.text('SERTIFIKAT KELULUSAN', width / 2, 60, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text('Nomor Sertifikat: LPK-FRF/' + cert.cert_id + '/' + new Date().getFullYear(), width / 2, 70, { align: 'center' });

    // 4. ISI UTAMA
    doc.setFontSize(16);
    doc.setTextColor(60);
    doc.text('Diberikan dengan bangga kepada:', width / 2, 85, { align: 'center' });

    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(user.name.toUpperCase(), width / 2, 100, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text('Atas prestasi dan keberhasilannya dalam menyelesaikan pelatihan:', width / 2, 115, { align: 'center' });

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 58, 138);
    doc.text('"' + cert.course_name + '"', width / 2, 130, { align: 'center' });

    // 5. SKOR & TANGGAL
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    const tgl = cert.date ? new Date(cert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    doc.text(`Dinyatakan Lulus pada tanggal ${tgl} dengan skor akhir: ${cert.quiz_score}/100`, width / 2, 145, { align: 'center' });

    // 6. TANDA TANGAN & STEMPEL (Simulasi)
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30);
    doc.text('Direktur LPK Farafi', width - 70, 165, { align: 'center' });
    
    // Tempat Tanda Tangan
    doc.setDrawColor(200);
    doc.line(width - 100, 185, width - 40, 185);
    
    doc.setFontSize(11);
    doc.text('NIDN. 1928374655', width - 70, 192, { align: 'center' });

    // Stempel / Seal Digital
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(1);
    doc.circle(50, 175, 15);
    doc.setFontSize(8);
    doc.text('OFFICIAL', 50, 174, { align: 'center' });
    doc.text('SEAL', 50, 178, { align: 'center' });

    // Simpan file
    doc.save(`Sertifikat_LPK_Farafi_${user.name}.pdf`);
  };

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-xs">Menyiapkan Berkas...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Sertifikat Kompetensi</h1>
          <p className="text-slate-500 font-medium">Bukti resmi keahlian Anda yang diakui secara digital.</p>
        </div>
        <div className="bg-blue-50 px-6 py-3 rounded-2xl flex items-center gap-3 text-blue-600 border border-blue-100">
          <Landmark size={20} />
          <span className="font-bold text-sm">Total: {certificates.length} Sertifikat</span>
        </div>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <div key={cert.cert_id} className="group bg-white rounded-[3rem] border-2 border-slate-50 p-1 shadow-2xl shadow-slate-200/50 hover:border-blue-500 transition-all duration-500">
              <div className="bg-slate-50 rounded-[2.8rem] p-10 relative overflow-hidden">
                {/* Elemen Dekoratif Kartu */}
                <div className="absolute -top-10 -right-10 text-blue-600/5 group-hover:scale-110 transition-transform duration-700">
                  <Award size={250} />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-blue-600 font-black text-[10px] uppercase tracking-widest shadow-sm mb-8 border border-blue-50">
                    <ShieldCheck size={14} /> Terverifikasi Sistem
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {cert.course_name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-10">
                    <span className="flex items-center gap-1"><Award size={14} /> Skor: {cert.quiz_score}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>ID: {cert.cert_id}</span>
                  </div>
                  
                  <button 
                    onClick={() => downloadPDF(cert)}
                    className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    <Download size={20} /> UNDUH SERTIFIKAT PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[4rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
          <div className="bg-slate-50 w-28 h-28 rounded-full flex items-center justify-center mb-6 text-slate-200">
            <Award size={60} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Belum Ada Kelulusan</h3>
          <p className="text-slate-400 text-sm max-w-sm font-medium">
            Selesaikan pelatihan dan raih skor minimal 75 pada ujian akhir untuk menerbitkan sertifikat Anda.
          </p>
        </div>
      )}
    </div>
  );
}