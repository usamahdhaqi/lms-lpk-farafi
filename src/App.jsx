import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Import Pages (Fase Umum)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Import Pages (Siswa)
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CourseContent from './pages/learning/CourseContent';
import QuizPage from './pages/learning/QuizPage';
import StudentProfile from './pages/dashboard/StudentProfile';
import CertificatePage from './pages/dashboard/CertificatePage';

// Import Pages (Instruktur)
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import StudentMonitoring from './pages/instructor/StudentMonitoring';
import QuizBank from './pages/instructor/QuizBank';

// Import Pages (Admin)
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PaymentVerification from './pages/admin/PaymentVerification';

/**
 * Proteksi Rute Siswa: 
 * Hanya mengizinkan role 'siswa'. Jika instruktur/admin nyasar ke sini, 
 * mereka diredirect ke dashboard masing-masing.
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'instruktur') return <Navigate to="/instructor" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  
  return children;
};

/**
 * Proteksi Rute Instruktur:
 * Memastikan hanya user dengan role 'instruktur' yang bisa akses.
 */
const InstructorRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'instruktur' ? children : <Navigate to="/dashboard" />;
};

/**
 * Proteksi Rute Admin:
 * Memastikan hanya user dengan role 'admin' yang bisa akses.
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

          {/* --- SISWA ROUTES (Dashboard Utama) --- */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="certificates" element={<CertificatePage />} />
            <Route path="course/:courseId" element={<CourseContent />} />
            <Route path="course/:courseId/quiz" element={<QuizPage />} />
          </Route>

          {/* --- INSTRUCTOR ROUTES --- */}
          <Route 
            path="/instructor" 
            element={
              <InstructorRoute>
                <DashboardLayout />
              </InstructorRoute>
            }
          >
            <Route index element={<InstructorDashboard />} />
              <Route path="my-courses" element={<InstructorCourses />} />
              <Route path="students" element={<StudentMonitoring />} />
              <Route path="quiz-bank/:courseId" element={<QuizBank />} />
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="payments" element={<PaymentVerification />} />
          </Route>

          {/* --- 404 NOT FOUND --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Komponen tampilan jika halaman tidak ditemukan
const NotFound = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
    <h1 className="text-9xl font-black text-slate-200">404</h1>
    <p className="text-2xl font-bold text-slate-800 -mt-6">Halaman Tidak Ditemukan</p>
    <p className="text-slate-500 mt-2">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
    <Link 
      to="/" 
      className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
    >
      Kembali ke Beranda
    </Link>
  </div>
);

export default App;