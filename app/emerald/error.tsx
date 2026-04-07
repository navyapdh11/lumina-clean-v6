'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-emerald-background px-6">
      <div className="max-w-md text-center">
        <h2 className="text-3xl font-bold text-emerald-text">Something went wrong</h2>
        <p className="mt-3 text-emerald-text-muted">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 btn-gradient text-white px-6 py-3 rounded-full font-semibold"
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
