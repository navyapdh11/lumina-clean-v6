import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-emerald-background flex flex-col items-center justify-center gap-8 px-6">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-slow absolute -top-40 right-0 w-[600px] h-[600px] bg-emerald-200/10 dark:bg-emerald-900/20" />
        <div className="blob blob-fast absolute bottom-0 left-0 w-96 h-96 bg-teal-200/10 dark:bg-teal-900/15" />
      </div>

      {/* 404 display */}
      <div className="text-center">
        <div className="font-headline font-extrabold text-[160px] leading-none select-none gradient-text opacity-10 mb-0">
          404
        </div>
        <div className="-mt-12">
          <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-headline font-extrabold text-4xl text-emerald-text mb-3">
            Page not found
          </h1>
          <p className="text-emerald-text-muted max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/emerald"
          className="btn-gradient text-white font-bold px-8 py-3 rounded-2xl shadow-lg"
        >
          Back to Home
        </Link>
        <Link
          href="/emerald/services"
          className="glass text-emerald-text font-semibold px-8 py-3 rounded-2xl border border-emerald-outline/20 hover:border-emerald-primary/40 transition-colors"
        >
          Browse Services
        </Link>
      </div>
    </div>
  );
}
