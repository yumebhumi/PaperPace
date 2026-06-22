import { BookOpen, Flame, Gauge, Target, Timer } from "lucide-react";

import { GenrePaceChart } from "@/components/charts/genre-pace-chart";
import { ReadingPaceTrendsChart } from "@/components/charts/reading-pace-trends-chart";
import { WeeklyPagesChart } from "@/components/charts/weekly-pages-chart";
import { BookRoute } from "@/components/ui/book-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { SessionTimer } from "@/components/ui/session-timer";
import { StatCard } from "@/components/ui/stat-card";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";
import { formatMinutes, formatPace, percent } from "@/lib/utils";

export function DashboardPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  const progress = percent(snapshot.currentBook.currentPage, snapshot.currentBook.pageCount);
  const routeStops = snapshot.currentBook.routeStops;
  const totalStops = routeStops.length;
  const currentStopIndex = Math.min(
    totalStops - 1,
    Math.floor((snapshot.currentBook.currentPage / snapshot.currentBook.pageCount) * totalStops),
  );
  const currentChapter = routeStops[currentStopIndex] ?? routeStops[routeStops.length - 1];
  const nextMilestone =
    routeStops[Math.min(currentStopIndex + 1, routeStops.length - 1)] ?? currentChapter;
  const pagesRemaining = Math.max(snapshot.currentBook.pageCount - snapshot.currentBook.currentPage, 0);
  const yearlyBooksGoal = 24;
  const yearlyPagesGoal = 5000;
  const completedBooks = snapshot.user.booksFinished;
  const completedPages = snapshot.user.totalPages;
  const booksGoalProgress = percent(completedBooks, yearlyBooksGoal);
  const pagesGoalProgress = percent(completedPages, yearlyPagesGoal);
  const now = new Date();
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  const daysRemaining = Math.max(
    0,
    Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const paceTrendData = [...snapshot.sessions]
    .sort((left, right) => new Date(left.endedAt).getTime() - new Date(right.endedAt).getTime())
    .slice(-6)
    .map((session) => ({
      session: new Date(session.endedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      pace: Math.round(session.paceSecondsPerPage),
    }));

  return (
    <div className="space-y-6">
      <Surface className="overflow-hidden px-5 py-6 md:px-6 md:py-7 hard-shadow" decoration="none">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.85fr)]">
          <div>
            <SectionHeading
              eyebrow="Today"
              title={`Welcome back, ${snapshot.user.displayName}.`}
              description="Start a session or continue your current book."
            />
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                label="Current streak"
                value={`${snapshot.user.currentStreak} days`}
                detail={`Best: ${snapshot.user.bestStreak} days`}
                icon={Flame}
              />
              <StatCard
                label="Pages trained"
                value={snapshot.user.totalPages.toString()}
                detail={`${snapshot.user.totalSessions} sessions logged`}
                icon={BookOpen}
              />
              <StatCard
                label="Reading time"
                value={formatMinutes(snapshot.user.totalMinutes)}
                detail="Total reading time"
                icon={Timer}
              />
              <StatCard
                label="Average pace"
                value={formatPace(snapshot.user.averagePace)}
                detail="Time per page"
                icon={Gauge}
              />
            </div>
          </div>

          <div className="h-fit w-full max-w-none self-start wobbly-card border-[3px] border-[var(--border)] bg-[color:color-mix(in_srgb,var(--secondary-accent)_84%,white)] p-4 text-white hard-shadow xl:max-w-[360px]">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">Current route</p>
            <h3 className="mt-2.5 text-xl md:text-2xl">{snapshot.currentBook.title}</h3>
            <p className="mt-1 text-sm text-white/80">{snapshot.currentBook.author}</p>
            <p className="mt-3 text-sm leading-6 text-white/88">
              {snapshot.currentBook.currentPage} of {snapshot.currentBook.pageCount} pages complete
            </p>
            <div className="wobbly-md mt-4 border-2 border-[rgba(45,45,45,0.72)] bg-[rgba(255,255,255,0.14)] p-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-3 rounded-full border-[2px] border-dashed border-white/60 bg-[rgba(255,255,255,0.15)]">
                <div
                  className="h-3 rounded-full bg-[var(--surface-postit)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Surface>

      <SessionTimer bookId={snapshot.currentBook.id} initialPage={snapshot.currentBook.currentPage} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface className="p-5 md:p-6 hard-shadow" decoration="none">
          <SectionHeading
            eyebrow="Progress map"
            title="Continue reading"
            description="View progress and next stop."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="wobbly-md border-2 border-[var(--border)] bg-[var(--surface-muted)] p-3.5 hard-shadow-soft">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Current chapter
              </p>
              <p className="mt-2 text-lg text-[var(--foreground)]">{currentChapter}</p>
            </div>
            <div className="wobbly-md border-2 border-[var(--border)] bg-white p-3.5 hard-shadow-soft">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Next stop
              </p>
              <p className="mt-2 text-lg text-[var(--foreground)]">{nextMilestone}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span className="wobbly-md border-2 border-dashed border-[var(--border)] bg-white px-3 py-1.5">
              {pagesRemaining} pages left
            </span>
            <span className="wobbly-md border-2 border-dashed border-[var(--border)] bg-white px-3 py-1.5">
              {progress}% complete
            </span>
          </div>
          <div className="mt-6">
            <BookRoute
              currentPage={snapshot.currentBook.currentPage}
              pageCount={snapshot.currentBook.pageCount}
              stops={snapshot.currentBook.routeStops}
            />
          </div>
        </Surface>

        <Surface className="p-5 md:p-6 hard-shadow" tone="postit" decoration="none">
          <SectionHeading
            eyebrow="Reading goals"
            title="Yearly goals"
            description="Track books and pages."
          />
          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Days remaining this year
              </p>
              <p className="mt-2 text-3xl text-[var(--foreground)]">{daysRemaining}</p>
            </div>
            <div className="ink-icon p-3 text-[var(--foreground)]">
              <Target className="h-5 w-5" strokeWidth={2.7} />
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="wobbly-card border-2 border-[var(--border)] bg-white/65 p-4 hard-shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Yearly books goal
                  </p>
                  <p className="mt-2 text-2xl text-[var(--foreground)]">
                    {completedBooks} / {yearlyBooksGoal} books
                  </p>
                </div>
                <p className="text-sm text-[var(--muted)]">{booksGoalProgress}%</p>
              </div>
              <div className="mt-3 h-3 rounded-full border-[2px] border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.42)]">
                <div
                  className="h-3 rounded-full bg-[var(--accent)]"
                  style={{ width: `${booksGoalProgress}%` }}
                />
              </div>
            </div>

            <div className="wobbly-card border-2 border-[var(--border)] bg-white/65 p-4 hard-shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    Yearly pages goal
                  </p>
                  <p className="mt-2 text-2xl text-[var(--foreground)]">
                    {completedPages} / {yearlyPagesGoal} pages
                  </p>
                </div>
                <p className="text-sm text-[var(--muted)]">{pagesGoalProgress}%</p>
              </div>
              <div className="mt-3 h-3 rounded-full border-[2px] border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.42)]">
                <div
                  className="h-3 rounded-full bg-[var(--secondary-accent)]"
                  style={{ width: `${pagesGoalProgress}%` }}
                />
              </div>
            </div>
          </div>
        </Surface>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Surface
          className="border-[rgba(45,45,45,0.72)] p-4 md:p-5 [box-shadow:2px_2px_0px_0px_rgba(45,45,45,0.22)]"
          decoration="none"
        >
          <div>
            <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
              Weekly pages
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--foreground)] md:text-[1.7rem]">
              Pages this week
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">Weekly reading volume.</p>
          </div>
          <div className="mt-4">
            <WeeklyPagesChart data={snapshot.weeklyPages} />
          </div>
        </Surface>

        <Surface
          className="border-[rgba(45,45,45,0.72)] p-4 md:p-5 [box-shadow:2px_2px_0px_0px_rgba(45,45,45,0.22)]"
          decoration="none"
        >
          <div>
            <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
              Pace trends
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--foreground)] md:text-[1.7rem]">
              Reading pace
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">Recent pace trends.</p>
          </div>
          <div className="mt-4">
            <ReadingPaceTrendsChart data={paceTrendData} />
          </div>
        </Surface>

        <Surface
          className="border-[rgba(45,45,45,0.72)] p-4 md:p-5 [box-shadow:2px_2px_0px_0px_rgba(45,45,45,0.22)]"
          decoration="none"
        >
          <div>
            <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] hard-shadow-soft wobbly-md">
              Genre pace
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-[var(--foreground)] md:text-[1.7rem]">
              Pace by genre
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[var(--muted)]">
              See where you naturally move faster.
            </p>
          </div>
          <div className="mt-4">
            <GenrePaceChart data={snapshot.genrePace} />
          </div>
        </Surface>
      </div>
    </div>
  );
}
