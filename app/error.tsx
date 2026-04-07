'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-red-950 via-black to-orange-950">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-8">🔧</div>
        <h1 className="text-5xl font-black text-red-400 mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Something Went Wrong</h2>
        <p className="text-gray-400 text-lg mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-cyan-500 px-8 py-4 rounded-2xl text-lg font-bold text-white hover:bg-cyan-600 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl text-lg font-bold text-white hover:bg-white/20 transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
