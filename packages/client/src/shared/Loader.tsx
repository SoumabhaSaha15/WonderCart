export default function LoadingPage() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
      />
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-muted">
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="size-9 object-contain dark:invert"
          />
        </div>
        <p className="text-sm font-semibold uppercase tracking-widest">Wondercart</p>
        <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary motion-reduce:animate-none"
          />
          <span>Getting things ready...</span>
        </div>
      </div>
    </main>
  );
}
