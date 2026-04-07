'use client';

import { useEffect } from 'react';

export default function GlobalError({
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
    <html lang="en-AU">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
              Oops!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={reset}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform"
            >
              Try Again
            </button>
            {error.digest && (
              <p className="text-gray-500 text-sm mt-4">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
