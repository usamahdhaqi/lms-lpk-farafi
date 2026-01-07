import { useState } from 'react';

export default function Register() {
  const [step, setStep] = useState(1); // 1: Data Diri, 2: Pembayaran

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {step === 1 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Pendaftaran Siswa</h2>
          <input className="w-full p-3 border rounded-xl" placeholder="Nama Lengkap (Sesuai Sertifikat)" />
          <input className="w-full p-3 border rounded-xl" placeholder="Email Aktif" />
          <input className="w-full p-3 border rounded-xl" placeholder="Nomor WhatsApp (628...)" />
          <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
            Lanjut ke Pembayaran
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Pilih Metode Pembayaran</h2>
          <div className="grid grid-cols-1 gap-3">
            <button className="p-4 border rounded-xl text-left hover:border-blue-500">Bank Transfer (Manual)</button>
            <button className="p-4 border rounded-xl text-left hover:border-blue-500">Virtual Account (Otomatis)</button>
          </div>
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-4">
            Konfirmasi Pembayaran
          </button>
        </div>
      )}
    </div>
  );
}