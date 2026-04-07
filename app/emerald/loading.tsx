export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-emerald-background text-emerald-text">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-4 border-emerald-primary/30 border-t-emerald-primary animate-spin" />
        <p className="mt-4 text-emerald-text-muted">Loading EmeraldClean...</p>
      </div>
    </div>
  );
}
