import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, User, Award, LogOut, ShieldCheck, Menu, X, 
  LayoutDashboard, Presentation, Users, Settings 
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // --- LOGIKA MENU DINAMIS BERDASARKAN ROLE ---
  const getMenuItems = () => {
    const role = user?.role;

    if (role === 'admin') {
      return [
        { path: '/admin', label: 'Admin Dashboard', icon: <ShieldCheck size={20} /> },
        { path: '/admin/users', label: 'Kelola User', icon: <Users size={20} /> },
        { path: '/admin/settings', label: 'Pengaturan', icon: <Settings size={20} /> },
      ];
    } 
    
    if (role === 'instruktur') {
      return [
        { path: '/instructor', label: 'Panel Instruktur', icon: <Presentation size={20} /> },
        { path: '/instructor/students', label: 'Monitoring Siswa', icon: <Users size={20} /> },
      ];
    }

    // Default: Siswa
    return [
      { path: '/dashboard', label: 'Kursus Saya', icon: <BookOpen size={20} /> },
      { path: '/dashboard/profile', label: 'Profil Saya', icon: <User size={20} /> },
      { path: '/dashboard/certificates', label: 'Sertifikat', icon: <Award size={20} /> },
    ];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    if (window.confirm("Yakin ingin keluar?")) {
      logout();
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-6 transition-transform duration-300 transform
        md:relative md:translate-x-0 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-10 px-2">
            <div>
              <h2 className="font-black text-2xl text-blue-600 tracking-tighter italic">LPK FARAFI</h2>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">Learning System</p>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          {/* User Badge */}
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-[10px] font-black text-blue-500 uppercase">{user?.role}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                  location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition mt-auto group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* OVERLAY Mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center md:hidden shrink-0">
           <h2 className="font-black text-blue-600 tracking-tighter">LPK FARAFI</h2>
           <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600"><Menu size={24} /></button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}