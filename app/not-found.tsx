import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-cyan-950 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <h1 className="text-8xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
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
