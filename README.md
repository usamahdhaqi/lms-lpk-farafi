# 🎓 LMS LPK Farafi - Digital Learning Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

[cite_start]Platform Learning Management System (LMS) modern yang dirancang untuk **LPK Farafi** guna mengotomatisasi proses pelatihan, mulai dari pendaftaran hingga penerbitan sertifikat digital[cite: 3, 42].

---

## 🚀 Visi Proyek
[cite_start]Membangun ekosistem pembelajaran digital yang terpusat untuk mendistribusikan materi, mengotomatisasi penilaian, dan mempermudah klaim sertifikat bagi calon tenaga kerja[cite: 42].

## ✨ Fitur Utama (Sesuai SRS)

### 1. Pendaftaran & Aktivasi Otomatis (Fase 1)
* [cite_start]**Katalog Kursus**: Menampilkan daftar pelatihan yang tersedia secara publik[cite: 7, 62].
* [cite_start]**Registrasi Nama Sertifikat**: Pengambilan data nama lengkap sejak awal untuk otomasi sertifikat[cite: 8].
* [cite_start]**Multi-Payment Gateway**: Integrasi pembayaran otomatis (VA/E-Wallet) dan verifikasi manual[cite: 10, 13, 14].

### 2. Sequential Learning (Fase 2)
* [cite_start]**Prerequisite System**: Siswa wajib menyelesaikan materi Bab 1 sebelum dapat membuka materi berikutnya[cite: 17, 53].
* [cite_start]**Progress Tracking**: Sistem memantau persentase penyelesaian kursus secara real-time[cite: 20, 55].
* [cite_start]**Proteksi Video**: Keamanan materi dari klik kanan atau pengunduhan ilegal[cite: 70].

### 3. Evaluasi & Ujian (Fase 3)
* [cite_start]**Interactive Quiz**: Kuis pilihan ganda dengan batasan waktu (timer) dan pengacakan soal[cite: 26, 57].
* **Passing Grade 75**: Standar kelulusan otomatis. [cite_start]Jika skor < 75, siswa diarahkan untuk remedial[cite: 29, 59].

### 4. Sertifikasi Digital (Fase 4)
* [cite_start]**E-Certificate Generator**: Pembuatan sertifikat PDF otomatis yang menggabungkan Nama Siswa, Judul Kursus, dan Tanggal Lulus[cite: 33, 60].
* [cite_start]**QR Code Verification**: Fitur scan QR Code untuk validasi keaslian sertifikat oleh pihak luar/HRD[cite: 35, 81].

---

## 🛠️ Tech Stack
- **Frontend**: React.js v18+ (Vite)
- **Styling**: Tailwind CSS v4.0 (Modern CSS-first configuration)
- **Routing**: React Router DOM v6
- **State Management**: Context API
- **Icons**: Lucide React
- **PDF Engine**: @react-pdf/renderer
- [cite_start]**Notification**: WhatsApp API Integration (Fonnte/Wablas) [cite: 80]

---

## 📂 Struktur Proyek
```text
src/
├── api/          # Konfigurasi Axios & Endpoint API
├── components/   # Komponen UI Reusable (Navbar, VideoPlayer, QuizCard)
├── context/      # AuthContext & State Management
├── layouts/      # Dashboard & Public Layouts
├── pages/        # Landing, Login, Dashboard, Learning, Admin
└── utils/        # PDF Generator & Helper Fungsi

## ⚙️ Instalasi & Pengembangan
```Clone Repository