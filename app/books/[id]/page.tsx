import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Gauge } from "lucide-react";

import { ReadingPaceTrendsChart } from "@/components/charts/reading-pace-trends-chart";
import { BookRoute } from "@/components/ui/book-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getAppSnapshot } from "@/lib/data";
import { formatMinutes, formatPace, percent } from "@/lib/utils";

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

  return (
    <div className="space-y-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 border-2 border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] hard-shadow-soft wobbly-md"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
        Back to library
      </Link>

      <Surface className="p-5 md:p-6" decoration="none">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              eyebrow="Book detail"
              title={book.title}
              description={`${book.author} • ${book.status.replaceAll("_", " ").toLowerCase()}`}
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Average pace
                </p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{formatPace(averageBookPace)}</p>
              </div>
              <div className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Pages left
                </p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{pagesLeft}</p>
              </div>
              <div className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Sessions logged
                </p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{bookSessions.length}</p>
              </div>
              <div className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Progress
                </p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{progress}%</p>
              </div>
            </div>
          </div>

          <div className="wobbly-card border-[3px] border-[var(--border)] bg-[color:color-mix(in_srgb,var(--secondary-accent)_84%,white)] p-4 text-white hard-shadow">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Progress route</p>
            <p className="mt-2 text-xl">{book.currentPage} of {book.pageCount} pages</p>
            <p className="mt-1 text-sm text-white/82">{pagesLeft} pages left in this route</p>
            <div className="mt-4">
              <BookRoute
                currentPage={book.currentPage}
                pageCount={book.pageCount}
                stops={book.routeStops}
              />
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="p-5 md:p-6" decoration="none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
                Pace progression
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--foreground)]">
                Reading pace for this book
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Track how your time per page shifts across sessions.
              </p>
            </div>
            <span className="ink-icon p-3 text-[var(--foreground)]">
              <Gauge className="h-4 w-4" strokeWidth={2.6} />
            </span>
          </div>
          <div className="mt-5">
            <ReadingPaceTrendsChart data={paceTrendData} />
          </div>
        </Surface>

        <Surface className="p-5 md:p-6" decoration="none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
                Session history
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--foreground)]">
                Recent sessions
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Review pages, time, and pace for each reading workout.
              </p>
            </div>
            <span className="ink-icon p-3 text-[var(--foreground)]">
              <Clock3 className="h-4 w-4" strokeWidth={2.6} />
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {bookSessions.length > 0 ? (
              bookSessions.slice(0, 6).map((session) => (
                <div
                  key={session.id}
                  className="wobbly-md border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-[var(--foreground)]">
                      {new Date(session.endedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                      {session.mood ? (
                        <span className="wobbly-md border-2 border-dashed border-[var(--border)] px-2.5 py-1">
                          {session.mood}
                        </span>
                      ) : null}
                      <span className="wobbly-md border-2 border-dashed border-[var(--border)] px-2.5 py-1">
                        {formatPace(session.paceSecondsPerPage)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Pages
                      </p>
                      <p className="mt-1 text-lg text-[var(--foreground)]">{session.pagesRead}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Time
                      </p>
                      <p className="mt-1 text-lg text-[var(--foreground)]">
                        {formatMinutes(session.durationMinutes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                        Route
                      </p>
                      <p className="mt-1 text-lg text-[var(--foreground)]">
                        {session.pagesRead > 0 ? `${session.pagesRead} pages` : "Logged"}
                      </p>
                    </div>
                  </div>
                  {session.notes ? (
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{session.notes}</p>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="wobbly-md border-2 border-[var(--border)] bg-white p-5 text-sm leading-6 text-[var(--muted)] hard-shadow-soft">
                Start a reading session for this book to see pace progression and recent history here.
              </div>
            )}
          </div>
        </Surface>
      </div>
    </div>
  );
}
