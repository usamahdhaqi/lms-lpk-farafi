import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, Download, ShieldCheck } from 'lucide-react';

export default function CertificatePage() {
  const { user } = useAuth();

  // Mockup sertifikat yang sudah lulus
  const certificates = [
    { id: 'CERT-12345', course: 'Operator Komputer Dasar', date: '12 Okt 2023' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800">Sertifikat Resmi</h1>
        <p className="text-slate-500">Unduh sertifikat kompetensi yang telah Anda raih.</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} className="bg-white rounded-[2rem] border-2 border-slate-100 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10">
                <Award size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
                  <ShieldCheck size={16} /> Terverifikasi LPK Farafi
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{cert.course}</h3>
                <p className="text-slate-400 text-sm mb-8">Diterbitkan pada: {cert.date}</p>
                
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                  <Download size={20} /> Unduh Sertifikat (PDF)
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Award size={40} />
          </div>
          <p className="text-slate-400 font-medium">Belum ada sertifikat. Selesaikan kuis kelulusan di kursus Anda!</p>
        </div>
      )}
    </div>
  );
}