import React from 'react';
import { useNavigate } from 'react-router-dom';

const courses = [
  { id: 1, title: 'Pelatihan Operator Komputer', price: 'Rp 500.000', img: '/img/komputer.jpg' },
  { id: 2, title: 'Teknisi Handphone', price: 'Rp 750.000', img: '/img/hp.jpg' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="p-6 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">LPK FARAFI</h1>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Masuk</button>
      </nav>
      
      <main className="p-10">
        <h2 className="text-3xl font-bold mb-8 text-center">Katalog Kursus</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-blue-600 font-semibold mb-4">{course.price}</p>
              <button 
                onClick={() => navigate('/register')}
                className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition"
              >
                Pilih Kursus
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}