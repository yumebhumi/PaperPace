import { BookOpen, Clock3, Flame, Gauge, Timer } from "lucide-react";

import { PagesOverTimeChart } from "@/components/charts/pages-over-time-chart";
import { ReadingPaceTrendsChart } from "@/components/charts/reading-pace-trends-chart";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";
import { formatMinutes, formatPace, percent } from "@/lib/utils";

function buildBookAnalytics(snapshot: ReaderSnapshot) {
  return snapshot.books.map((book) => {
    const sessions = snapshot.sessions.filter((session) => session.bookId === book.id);
    const pagesRead = sessions.reduce((sum, session) => sum + session.pagesRead, 0);
    const averagePace =
      sessions.length > 0
        ? Math.round(
            sessions.reduce((sum, session) => sum + session.paceSecondsPerPage, 0) / sessions.length,
          )
        : snapshot.user.averagePace;

    return {
      ...book,
      pagesRead,
      progress: percent(book.currentPage, book.pageCount),
      averagePace,
      sessionCount: sessions.length,
    };
  });
}

function buildGenreBreakdown(snapshot: ReaderSnapshot) {
  const genreTotals = new Map<string, { pages: number; durationSeconds: number }>();

  for (const session of snapshot.sessions) {
    const book = snapshot.books.find((entry) => entry.id === session.bookId);
    if (!book || book.genres.length === 0 || session.pagesRead <= 0) {
      continue;
    }

    const durationSeconds = Math.round(session.durationMinutes * 60);

    for (const genre of book.genres) {
      const current = genreTotals.get(genre) ?? { pages: 0, durationSeconds: 0 };
      current.pages += session.pagesRead;
      current.durationSeconds += durationSeconds;
      genreTotals.set(genre, current);
    }
  }

  return [...genreTotals.entries()]
    .map(([genre, totals]) => ({
      genre,
      totalPages: totals.pages,
      averagePace: totals.pages > 0 ? Math.round(totals.durationSeconds / totals.pages) : 0,
    }))
    .sort((left, right) => right.totalPages - left.totalPages);
}

function buildPagesOverTime(snapshot: ReaderSnapshot) {
  return [...snapshot.sessions]
    .sort((left, right) => new Date(left.endedAt).getTime() - new Date(right.endedAt).getTime())
    .map((session) => ({
      date: new Date(session.endedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      pages: session.pagesRead,
    }));
}

function buildPaceTrend(snapshot: ReaderSnapshot) {
  return [...snapshot.sessions]
    .sort((left, right) => new Date(left.endedAt).getTime() - new Date(right.endedAt).getTime())
    .map((session) => ({
      session: new Date(session.endedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      pace: Math.round(session.paceSecondsPerPage),
    }));
}

function buildMilestones(snapshot: ReaderSnapshot) {
  const unlocked = snapshot.achievements.filter((achievement) => achievement.unlocked);
  if (unlocked.length > 0) {
    return unlocked.map((achievement) => ({
      id: achievement.id,
      title: achievement.name,
      description: achievement.description,
    }));
  }

  return [
    {
      id: "pages-250",
      title: "250 pages trained",
      description: "Your reading distance is starting to compound.",
    },
  ];
}

export function ReadingProgressPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  const pagesOverTime = buildPagesOverTime(snapshot);
  const paceTrend = buildPaceTrend(snapshot);
  const bookAnalytics = buildBookAnalytics(snapshot);
  const genreBreakdown = buildGenreBreakdown(snapshot);
  const milestones = buildMilestones(snapshot);

  return (
    <div className="space-y-6">
      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Pages"
          title="Reading progress"
          description="Your reading distance history, pace, and progress archive."
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total pages read"
            value={snapshot.user.totalPages.toLocaleString()}
            detail="Lifetime distance"
            icon={BookOpen}
          />
          <StatCard
            label="Average pace"
            value={formatPace(snapshot.user.averagePace)}
            detail="Time per page"
            icon={Gauge}
          />
          <StatCard
            label="Total sessions"
            value={snapshot.user.totalSessions.toString()}
            detail="Reading workouts logged"
            icon={Timer}
          />
          <StatCard
            label="Total reading time"
            value={formatMinutes(snapshot.user.totalMinutes)}
            detail="Focused time"
            icon={Clock3}
          />
        </div>
      </Surface>

      <div className="grid gap-5 xl:grid-cols-2">
        <Surface
          className="border-[rgba(45,45,45,0.72)] p-4 md:p-5 [box-shadow:2px_2px_0px_0px_rgba(45,45,45,0.22)]"
          decoration="none"
        >
          <div>
            <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
              Pages over time
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--foreground)] md:text-[1.7rem]">
              Reading distance history
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
              Pages logged across recent sessions.
            </p>
          </div>
          <div className="mt-4">
            <PagesOverTimeChart data={pagesOverTime} />
          </div>
        </Surface>

        <Surface
          className="border-[rgba(45,45,45,0.72)] p-4 md:p-5 [box-shadow:2px_2px_0px_0px_rgba(45,45,45,0.22)]"
          decoration="none"
        >
          <div>
            <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
              Pace trend
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--foreground)] md:text-[1.7rem]">
              Pace changes over sessions
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
              See how your time per page shifts over time.
            </p>
          </div>
          <div className="mt-4">
            <ReadingPaceTrendsChart data={paceTrend} />
          </div>
        </Surface>
      </div>

      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Books"
          title="Book progress"
          description="Track pages, pace, and session count across every route."
        />
        <div className="mt-5 space-y-3">
          {bookAnalytics.map((book) => (
            <div
              key={book.id}
              className="wobbly-card grid gap-4 border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft md:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,0.5fr))] md:items-center"
            >
              <div>
                <p className="text-lg text-[var(--foreground)]">{book.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{book.author}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Pages read</p>
                <p className="mt-1 text-base text-[var(--foreground)]">{book.pagesRead}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Progress</p>
                <p className="mt-1 text-base text-[var(--foreground)]">{book.progress}%</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Avg pace</p>
                <p className="mt-1 text-base text-[var(--foreground)]">{formatPace(book.averagePace)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Sessions</p>
                <p className="mt-1 text-base text-[var(--foreground)]">{book.sessionCount}</p>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-5 md:p-6" decoration="none">
          <SectionHeading
            eyebrow="Genre breakdown"
            title="Pages and pace by genre"
            description="Only genres you have actually read."
          />
          <div className="mt-5 space-y-3">
            {genreBreakdown.map((genre) => (
              <div
                key={genre.genre}
                className="wobbly-md grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-2 border-[var(--border)] bg-white px-4 py-3 hard-shadow-soft"
              >
                <p className="text-sm text-[var(--foreground)]">{genre.genre}</p>
                <p className="text-sm text-[var(--muted)]">{genre.totalPages} pages</p>
                <p className="text-sm text-[var(--foreground)]">{formatPace(genre.averagePace)}</p>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-5 md:p-6" decoration="none">
          <SectionHeading
            eyebrow="Session history"
            title="Recent sessions"
            description="Date, book, pages, time, and pace for every reading workout."
          />
          <div className="mt-5 space-y-3">
            {snapshot.sessions.map((session) => (
              <div
                key={session.id}
                className="wobbly-card grid gap-3 border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft md:grid-cols-[0.8fr_1.2fr_repeat(3,0.55fr)] md:items-center"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Date</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {new Date(session.endedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Book</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{session.bookTitle}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Pages</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{session.pagesRead}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Time</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {formatMinutes(session.durationMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Pace</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">
                    {formatPace(session.paceSecondsPerPage)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-5 md:p-6" tone="muted" decoration="none">
        <SectionHeading
          eyebrow="Milestones"
          title="Reading milestones"
          description="Distance markers you have already hit."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="wobbly-card border-2 border-[var(--border)] bg-white/70 p-4 hard-shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg text-[var(--foreground)]">{milestone.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{milestone.description}</p>
                </div>
                <span className="ink-icon p-2.5">
                  <Flame className="h-4 w-4 text-[var(--foreground)]" strokeWidth={2.6} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
