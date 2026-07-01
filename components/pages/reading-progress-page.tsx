import { Flame } from "lucide-react";

import { PagesOverTimeChart } from "@/components/charts/pages-over-time-chart";
import { ReadingPaceTrendsChart } from "@/components/charts/reading-pace-trends-chart";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";
import { formatMinutes, formatPace, percent } from "@/lib/utils";

const GENRE_META: Record<string, { color: string; chipBg: string; emoji: string }> = {
  Romance: { color: "#ff5d92", chipBg: "#ffe0ec", emoji: "💗" },
  Thriller: { color: "#5b6ee1", chipBg: "#e2e6ff", emoji: "🔪" },
  Fantasy: { color: "#9457c4", chipBg: "#efe1fb", emoji: "🐉" },
  "Self-help": { color: "#ff4d4d", chipBg: "#ffe0e0", emoji: "🌱" },
  Productivity: { color: "#e0761f", chipBg: "#fbe8cf", emoji: "⚡" },
  Literary: { color: "#2e9e6b", chipBg: "#d6f5e3", emoji: "🪶" },
  Philosophy: { color: "#b8742e", chipBg: "#f6e6cf", emoji: "🦉" },
  "Science Fiction": { color: "#3a6db5", chipBg: "#dbe7ff", emoji: "🚀" },
};
const GENRE_FALLBACK = { color: "#2d5da1", chipBg: "#dbe7ff", emoji: "📖" };
const genreMeta = (g: string) => GENRE_META[g] ?? GENRE_FALLBACK;

const BOOK_TONES = ["#ffe0ec", "#dbe7ff", "#d6f5e3", "#efe1fb", "#fff9c4"];
const MILESTONE_TONES = ["#ffe0ec", "#fff9c4", "#d6f5e3", "#dbe7ff", "#efe1fb"];

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
      <Surface className="p-5 md:p-6" decoration="washi">
        <SectionHeading
          eyebrow="Pages"
          title="Reading progress"
          description="Your reading distance history, pace, and progress archive."
          emoji="📖"
          tone="yellow"
        />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total pages read"
            value={snapshot.user.totalPages.toLocaleString()}
            detail="Lifetime distance"
            emoji="📖"
            tone="yellow"
            tack="#2d5da1"
            rotate={-2}
          />
          <StatCard
            label="Average pace"
            value={formatPace(snapshot.user.averagePace)}
            detail="Time per page"
            emoji="🐢"
            tone="blue"
            tack="#ff4d4d"
            rotate={1.5}
          />
          <StatCard
            label="Total sessions"
            value={snapshot.user.totalSessions.toString()}
            detail="Reading workouts logged"
            emoji="⏱️"
            tone="pink"
            tack="#ff4d4d"
            rotate={-1}
          />
          <StatCard
            label="Total reading time"
            value={formatMinutes(snapshot.user.totalMinutes)}
            detail="Focused time"
            emoji="⏰"
            tone="mint"
            tack="#2d5da1"
            rotate={2}
          />
        </div>
      </Surface>

      <div className="grid gap-5 xl:grid-cols-2">
        <Surface className="p-4 md:p-5" decoration="none">
          <SectionHeading
            eyebrow="Pages over time"
            title="Reading distance history"
            description="Pages logged across recent sessions."
            emoji="📈"
            tone="purple"
          />
          <div className="mt-4">
            <PagesOverTimeChart data={pagesOverTime} />
          </div>
        </Surface>

        <Surface className="p-4 md:p-5" decoration="none">
          <SectionHeading
            eyebrow="Pace trend"
            title="Pace changes over sessions"
            description="See how your time per page shifts over time."
            emoji="🐢"
            tone="blue"
          />
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
          emoji="📚"
          tone="pink"
        />
        <div className="mt-5 space-y-3">
          {bookAnalytics.map((book, i) => (
            <div
              key={book.id}
              className="wobbly-card grid gap-4 border-[2.5px] border-[var(--border)] bg-white p-4 hard-shadow-soft md:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,0.5fr))] md:items-center"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full border-[2.5px] border-[var(--border)] text-[18px]"
                  style={{ background: BOOK_TONES[i % BOOK_TONES.length], boxShadow: "2px 2px 0 rgba(45,45,45,0.18)" }}
                >
                  📕
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold leading-tight text-[var(--foreground)]">{book.title}</p>
                  <p className="mt-1 text-sm font-bold text-[var(--muted)]">{book.author}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Pages read</p>
                <p className="mt-1 font-display text-base font-bold text-[var(--foreground)]">{book.pagesRead}</p>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Progress</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2.5 w-16 track">
                    <div className="track-fill" style={{ width: `${book.progress}%`, background: "#ff4d4d" }} />
                  </div>
                  <p className="font-display text-base font-bold text-[var(--foreground)]">{book.progress}%</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Avg pace</p>
                <p className="mt-1 font-display text-base font-bold text-[var(--secondary-accent)]">
                  {formatPace(book.averagePace)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Sessions</p>
                <p className="mt-1 font-display text-base font-bold text-[var(--foreground)]">{book.sessionCount}</p>
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
            emoji="🧭"
            tone="mint"
          />
          <div className="mt-5 space-y-3">
            {genreBreakdown.map((genre) => {
              const meta = genreMeta(genre.genre);
              return (
                <div
                  key={genre.genre}
                  className="wobbly-md grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-[2.5px] border-[var(--border)] bg-white px-4 py-3 hard-shadow-soft"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-full border-2 border-[var(--border)] text-[15px]"
                      style={{ background: meta.chipBg, boxShadow: "1.5px 1.5px 0 rgba(45,45,45,0.18)" }}
                    >
                      {meta.emoji}
                    </span>
                    <p className="truncate font-display text-base font-bold text-[var(--foreground)]">{genre.genre}</p>
                  </div>
                  <p className="whitespace-nowrap text-[13px] font-bold text-[var(--muted)]">{genre.totalPages} pages</p>
                  <p className="whitespace-nowrap font-display text-base font-bold" style={{ color: meta.color }}>
                    {formatPace(genre.averagePace)}
                  </p>
                </div>
              );
            })}
          </div>
        </Surface>

        <Surface className="p-5 md:p-6" decoration="none">
          <SectionHeading
            eyebrow="Session history"
            title="Recent sessions"
            description="Date, book, pages, time, and pace for every reading workout."
            emoji="🗓️"
            tone="blue"
          />
          <div className="mt-5 space-y-3">
            {snapshot.sessions.map((session) => (
              <div
                key={session.id}
                className="wobbly-card grid gap-3 border-[2.5px] border-[var(--border)] bg-white p-4 hard-shadow-soft md:grid-cols-[0.8fr_1.2fr_repeat(3,0.55fr)] md:items-center"
              >
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Date</p>
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                    {new Date(session.endedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Book</p>
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">{session.bookTitle}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Pages</p>
                  <p className="mt-1 font-display text-base font-bold text-[var(--foreground)]">{session.pagesRead}</p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Time</p>
                  <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                    {formatMinutes(session.durationMinutes)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">Pace</p>
                  <p className="mt-1 text-sm font-bold text-[var(--secondary-accent)]">
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
          emoji="🏅"
          tone="yellow"
        />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {milestones.map((milestone, i) => (
            <div
              key={milestone.id}
              className="wobbly-note border-[2.5px] border-[var(--border)] p-4"
              style={{
                background: MILESTONE_TONES[i % MILESTONE_TONES.length],
                boxShadow: "3px 3px 0 var(--border)",
                transform: `rotate(${i % 2 === 0 ? -0.8 : 0.8}deg)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-[var(--foreground)]">{milestone.title}</p>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#6b655c]">{milestone.description}</p>
                </div>
                <span
                  className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full border-[2.5px] border-[var(--border)] bg-white"
                  style={{ boxShadow: "2px 2px 0 rgba(45,45,45,0.18)" }}
                >
                  <Flame className="h-4 w-4 text-[var(--accent)]" strokeWidth={2.8} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
