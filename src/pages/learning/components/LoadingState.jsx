import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500">Menyiapkan ruang belajar...</p>
    </div>
  );
}