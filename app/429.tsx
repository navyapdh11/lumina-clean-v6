import { Metadata } from 'next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Too Many Requests | LuminaClean',
  description: 'You have made too many requests. Please wait a moment and try again.',
};

export default function TooManyRequests() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6"
    >
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-8xl mb-8"
        >
          🚦
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
          429
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Too Many Requests</h2>
        <p className="text-gray-400 text-lg mb-8">
          You&apos;ve made quite a few requests! Please take a short break and try again in a moment.
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
          <Clock className="w-5 h-5" />
          <span>Try again in 10 seconds</span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
