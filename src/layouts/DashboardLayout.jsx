import { useState } from 'react'; // Tambahkan useState
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, User, Award, LogOut, ShieldCheck, Menu, X 
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false); // State untuk sidebar HP
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const menuItems = isAdmin 
    ? [{ path: '/admin', label: 'Admin Panel', icon: <ShieldCheck size={20} /> }]
    : [
        { path: '/dashboard', label: 'Kursus Saya', icon: <BookOpen size={20} /> },
        { path: '/profile', label: 'Profil Saya', icon: <User size={20} /> },
        { path: '/certificates', label: 'Sertifikat', icon: <Award size={20} /> },
      ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR - Sekarang mendukung Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 transition-transform duration-300 transform
        md:relative md:translate-x-0 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div>
            <h2 className="font-black text-2xl text-blue-600 tracking-tighter">LPK FARAFI</h2>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">LMS System</p>
          </div>
          {/* Tombol Tutup di Mobile */}
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)} // Tutup sidebar setelah klik di HP
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition mt-auto">
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      {/* OVERLAY untuk Mobile saat sidebar buka */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar khusus HP */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center md:hidden">
           <h2 className="font-black text-blue-600 tracking-tighter">LPK FARAFI</h2>
           <button 
             onClick={() => setIsMobileOpen(true)}
             className="p-2 bg-slate-100 rounded-lg text-slate-600"
           >
             <Menu size={24} />
           </button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}