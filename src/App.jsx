import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import CourseContent from './pages/learning/CourseContent';
import QuizPage from './pages/learning/QuizPage';
import StudentProfile from './pages/dashboard/StudentProfile';
import CertificatePage from './pages/dashboard/CertificatePage';
import AdminDashboard from './pages/admin/AdminDashboard';

// --- NEW INSTRUCTOR PAGES ---
import InstructorDashboard from './pages/instructor/InstructorDashboard';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

// --- NEW INSTRUCTOR ROUTE PROTECTION ---
const InstructorRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'instruktur' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* SISWA */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="certificates" element={<CertificatePage />} />
            <Route path="course/:courseId" element={<CourseContent />} />
            <Route path="course/:courseId/quiz" element={<QuizPage />} />
          </Route>

          {/* INSTRUKTUR */}
          <Route path="/instructor" element={<InstructorRoute><DashboardLayout /></InstructorRoute>}>
            <Route index element={<InstructorDashboard />} />
            {/* Tambah rute instruktur lain di sini */}
          </Route>

          {/* ADMIN */}
          <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Komponen 404 agar rapi
const NotFound = () => (
  <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
    <h1 className="text-9xl font-black text-slate-200">404</h1>
    <p className="text-xl font-bold text-slate-500 -mt-8">Halaman Tidak Ditemukan</p>
    <Link to="/" className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Kembali ke Beranda</Link>
  </div>
);

export default App;