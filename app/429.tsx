import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '429 — Too Many Requests | LuminaClean',
  description: 'You have exceeded the rate limit. Please wait a moment and try again.',
  robots: { index: false },
};

export default function TooManyRequests() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
          429
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Too Many Requests</h2>
        <p className="text-gray-400 mb-8">
          You&apos;ve made too many requests. Please wait a moment and try again.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl text-lg font-bold text-white hover:scale-105 transition-transform"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
