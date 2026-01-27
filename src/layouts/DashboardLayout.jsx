import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  User, 
  Award, 
  LogOut, 
  Menu, 
  X, 
  Users, 
  CreditCard,
  Settings,
  Presentation,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuItems = () => {
    const role = user?.role;
    if (role === 'admin') {
      return [
        { path: '/admin', label: 'Dashboard', icon: <ShieldCheck size={22} /> },
        { path: '/admin/payments', label: 'Verifikasi Bayar', icon: <CreditCard size={22} /> },
        { path: '/admin/users', label: 'Kelola Pengguna', icon: <Users size={22} /> },
        { path: '/admin/settings', label: 'Pengaturan', icon: <Settings size={22} /> },
      ];
    } 
    if (role === 'instruktur') {
      return [
        { path: '/instructor', label: 'Panel Instruktur', icon: <Presentation size={22} /> },
        { path: '/instructor/my-courses', label: 'Kursus Saya', icon: <BookOpen size={22} /> },
        { path: '/instructor/students', label: 'Monitoring Siswa', icon: <Users size={22} /> },
      ];
    }
    return [
      { path: '/dashboard', label: 'Kursus Saya', icon: <BookOpen size={22} /> },
      { path: '/dashboard/certificates', label: 'Sertifikat', icon: <Award size={22} /> },
      { path: '/dashboard/profile', label: 'Profil Saya', icon: <User size={22} /> },
    ];
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
      logout();
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-900">
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out md:relative
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-72'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-6 mb-2`}>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h2 className="text-xl font-black text-blue-600 tracking-tighter italic">LPK FARAFI</h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Learning System</p>
              </div>
            )}
            <button 
              onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} className="hidden md:block" />}
              <X size={20} className="md:hidden" />
            </button>
          </div>

          {/* User Profile Info */}
          <div className={`px-4 mb-6 transition-all ${isCollapsed ? 'opacity-0 invisible h-0' : 'opacity-100'}`}>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate text-slate-800">{user?.name}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {!isCollapsed && (
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 mt-2">Menu</p>
            )}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 group
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}
                  ${isCollapsed ? 'justify-center px-0' : ''}
                `}
              >
                <span className={`${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {/* Tooltip for collapsed mode */}
                {isCollapsed && (
                  <div className="absolute left-20 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 mt-auto border-t border-slate-100">
            <button 
              onClick={() => setShowLogoutModal(true)}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all group
                ${isCollapsed ? 'justify-center px-0' : ''}
              `}
            >
              <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
              {!isCollapsed && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar Mobile */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center md:hidden shrink-0">
           <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-slate-50 rounded-xl text-slate-600"><Menu size={24} /></button>
           <h2 className="font-black text-blue-600 italic">LPK FARAFI</h2>
           <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm">
             {user?.name?.charAt(0).toUpperCase()}
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- MODAL KONFIRMASI LOGOUT --- */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Overlay Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Aksen Merah di Atas */}
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

            {/* Ikon Utama */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center shadow-lg transform -rotate-3">
              <LogOut size={48} />
            </div>

            {/* Teks Deskripsi */}
            <h3 className="text-2xl font-black text-slate-800 uppercase italic leading-tight">
              Akhiri Sesi?
            </h3>
            
            <p className="text-slate-500 mt-4 font-medium leading-relaxed">
              Apakah Anda yakin ingin keluar <br/>
              dari <span className="font-bold text-slate-800 underline decoration-red-200 text-sm">Dashboard LPK Farafi?</span>
            </p>

            {/* Tombol Aksi */}
            <div className="mt-10 flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="w-full py-5 bg-red-500 text-white rounded-[2rem] font-black shadow-xl shadow-red-100 hover:bg-red-600 transition-all active:scale-95 uppercase tracking-widest text-xs italic"
              >
                YA, KELUAR SEKARANG
              </button>
              
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black hover:bg-slate-200 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
              >
                TETAP DI SINI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}