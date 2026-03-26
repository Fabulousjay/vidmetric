'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 gap-6">
      <div className="w-16 h-16 rounded-3xl bg-rose/10 flex items-center justify-center">
        <AlertCircle size={28} className="text-rose" strokeWidth={1.5} />
      </div>

      <div className="text-center flex flex-col gap-2">
        <h2 className="font-display text-xl font-bold text-ink dark:text-chalk">
          Something went wrong
        </h2>
        <p className="text-fog text-sm max-w-sm leading-relaxed">
          {error.message}
        </p>
      </div>

      <button onClick={reset} className="btn-primary flex items-center gap-2">
        <RotateCcw size={14} strokeWidth={2} />
        Try again
      </button>
    </div>
  );
}
