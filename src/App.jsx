import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Import Pages (Fase 1: Pendaftaran & Aktivasi) [cite: 6]
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Import Pages (Fase 2 & 3: Learning & Evaluasi) [cite: 15, 23]
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CourseContent from './pages/learning/CourseContent';
import QuizPage from './pages/learning/QuizPage';
import StudentProfile from './pages/dashboard/StudentProfile';

// Import Pages (Fase 4: Sertifikasi) [cite: 31]
import CertificatePage from './pages/dashboard/CertificatePage';

// Import Admin Pages (Penyebab Error Sebelumnya) 
import AdminDashboard from './pages/admin/AdminDashboard';

// Import Provider & Context
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Proteksi Rute Siswa: Jika belum login, dilempar ke /login [cite: 68]
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

/**
 * Proteksi Rute Admin: Hanya pengguna dengan role 'admin' yang bisa masuk 
 */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  // Memastikan user ada dan memiliki hak akses admin 
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES - Fase 1 [cite: 7, 8] */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* STUDENT ROUTES (Protected) - Fase 2, 3, 4 [cite: 16, 24, 32] */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="course/:courseId" element={<CourseContent />} />
            <Route path="course/:courseId/quiz" element={<QuizPage />} />
            <Route path="certificates" element={<CertificatePage />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* ADMIN ROUTES (Protected)  */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* 404 NOT FOUND */}
          <Route path="*" element={<div className="flex h-screen items-center justify-center font-bold">404 - Halaman Tidak Ditemukan</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;