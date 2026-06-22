export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-24">
      <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] px-10 py-12 text-center shadow-[var(--shadow)] backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
          Off the route
        </p>
        <h1 className="mt-4 text-4xl text-[var(--foreground)]">Page not found</h1>
        <p className="mt-3 max-w-md text-[var(--muted)]">
          The route you tried to follow does not exist in this build.
        </p>
      </div>
    </main>
  );
}
