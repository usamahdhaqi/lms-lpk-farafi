import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Import Pages (Fase 1)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Import Pages (Fase 2 & 3)
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CourseContent from './pages/learning/CourseContent';
import QuizPage from './pages/learning/QuizPage';
import StudentProfile from './pages/dashboard/StudentProfile';

// Import Pages (Fase 4)
import CertificatePage from './pages/dashboard/CertificatePage';

// Import Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Import Provider & Context
import { AuthProvider, useAuth } from './context/AuthContext';

/**
 * Proteksi Rute Siswa: Jika belum login, dilempar ke /login
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

/**
 * Proteksi Rute Admin: Memastikan hanya admin yang bisa akses
 */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- STUDENT ROUTES (Menggunakan DashboardLayout agar Sidebar muncul) --- */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* path: /dashboard */}
            <Route index element={<StudentDashboard />} />
            
            {/* path: /dashboard/profile */}
            <Route path="profile" element={<StudentProfile />} />
            
            {/* path: /dashboard/certificates */}
            <Route path="certificates" element={<CertificatePage />} />
            
            {/* path: /dashboard/course/:id */}
            <Route path="course/:courseId" element={<CourseContent />} />
            <Route path="course/:courseId/quiz" element={<QuizPage />} />
          </Route>

          {/* --- ADMIN ROUTES (Juga menggunakan DashboardLayout agar UI konsisten) --- */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            {/* path: /admin */}
            <Route index element={<AdminDashboard />} />
            {/* Anda bisa tambah rute admin lain di sini seperti 'users' atau 'reports' */}
          </Route>

          {/* --- 404 NOT FOUND --- */}
          <Route path="*" element={
            <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
              <h1 className="text-9xl font-black text-slate-200">404</h1>
              <p className="text-xl font-bold text-slate-500 -mt-8">Halaman Tidak Ditemukan</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100"
              >
                Kembali ke Beranda
              </button>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;