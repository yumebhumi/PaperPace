import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="relative mx-auto w-full max-w-md rotate-[-1deg] border-[3px] border-[var(--border)] bg-white px-8 py-10 text-center hard-shadow-lg wobbly-card washi">
        <span
          className="absolute left-1/2 top-[-9px] h-4 w-4 -translate-x-1/2 rounded-full border-[2.5px] border-[var(--border)]"
          style={{ background: "var(--accent)", boxShadow: "1.5px 1.5px 0 var(--border)" }}
          aria-hidden
        />
        <span className="inline-block rotate-[-8deg] text-[52px]" aria-hidden>
          🔖
        </span>
        <p className="chip mt-3">Off the route</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[var(--foreground)]">
          Lost your bookmark?
        </h1>
        <p className="mt-3 text-[14px] font-bold leading-6 text-[var(--muted)]">
          This page must&apos;ve slipped out between the covers. The route you tried to follow
          doesn&apos;t exist in this build.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rough-ring wobbly-md inline-flex min-h-11 items-center justify-center gap-2 border-[3px] border-[var(--border)] bg-[var(--accent)] px-5 py-3 text-sm font-extrabold text-white transition-all duration-100 hard-shadow hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Back to the shelf 📚
          </Link>
          <Link
            href="/dashboard"
            className="rough-ring wobbly-md inline-flex min-h-11 items-center justify-center gap-2 border-[3px] border-[var(--border)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--foreground)] transition-all duration-100 hard-shadow hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Go to dashboard
          </Link>
        </div>
        <p className="mt-6 font-display text-[15px] text-[var(--faint)]">
          every page counts ✦ keep turning ✦
        </p>
      </section>
    </main>
  );
}
