import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ReadingPaceTrendsChart } from "@/components/charts/reading-pace-trends-chart";
import { BookCover, type CoverColor } from "@/components/ui/book-cover";
import { BookRoute } from "@/components/ui/book-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { getAppSnapshot } from "@/lib/data";
import { formatMinutes, formatPace, getInitials, percent } from "@/lib/utils";

const statusTags: Record<string, { label: string; bg: string; fg: string }> = {
  CURRENTLY_READING: { label: "reading now", bg: "#ff4d4d", fg: "#fff" },
  WANT_TO_READ: { label: "to read", bg: "#fff9c4", fg: "#2d2d2d" },
  FINISHED: { label: "finished", bg: "#d6f5e3", fg: "#2d2d2d" },
};

const statusCovers: Record<string, CoverColor> = {
  CURRENTLY_READING: "blue",
  WANT_TO_READ: "orange",
  FINISHED: "mint",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snapshot = await getAppSnapshot();
  const book = snapshot.books.find((entry) => entry.id === id);

  if (!book) {
    notFound();
  }

  const bookSessions = snapshot.sessions
    .filter((session) => session.bookId === book.id)
    .sort((left, right) => new Date(right.endedAt).getTime() - new Date(left.endedAt).getTime());

  const paceTrendData = [...bookSessions]
    .reverse()
    .slice(-6)
    .map((session) => ({
      session: new Date(session.endedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      pace: Math.round(session.paceSecondsPerPage),
    }));

  const pagesLeft = Math.max(book.pageCount - book.currentPage, 0);
  const progress = percent(book.currentPage, book.pageCount);
  const averageBookPace =
    bookSessions.length > 0
      ? Math.round(
          bookSessions.reduce((sum, session) => sum + session.paceSecondsPerPage, 0) /
            bookSessions.length,
        )
      : snapshot.user.averagePace;

  const tag = statusTags[book.status] ?? statusTags.WANT_TO_READ;
  const coverColor = statusCovers[book.status] ?? "blue";

  return (
    <div className="space-y-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 border-[3px] border-[var(--border)] bg-white px-4 py-2 text-[13px] font-extrabold text-[var(--foreground)] hard-shadow-soft wobbly-md transition-all duration-100 hover:-translate-y-[1px]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.7} />
        Back to library
      </Link>

      {/* ===== hero ===== */}
      <section className="relative overflow-hidden border-[3px] border-[var(--border)] bg-white px-6 py-6 hard-shadow-lg wobbly-card washi">
        <div className="grid items-start gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
          <div className="mx-auto md:mx-0">
            <BookCover
              title={book.title}
              author={book.author}
              initials={getInitials(book.title)}
              color={coverColor}
              bookmark
              float
            />
          </div>
          <div className="min-w-0">
            <span
              className="inline-block whitespace-nowrap rounded-full border-2 border-[var(--border)] px-3 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em]"
              style={{ background: tag.bg, color: tag.fg }}
            >
              {tag.label}
            </span>
            <SectionHeading eyebrow="Book detail" emoji="📖" title={book.title} description={`by ${book.author}${book.genres[0] ? ` · ${book.genres[0]}` : ""}`} />

            <div className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
              <StatCard emoji="🐢" value={formatPace(averageBookPace).split(" / ")[0]} label="Avg pace" detail="per page" tone="blue" tack="#2d5da1" rotate={-2} />
              <StatCard emoji="📄" value={`${pagesLeft}`} label="Pages left" detail="to finish" tone="yellow" tack="#ff4d4d" rotate={1.5} />
              <StatCard emoji="⏱️" value={`${bookSessions.length}`} label="Sessions" detail="logged" tone="mint" tack="#2e9e6b" rotate={-1} />
              <StatCard emoji="✨" value={`${progress}%`} label="Progress" detail="of the route" tone="pink" tack="#ff5d92" rotate={2} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== progress route ===== */}
      <section
        className="relative border-[3px] border-[var(--border)] px-6 py-5 wobbly-card"
        style={{ background: "#d9f2ff", boxShadow: "4px 4px 0 var(--border)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[22px]">🗺️</span>
            <div className="font-display text-[22px] font-bold">Progress route</div>
          </div>
          <div className="text-[13px] font-bold text-[#3a5468]">
            {book.currentPage} of {book.pageCount} pages · {pagesLeft} left ✨
          </div>
        </div>
        <div className="mt-4">
          <BookRoute currentPage={book.currentPage} pageCount={book.pageCount} stops={book.routeStops} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        {/* ===== pace chart ===== */}
        <section className="relative border-[3px] border-[var(--border)] bg-white px-6 py-6 hard-shadow wobbly-card">
          <SectionHeading eyebrow="Pace progression" emoji="📈" tone="mint" title="Reading pace for this book" description="Track how your time per page shifts across sessions." />
          <div className="mt-5">
            <ReadingPaceTrendsChart data={paceTrendData} />
          </div>
        </section>

        {/* ===== session history ===== */}
        <section className="relative border-[3px] border-[var(--border)] bg-white px-6 py-6 hard-shadow wobbly-card">
          <SectionHeading eyebrow="Session history" emoji="🕰️" tone="pink" title="Recent sessions" description="Every page, minute, and mood from your reading workouts." />
          <div className="mt-5 space-y-3">
            {bookSessions.length > 0 ? (
              bookSessions.slice(0, 6).map((session, i) => (
                <div
                  key={session.id}
                  className="relative border-[2.5px] border-[var(--border)] px-4 py-3.5 wobbly-note"
                  style={{
                    background: i % 2 === 0 ? "#fffdf2" : "#ffe9f1",
                    boxShadow: "2px 2px 0 rgba(45,45,45,0.16)",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-[16px] font-bold leading-none">
                      {new Date(session.endedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {session.mood ? (
                        <span
                          className="rounded-full border-2 border-[var(--border)] px-2.5 py-0.5 text-[11px] font-extrabold"
                          style={{ background: "#efe1fb", boxShadow: "1.5px 1.5px 0 rgba(45,45,45,0.16)" }}
                        >
                          {session.mood}
                        </span>
                      ) : null}
                      <span
                        className="rounded-full border-2 border-[var(--border)] px-2.5 py-0.5 text-[11px] font-extrabold"
                        style={{ background: "#dbe7ff", boxShadow: "1.5px 1.5px 0 rgba(45,45,45,0.16)" }}
                      >
                        {formatPace(session.paceSecondsPerPage)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Pages
                      </p>
                      <p className="mt-0.5 font-display text-[18px] font-bold">{session.pagesRead}</p>
                    </div>
                    <div>
                      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Time
                      </p>
                      <p className="mt-0.5 font-display text-[18px] font-bold">
                        {formatMinutes(session.durationMinutes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Route
                      </p>
                      <p className="mt-0.5 font-display text-[18px] font-bold">
                        {session.pagesRead > 0 ? `${session.pagesRead} pages` : "Logged"}
                      </p>
                    </div>
                  </div>
                  {session.notes ? (
                    <p className="mt-3 text-[13px] font-bold leading-6 text-[var(--muted)]">{session.notes}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div
                className="border-[2.5px] border-dashed border-[rgba(45,45,45,0.32)] px-5 py-8 text-center text-[13px] font-bold leading-6 text-[var(--muted)] wobbly-card"
                style={{ background: "rgba(255,249,196,0.3)" }}
              >
                <div className="mb-2 text-[28px]">📖</div>
                Start a reading session for this book to see pace progression and recent history here.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
