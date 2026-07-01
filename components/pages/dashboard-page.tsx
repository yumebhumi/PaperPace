import Link from "next/link";
import { Plus } from "lucide-react";

import { GenrePaceCard } from "@/components/dashboard/genre-pace-card";
import { RouteMap } from "@/components/dashboard/route-map";
import { StreakGrid } from "@/components/dashboard/streak-grid";
import { WeeklyBars } from "@/components/dashboard/weekly-bars";
import { BookCover, type CoverColor } from "@/components/ui/book-cover";
import { SessionTimer } from "@/components/ui/session-timer";
import { StatCard } from "@/components/ui/stat-card";
import type { ReaderSnapshot } from "@/lib/types";
import { formatMinutes, getInitials, percent } from "@/lib/utils";

const YEARLY_BOOKS_GOAL = 24;
const YEARLY_PAGES_GOAL = 5000;

const shelfCovers: CoverColor[] = ["blue", "orange", "purple", "pink", "mint", "yellow"];
const shelfTags: Record<string, { label: string; bg: string; fg: string }> = {
  CURRENTLY_READING: { label: "reading", bg: "#ff4d4d", fg: "#fff" },
  WANT_TO_READ: { label: "to read", bg: "#fff9c4", fg: "#2d2d2d" },
  FINISHED: { label: "finished", bg: "#d6f5e3", fg: "#2d2d2d" },
};

function paceClock(secondsPerPage: number) {
  const m = Math.floor(secondsPerPage / 60);
  const s = Math.round(secondsPerPage % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DashboardPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  const { user, currentBook } = snapshot;
  const progress = percent(currentBook.currentPage, currentBook.pageCount);
  const pagesRemaining = Math.max(currentBook.pageCount - currentBook.currentPage, 0);

  const booksGoalProgress = percent(user.booksFinished, YEARLY_BOOKS_GOAL);
  const pagesGoalProgress = percent(user.totalPages, YEARLY_PAGES_GOAL);
  const now = new Date();
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(now.getFullYear(), 11, 31).getTime() - now.getTime()) / 86_400_000),
  );

  const quote = snapshot.quotes[snapshot.quotes.length - 1] ?? snapshot.quotes[0];
  const quoteBook = quote ? snapshot.books.find((b) => b.id === quote.bookId) : undefined;

  return (
    <div className="space-y-5">
      {/* ===== greeting ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="chip">Today</span>
          <h1 className="mt-2 font-display text-[28px] font-bold leading-[1.1] md:text-[32px]">
            Hi {user.displayName}!{" "}
            <span className="inline-block rotate-[8deg]">📖</span>
          </h1>
          <p className="mt-1 text-[13px] font-bold text-[var(--muted)]">
            {user.currentStreak}-day streak going — start a session or keep turning pages.
          </p>
        </div>
        <Link
          href="/books/new"
          className="inline-flex items-center gap-2 border-[3px] border-[var(--border)] bg-[var(--accent)] px-4 py-2.5 text-[14px] font-extrabold text-white wobbly-md hard-shadow transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d]"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Add book
        </Link>
      </div>

      {/* ===== hero: currently reading ===== */}
      <section className="relative overflow-hidden border-[3px] border-[var(--border)] bg-white px-6 py-6 hard-shadow-lg wobbly-card washi">
        <div className="grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
          <div className="mx-auto md:mx-0">
            <BookCover
              title={currentBook.title}
              author={currentBook.author}
              initials={getInitials(currentBook.title)}
              color="blue"
              bookmark
              float
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center">
            <span
              className="self-start whitespace-nowrap rounded-full border-2 border-dashed border-[var(--border)] px-3 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em]"
              style={{ background: "#fff9c4" }}
            >
              Currently reading
            </span>
            <div className="mt-3 font-display text-[30px] font-bold leading-[1.05]">
              {currentBook.title}
            </div>
            <div className="mt-0.5 text-[15px] font-bold text-[var(--muted)]">
              by {currentBook.author}
              {currentBook.genres[0] ? ` · ${currentBook.genres[0]}` : ""}
            </div>

            <div
              className="mt-4 border-[2.5px] border-[var(--border)] px-4 py-3.5 wobbly-md"
              style={{ background: "#fffdf2", boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="font-display text-[34px] font-bold leading-none">
                    {currentBook.currentPage}
                    <span className="text-[18px] text-[var(--muted)]"> / {currentBook.pageCount} pages</span>
                  </div>
                  <div className="mt-1 text-[13px] font-bold text-[var(--muted)]">
                    {pagesRemaining} pages to the finish line ✨
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display text-[30px] font-bold leading-none text-[var(--accent)]">
                    {progress}%
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--muted)]">
                    done
                  </div>
                </div>
              </div>
              <div className="relative mt-3 h-4 track">
                <div className="track-fill stripe-red" style={{ width: `${progress}%` }} />
                <span
                  className="absolute top-[-3px] text-[20px]"
                  style={{ left: `calc(${progress}% - 11px)` }}
                >
                  🔖
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== stat sticky notes ===== */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          emoji="🔥"
          value={`${user.currentStreak} days`}
          label="Streak"
          detail={`Best: ${user.bestStreak} days`}
          tone="pink"
          tack="#ff4d4d"
          rotate={-2}
        />
        <StatCard
          emoji="📖"
          value={user.totalPages.toString()}
          label="Pages read"
          detail={`${user.totalSessions} sessions`}
          tone="yellow"
          tack="#2d5da1"
          rotate={1.5}
        />
        <StatCard
          emoji="⏰"
          value={formatMinutes(user.totalMinutes)}
          label="Read time"
          detail="all-time"
          tone="mint"
          tack="#ff4d4d"
          rotate={-1}
        />
        <StatCard
          emoji="🐢"
          value={paceClock(user.averagePace)}
          label="Avg pace"
          detail="per page"
          tone="blue"
          tack="#2d5da1"
          rotate={2}
        />
      </div>

      {/* ===== session timer ===== */}
      <SessionTimer bookId={currentBook.id} initialPage={currentBook.currentPage} />

      {/* ===== genre pace ===== */}
      <GenrePaceCard data={snapshot.genrePace} />

      {/* ===== reading streak ===== */}
      <StreakGrid
        currentStreak={user.currentStreak}
        bestStreak={user.bestStreak}
        totalPages={user.totalPages}
      />

      {/* ===== route map + goals ===== */}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <RouteMap
          stops={currentBook.routeStops}
          currentPage={currentBook.currentPage}
          pageCount={currentBook.pageCount}
        />
        <section
          className="relative rotate-[0.6deg] border-[3px] border-[var(--border)] px-6 py-5 wobbly-note washi-mint washi"
          style={{ background: "#fff9c4", boxShadow: "4px 4px 0 var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[22px]">🎯</span>
            <div className="font-display text-[24px] font-bold">{now.getFullYear()} goals</div>
          </div>
          <div className="mt-1 text-[13px] font-bold text-[#6b655c]">
            {daysRemaining} days left this year — pace yourself 🌿
          </div>
          <GoalBar
            label="Books 📚"
            value={`${user.booksFinished} / ${YEARLY_BOOKS_GOAL}`}
            pct={booksGoalProgress}
            color="#ff4d4d"
          />
          <GoalBar
            label="Pages 📄"
            value={`${user.totalPages} / ${YEARLY_PAGES_GOAL}`}
            pct={pagesGoalProgress}
            color="#2d5da1"
          />
        </section>
      </div>

      {/* ===== weekly chart + stickers ===== */}
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <WeeklyBars data={snapshot.weeklyPages} />
        <section
          className="relative border-[3px] border-[var(--border)] px-6 py-5 wobbly-note"
          style={{ background: "#ffe9f1", boxShadow: "3px 3px 0 var(--border)" }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[22px]">🏅</span>
            <div className="font-display text-[24px] font-bold">Sticker collection</div>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            {snapshot.achievements.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 border-[2.5px] border-[var(--border)] rounded-2xl px-3 py-2.5"
                style={{
                  background: a.unlocked ? "#fff" : "#f3ece2",
                  opacity: a.unlocked ? 1 : 0.6,
                  boxShadow: "2px 2px 0 rgba(45,45,45,0.16)",
                }}
              >
                <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full border-[2.5px] border-[var(--border)] bg-white text-[20px]">
                  {a.unlocked ? achievementEmoji(a.key) : "🔒"}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-[17px] font-bold leading-none">{a.name}</div>
                  <div className="text-[12px] font-bold text-[#6b655c]">
                    {a.unlocked ? a.description : `${a.description} — locked`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ===== quote + shelf ===== */}
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        {quote ? (
          <section
            className="relative -rotate-[1.2deg] border-[3px] border-[var(--border)] px-6 py-6 wobbly-note"
            style={{ background: "#d9f2ff", boxShadow: "4px 4px 0 var(--border)" }}
          >
            <span
              className="absolute right-[26px] top-[-10px] h-[18px] w-[18px] rounded-full border-[2.5px] border-[var(--border)]"
              style={{ background: "#ff4d4d", boxShadow: "1.5px 1.5px 0 var(--border)" }}
            />
            <div className="font-display text-[48px] leading-[0.6] text-[var(--secondary-accent)]">“</div>
            <div className="mt-1.5 font-display text-[21px] font-bold leading-[1.3]">
              {quote.quoteText}
            </div>
            <div className="mt-3.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--secondary-accent-soft)]">
              — {quoteBook?.title ?? "PaperPace"}
              {quote.pageNumber ? ` · pg. ${quote.pageNumber}` : ""}
            </div>
          </section>
        ) : null}
        <section className="relative border-[3px] border-[var(--border)] bg-white px-6 py-5 hard-shadow wobbly-card">
          <div className="flex items-center gap-2.5">
            <span className="text-[22px]">📚</span>
            <div className="font-display text-[24px] font-bold">My little shelf</div>
          </div>
          <div className="mt-5 flex items-end justify-around gap-3">
            {snapshot.books.slice(0, 3).map((book, i) => {
              const tag = shelfTags[book.status] ?? shelfTags.WANT_TO_READ;
              return (
                <div key={book.id} className="flex flex-col items-center gap-2.5">
                  <BookCover
                    title={book.title}
                    color={shelfCovers[i % shelfCovers.length]}
                    width={82}
                    rotate={i % 2 === 0 ? -4 : 3}
                  />
                  <span
                    className="rounded-full border-2 border-[var(--border)] px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em]"
                    style={{ background: tag.bg, color: tag.fg }}
                  >
                    {tag.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="pt-2 text-center font-display text-[18px] text-[var(--faint)]">
        every page counts ✦ keep turning ✦
      </div>
    </div>
  );
}

function GoalBar({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div
      className="mt-3 border-[2.5px] border-[var(--border)] rounded-[18px] px-4 py-3"
      style={{ background: "#fffef7" }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-extrabold">{label}</div>
        <div className="font-display text-[18px] font-bold">{value}</div>
      </div>
      <div className="mt-2 h-3.5 track">
        <div className="track-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function achievementEmoji(key: string) {
  if (key.includes("streak")) return "🔥";
  if (key.includes("first")) return "🥾";
  if (key.includes("pages")) return "📖";
  if (key.includes("book")) return "📚";
  return "⭐";
}
