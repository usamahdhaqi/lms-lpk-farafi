import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Import Pages (Fase 1: Pendaftaran)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Import Pages (Fase 2 & 3: Learning)
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CourseContent from './pages/learning/CourseContent';
import QuizPage from './pages/learning/QuizPage';

// Import Pages (Fase 4: Certification)
import CertificatePage from './pages/dashboard/CertificatePage';

// Import Provider
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Komponen untuk memproteksi halaman.
 * Jika belum login, dilempar ke /login
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES (Fase 1) */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* STUDENT ROUTES (Protected - Fase 2, 3, 4) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* PERBAIKAN DI SINI: Gunakan <Route index ... /> */}
            <Route index element={<StudentDashboard />} />
            
            <Route path="course/:courseId" element={<CourseContent />} />
            <Route path="course/:courseId/quiz" element={<QuizPage />} />
            <Route path="certificates" element={<CertificatePage />} />
          </Route>

          {/* ADMIN & INSTRUCTOR ROUTES (Bisa ditambahkan nanti) */}
          <Route path="/admin" element={<PrivateRoute><div>Admin Panel</div></PrivateRoute>} />

          {/* 404 NOT FOUND */}
          <Route path="*" element={<div className="flex h-screen items-center justify-center font-bold">404 - Halaman Tidak Ditemukan</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;