export default function Loading() {
  return (
    <div className="min-h-screen bg-emerald-background flex flex-col items-center justify-center gap-8 px-6">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-fast absolute -top-32 -right-32 w-96 h-96 bg-emerald-300/15 dark:bg-emerald-900/25" />
        <div className="blob blob-slow absolute bottom-1/3 -left-40 w-[500px] h-[500px] bg-teal-200/10 dark:bg-teal-900/15" />
      </div>

      {/* Logo + brand */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-lg shadow-emerald-500/20">
          {/* Spinner replaces sparkles while loading */}
          <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
        <span className="text-xl font-extrabold gradient-text font-headline tracking-tight">
          EmeraldClean
        </span>
      </div>

      {/* Skeleton cards */}
      <div className="w-full max-w-lg space-y-4">
        {/* Hero skeleton */}
        <div className="glass rounded-3xl p-8 space-y-4">
          <div className="h-8 w-2/3 rounded-xl skeleton" />
          <div className="h-4 w-full rounded-xl skeleton" />
          <div className="h-4 w-4/5 rounded-xl skeleton" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-32 rounded-full skeleton" />
            <div className="h-10 w-32 rounded-full skeleton" />
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-2xl p-4 space-y-2">
              <div className="h-8 w-full rounded-lg skeleton" />
              <div className="h-3 w-2/3 rounded-lg skeleton" />
            </div>
          ))}
        </div>
      </div>

      <p className="text-emerald-text-muted text-sm animate-pulse">Preparing your clean…</p>
    </div>
  );
}
