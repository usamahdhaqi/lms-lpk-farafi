export const coursesData = [
  {
    id: "comp-001",
    title: "Pelatihan Operator Komputer Dasar",
    category: "Teknologi",
    instructor: "Budi Santoso, S.Kom",
    totalLessons: 4,
    syllabus: [
      {
        id: "lesson-1",
        title: "Pengenalan Hardware & Software",
        type: "video",
        contentUrl: "https://www.youtube.com/embed/example1",
        duration: "10:20",
        isCompleted: true, // Default untuk simulasi
        isOpen: true
      },
      {
        id: "lesson-2",
        title: "Manajemen File & Folder di Windows",
        type: "video",
        contentUrl: "https://www.youtube.com/embed/example2",
        duration: "15:45",
        isCompleted: false,
        isOpen: true
      },
      {
        id: "lesson-3",
        title: "Panduan Dasar Microsoft Word",
        type: "pdf",
        contentUrl: "/docs/modul-word.pdf",
        isCompleted: false,
        isOpen: false
      },
      {
        id: "lesson-4",
        title: "Ujian Akhir Kompetensi",
        type: "quiz",
        isCompleted: false,
        isOpen: false,
        passingGrade: 75
      }
    ]
  }
];