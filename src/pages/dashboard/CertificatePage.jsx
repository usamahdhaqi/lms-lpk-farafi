import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, ShieldCheck, Loader2, ExternalLink } from 'lucide-react';
import api from '../../api/api';
import { jsPDF } from 'jspdf'; // Import jsPDF

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

  // Fungsi Generate PDF Sertifikat
  const downloadPDF = (cert) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Desain Sederhana Sertifikat LPK Farafi
    doc.rect(10, 10, 277, 190); // Border
    doc.setFontSize(40);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text('SERTIFIKAT KELULUSAN', 148.5, 50, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text('Diberikan Kepada:', 148.5, 75, { align: 'center' });
    
    doc.setFontSize(30);
    doc.setTextColor(0);
    doc.text(user.name.toUpperCase(), 148.5, 95, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text(`Atas keberhasilannya menyelesaikan pelatihan:`, 148.5, 115, { align: 'center' });
    
    doc.setFontSize(22);
    doc.setTextColor(30);
    doc.text(cert.course_name, 148.5, 130, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`ID Sertifikat: ${cert.cert_id} | Tanggal: ${new Date(cert.date).toLocaleDateString('id-ID')}`, 148.5, 160, { align: 'center' });
    
    doc.text('Direktur LPK Farafi', 220, 180, { align: 'center' });
    doc.text('(____________________)', 220, 195, { align: 'center' });

    doc.save(`Sertifikat_${cert.course_name}_${user.name}.pdf`);
  };

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500">Mengecek data kelulusan...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Sertifikat Resmi</h1>
        <p className="text-slate-500">Klaim sertifikat kompetensi Anda yang sudah diverifikasi oleh LPK Farafi.</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {certificates.map((cert) => (
            <div key={cert.cert_id} className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-blue-500 transition-all">
              <div className="absolute top-0 right-0 p-10 text-blue-600/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Award size={180} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                  <ShieldCheck size={18} /> Terverifikasi Digital
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 leading-tight">{cert.course_name}</h3>
                <div className="flex flex-col gap-1 mb-8">
                  <p className="text-slate-400 text-sm font-medium">Skor Ujian: <span className="text-green-600 font-bold">{cert.quiz_score}</span></p>
                  <p className="text-slate-400 text-xs">ID: {cert.cert_id}</p>
                </div>
                
                <button 
                  onClick={() => downloadPDF(cert)}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition shadow-lg"
                >
                  <Download size={20} /> UNDUH SERTIFIKAT (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-24 rounded-[3.5rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-slate-300">
            <Award size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Sertifikat</h3>
          <p className="text-slate-400 text-sm max-w-sm">Selesaikan semua materi dan kuis kelulusan dengan nilai minimal 75 untuk mendapatkan sertifikat.</p>
        </div>
      )}
    </div>
  );
}