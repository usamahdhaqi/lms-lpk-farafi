import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';

// 1. Definisikan Style untuk Sertifikat PDF (Sesuai Fase 4)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#fff',
    border: '10pt solid #1e40af', // Border Biru LPK Farafi
  },
  container: {
    textAlign: 'center',
    border: '2pt solid #fbbf24', // Border emas tipis didalam
    padding: 20,
    height: '100%',
  },
  header: { fontSize: 30, marginBottom: 20, fontWeight: 'bold', color: '#1e40af' },
  subHeader: { fontSize: 18, marginBottom: 30 },
  studentName: { fontSize: 40, marginBottom: 10, textDecoration: 'underline', color: '#111' },
  courseName: { fontSize: 20, marginBottom: 40 },
  footer: { marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qrText: { fontSize: 10, color: '#666' }
});

// 2. Komponen Dokumen PDF (Otomasi Data) 
const MyCertificatePDF = ({ studentName, courseTitle, date, qrCodeUrl }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.header}>SERTIFIKAT KELULUSAN</Text>
        <Text style={styles.subHeader}>Diberikan kepada:</Text>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.courseName}>Atas keberhasilannya menyelesaikan pelatihan:{"\n"}{courseTitle}</Text>
        <Text style={{ fontSize: 14 }}>Diterbitkan pada: {date}</Text>
        
        <View style={styles.footer}>
          <View>
            <Text style={{ fontSize: 12 }}>Pimpinan LPK Farafi</Text>
            <Text style={{ marginTop: 40, fontWeight: 'bold' }}>( ........................... )</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.qrText}>Scan untuk Verifikasi Sertifikat</Text>
            {/* Di PDF nyata, QR Code biasanya dikirim sebagai Image Base64 dari backend/canvas */}
            <Text style={{ fontSize: 8, marginTop: 5 }}>ID: Farafi-{Math.random().toString(36).substr(2, 9).toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// 3. Halaman Dashboard Klaim Sertifikat
export default function CertificatePage() {
  const { user } = useAuth();
  
  // Mock Data Kelulusan (Diambil dari Fase 3)
  const graduateData = {
    studentName: user?.name || "Nama Siswa",
    courseTitle: "Pelatihan Operator Komputer Dasar",
    date: new Date().toLocaleDateString('id-ID'),
    verifyUrl: `https://lpkfarafi.com/verify/STF-2026-001` // Verifikasi Publik
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Sertifikat Anda</h1>
      
      <div className="bg-white border-2 border-dashed border-blue-200 rounded-3xl p-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-blue-50 rounded-full text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Selamat! Sertifikat Tersedia</h2>
        <p className="text-gray-500 mb-8">
          Anda telah lulus kursus <strong>{graduateData.courseTitle}</strong> dengan skor di atas 75.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Pratinjau QR Code Verifikasi  */}
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <QRCodeSVG value={graduateData.verifyUrl} size={100} />
            <p className="text-[10px] mt-2 text-gray-400">QR Verifikasi Publik</p>
          </div>

          {/* Tombol Unduh Otomatis */}
          <PDFDownloadLink 
            document={<MyCertificatePDF {...graduateData} />} 
            fileName={`Sertifikat_${graduateData.studentName}.pdf`}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            {({ loading }) => (loading ? 'Menyiapkan Dokumen...' : 'Unduh Sertifikat PDF')}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Instruksi Verifikasi */}
      <div className="mt-12 bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
        <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Informasi Penting
        </h3>
        <p className="text-sm text-yellow-700">
          Sertifikat ini dilengkapi dengan QR Code unik. Pihak perusahaan atau HRD dapat memindai kode tersebut untuk memvalidasi keaslian sertifikat Anda langsung melalui sistem LPK Farafi.
        </p>
      </div>
    </div>
  );
}