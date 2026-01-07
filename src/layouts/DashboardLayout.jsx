import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Mobile Responsive */}
      <aside className="w-64 bg-white border-r p-6 hidden md:block">
        <h2 className="font-bold text-xl text-blue-700 mb-10">LMS FARAFI</h2>
        <nav className="space-y-4 text-gray-600">
          <Link to="/dashboard" className="block hover:text-blue-600">Kursus Saya</Link>
          <Link to="/profile" className="block hover:text-blue-600">Profil</Link>
          <Link to="/certificates" className="block hover:text-blue-600">Sertifikat</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}