export default function Loading() {
  return (
    <div className="min-h-screen bg-emerald-background flex flex-col items-center justify-center gap-8 px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
        <div className="blob blob-slow absolute -top-40 right-0 w-[600px] h-[600px] bg-emerald-200/10 dark:bg-emerald-900/20" />
        <div className="blob blob-fast absolute bottom-0 left-0 w-96 h-96 bg-teal-200/10 dark:bg-teal-900/15" />
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
        <span className="text-xl font-extrabold gradient-text font-headline tracking-tight">
          EmeraldClean
        </span>
        <span className="text-emerald-text-muted text-sm">/ Marketing Hub</span>
      </div>

      {/* Metric card skeletons */}
      <div className="w-full max-w-4xl space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-glass p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl skeleton" />
              <div className="h-8 w-2/3 rounded-lg skeleton" />
              <div className="h-3 w-1/2 rounded-lg skeleton" />
            </div>
          ))}
        </div>
        <div className="card-glass p-8">
          <div className="h-5 w-1/3 rounded-lg skeleton mb-6" />
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="h-4 w-full rounded-lg skeleton" />
              <div className="h-4 w-5/6 rounded-lg skeleton" />
              <div className="h-4 w-3/4 rounded-lg skeleton" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full rounded-lg skeleton" />
              <div className="h-4 w-4/5 rounded-lg skeleton" />
              <div className="h-4 w-full rounded-lg skeleton" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-emerald-text-muted text-sm animate-pulse">Loading analytics…</p>
    </div>
  );
}
