import Link from "next/link";
import { Plus } from "lucide-react";

import { BookRoute } from "@/components/ui/book-route";
import { BookCover, type CoverColor } from "@/components/ui/book-cover";
import { StatCard } from "@/components/ui/stat-card";
import type { ReaderSnapshot } from "@/lib/types";
import { getInitials, percent } from "@/lib/utils";

const shelfCovers: CoverColor[] = ["blue", "orange", "purple", "pink", "mint", "yellow"];
const shelfTags: Record<string, { label: string; bg: string; fg: string }> = {
  CURRENTLY_READING: { label: "reading", bg: "#ff4d4d", fg: "#fff" },
  WANT_TO_READ: { label: "to read", bg: "#fff9c4", fg: "#2d2d2d" },
  FINISHED: { label: "finished", bg: "#d6f5e3", fg: "#2d2d2d" },
};

export function BooksPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  const yearlyGoal = 24;
  const completedBooks = snapshot.books.filter((book) => book.status === "FINISHED").length;
  const goalProgress = percent(completedBooks, yearlyGoal);
  const averageBookLength = Math.round(
    snapshot.books.reduce((sum, book) => sum + book.pageCount, 0) / snapshot.books.length,
  );
  const booksLeftToGoal = Math.max(yearlyGoal - completedBooks, 0);
  const pagesLeftToGoal = booksLeftToGoal * averageBookLength;

  return (
    <div className="space-y-6">
      {/* ===== header ===== */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="chip">Library</span>
          <h1 className="mt-2 font-display text-[28px] font-bold leading-[1.1] md:text-[32px]">
            Your reading shelf <span className="inline-block rotate-[8deg]">📚</span>
          </h1>
          <p className="mt-1 max-w-xl text-[13px] font-bold text-[var(--muted)]">
            Every current, queued, and finished book lives here — tap one to jump back into its route.
          </p>
        </div>
        <Link
          href="/books/new"
          className="inline-flex items-center gap-2 border-[3px] border-[var(--border)] bg-[var(--accent)] px-4 py-2.5 text-[14px] font-extrabold text-white wobbly-md hard-shadow transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d]"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Add book
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* ===== shelf list ===== */}
        <div className="space-y-4">
          {snapshot.books.map((book, i) => {
            const tag = shelfTags[book.status] ?? shelfTags.WANT_TO_READ;
            const progress = percent(book.currentPage, book.pageCount);
            return (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="relative flex flex-col gap-4 border-[3px] border-[var(--border)] bg-white p-4 hard-shadow wobbly-card transition-all duration-100 hover:-translate-y-[2px] hover:rotate-[-0.3deg] hover:[box-shadow:6px_6px_0px_0px_#2d2d2d] sm:flex-row sm:items-center md:p-5"
              >
                <div className="mx-auto shrink-0 sm:mx-0">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    initials={getInitials(book.title)}
                    color={shelfCovers[i % shelfCovers.length]}
                    width={96}
                    rotate={i % 2 === 0 ? -3 : 2}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full border-2 border-[var(--border)] px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.1em]"
                      style={{ background: tag.bg, color: tag.fg, boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
                    >
                      {tag.label}
                    </span>
                    {book.genres.slice(0, 2).map((genre) => (
                      <span key={genre} className="chip">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 font-display text-[22px] font-bold leading-[1.1]">{book.title}</div>
                  <div className="text-[13px] font-bold text-[var(--muted)]">by {book.author}</div>
                  <p className="mt-2 line-clamp-2 max-w-xl text-[13px] leading-6 text-[var(--muted)]">
                    {book.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[12px] font-extrabold text-[var(--muted)]">
                    <span>
                      {book.currentPage} / {book.pageCount} pages
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-1.5 h-3.5 track">
                    <div className="track-fill" style={{ width: `${progress}%`, background: "#2d5da1" }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ===== sidebar ===== */}
        <div className="space-y-5">
          <section className="relative rotate-[0.6deg] overflow-hidden border-[3px] border-[var(--border)] bg-white px-5 py-5 hard-shadow-lg wobbly-card washi">
            <span className="chip">Continue reading</span>
            <div className="mt-3 flex items-center gap-4">
              <BookCover
                title={snapshot.currentBook.title}
                color="blue"
                width={78}
                rotate={-3}
                bookmark
              />
              <div className="min-w-0">
                <div className="font-display text-[20px] font-bold leading-[1.1]">
                  {snapshot.currentBook.title}
                </div>
                <p className="mt-1.5 text-[12.5px] font-bold text-[var(--muted)]">
                  Pick up where you left off and keep your route moving ✨
                </p>
              </div>
            </div>
            <div className="mt-4">
              <BookRoute
                currentPage={snapshot.currentBook.currentPage}
                pageCount={snapshot.currentBook.pageCount}
                stops={snapshot.currentBook.routeStops}
              />
            </div>
          </section>

          <section
            className="relative -rotate-[0.5deg] border-[3px] border-[var(--border)] px-5 py-5 wobbly-note washi-mint washi"
            style={{ background: "#fff9c4", boxShadow: "4px 4px 0 var(--border)" }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[22px]">🎯</span>
              <div className="font-display text-[22px] font-bold">Reading goal</div>
            </div>
            <div className="mt-1 text-[13px] font-bold text-[#6b655c]">
              {completedBooks} of {yearlyGoal} books this year — {pagesLeftToGoal.toLocaleString()} pages to go.
            </div>
            <div
              className="mt-4 border-[2.5px] border-[var(--border)] rounded-[18px] px-4 py-3"
              style={{ background: "#fffef7" }}
            >
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-extrabold">Goal progress</div>
                <div className="font-display text-[18px] font-bold">{goalProgress}%</div>
              </div>
              <div className="mt-2 h-3.5 track">
                <div className="track-fill stripe-red" style={{ width: `${goalProgress}%` }} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard emoji="✅" value={`${completedBooks}`} label="Completed" detail="books" tone="mint" tack="#2e9e6b" rotate={-1.5} />
              <StatCard emoji="🧭" value={`${booksLeftToGoal}`} label="Remaining" detail="books" tone="purple" tack="#9457c4" rotate={1.5} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
