import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { coursesData } from '../../data/coursesData';
import { courseService } from '../../api/courseService';

export default function CourseContent() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    // Cari data kursus berdasarkan ID
    const foundCourse = coursesData.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setActiveLesson(foundCourse.syllabus[0]);
    }
  }, [courseId]);

  const completeLesson = async (id) => {
    try {
        // 1. Pemicu Aksi Sistem ke Backend 
        await courseService.updateProgress(courseId, id);

        const updatedLessons = lessons.map((lesson, index) => {
        if (lesson.id === id) {
            return { ...lesson, isCompleted: true };
        }
        // Membuka materi berikutnya (Sequential Learning)
        if (index > 0 && lessons[index - 1].id === id) {
            return { ...lesson, isOpen: true };
        }
        return lesson;
        });
        
            setLessons(updatedLessons);
            alert("Progres berhasil disimpan ke database.");
        } catch (error) {
            console.error("Gagal memperbarui progres:", error);
        }
    };

  const handleComplete = async (lessonId) => {
    try {
      // 1. Panggil API untuk simpan progres di MySQL
      await courseService.updateProgress(courseId, lessonId);

      // 2. Update UI secara lokal (Buka materi berikutnya)
      const currentIndex = course.syllabus.findIndex(l => l.id === lessonId);
      const newSyllabus = [...course.syllabus];
      newSyllabus[currentIndex].isCompleted = true;
      
      if (newSyllabus[currentIndex + 1]) {
        newSyllabus[currentIndex + 1].isOpen = true;
      }

      setCourse({ ...course, syllabus: newSyllabus });
      alert("Materi selesai! Progres tersimpan di database.");
    } catch (err) {
      console.error("Gagal simpan progres", err);
    }
  };

  if (!course) return <div>Memuat materi...</div>;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Materi */}
      <div className="w-80 border-r overflow-y-auto p-4 bg-slate-50">
        <h2 className="font-bold mb-4">{course.title}</h2>
        <div className="space-y-2">
          {course.syllabus.map((lesson) => (
            <button
              key={lesson.id}
              disabled={!lesson.isOpen}
              onClick={() => setActiveLesson(lesson)}
              className={`w-full p-3 text-left rounded-lg text-sm transition ${
                activeLesson?.id === lesson.id ? 'bg-blue-600 text-white' : 'bg-white'
              } ${!lesson.isOpen ? 'opacity-50 grayscale' : 'hover:bg-blue-50'}`}
            >
              {lesson.isOpen ? (lesson.isCompleted ? '✅ ' : '▶️ ') : '🔒 '}
              {lesson.title}
            </button>
          ))}
        </div>
      </div>

      {/* Area Video/Konten */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeLesson && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{activeLesson.title}</h1>
            
            {activeLesson.type === 'video' ? (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6">
                <iframe 
                  width="100%" height="100%" 
                  src={activeLesson.contentUrl} 
                  title="Video Player"
                  frameBorder="0" 
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed rounded-2xl text-center mb-6">
                <p>Dokumen Materi: <a href={activeLesson.contentUrl} className="text-blue-600 underline">Unduh PDF</a></p>
              </div>
            )}

            <button 
              onClick={() => handleComplete(activeLesson.id)}
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition"
            >
              Tandai Selesai & Lanjut
            </button>
          </div>
        )}
      </div>
    </div>
  );
}