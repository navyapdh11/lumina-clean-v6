'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Wrench } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-AU">
      <body className="bg-gradient-to-br from-red-950 via-black to-orange-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center px-6"
        >
          <div className="text-center max-w-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="text-8xl mb-8"
            >
              🔧
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Oops!
            </h1>
            <h2 className="text-2xl font-bold text-white mb-4">Something Went Wrong</h2>
            <p className="text-gray-400 text-lg mb-8">
              An unexpected error occurred. Our team has been notified. Please try again or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform"
              >
                <Wrench className="w-5 h-5" />
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl text-lg font-bold hover:bg-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </body>
    </html>
  );
}
