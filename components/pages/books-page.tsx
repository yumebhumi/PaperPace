import Link from "next/link";
import { BookOpenText, Flag, Sparkles } from "lucide-react";

import { BookRoute } from "@/components/ui/book-route";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";
import { percent } from "@/lib/utils";

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
      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Library"
          title="Your active reading routes"
          description="Keep every current, queued, and finished book in one place, then jump straight back into your next reading session."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            {snapshot.books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow transition-transform duration-100 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] hard-shadow-soft wobbly-note">
                      {book.status.replaceAll("_", " ")}
                    </p>
                    <h3 className="mt-3 text-2xl text-[var(--foreground)]">{book.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{book.author}</p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
                      {book.description}
                    </p>
                  </div>
                  <div className="ink-icon p-3 text-[var(--foreground)]">
                    <BookOpenText className="h-5 w-5" strokeWidth={2.7} />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {book.genres.map((genre) => (
                    <span
                      key={genre}
                      className="wobbly-md border-[2px] border-dashed border-[var(--border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-base text-[var(--muted)]">
                  <span>
                    {book.currentPage} / {book.pageCount} pages
                  </span>
                  <span>{percent(book.currentPage, book.pageCount)}%</span>
                </div>
                <div className="mt-3 h-3 rounded-full border-[2px] border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.5)]">
                  <div
                    className="h-3 rounded-full bg-[var(--secondary-accent)]"
                    style={{ width: `${percent(book.currentPage, book.pageCount)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="space-y-5">
            <Surface className="p-5" decoration="none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
                    Continue reading
                  </p>
                  <h3 className="mt-3 text-2xl">{snapshot.currentBook.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Pick up where you left off and keep your current route moving.
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-[var(--accent)]" strokeWidth={2.7} />
              </div>
              <div className="mt-6">
                <BookRoute
                  currentPage={snapshot.currentBook.currentPage}
                  pageCount={snapshot.currentBook.pageCount}
                  stops={snapshot.currentBook.routeStops}
                />
              </div>
            </Surface>

            <Surface className="p-5" tone="muted" decoration="none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--foreground)]">
                    Reading goal
                  </p>
                  <h3 className="mt-3 text-2xl text-[var(--foreground)]">
                    {completedBooks} of {yearlyGoal} books this year
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {pagesLeftToGoal.toLocaleString()} pages left to hit your annual target.
                  </p>
                </div>
                <div className="ink-icon p-3 text-[var(--foreground)]">
                  <Flag className="h-5 w-5" strokeWidth={2.7} />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Goal progress</span>
                  <span>{goalProgress}%</span>
                </div>
                <div className="mt-3 h-3 rounded-full border-[2px] border-dashed border-[var(--border)] bg-white/60">
                  <div
                    className="h-3 rounded-full bg-[var(--accent)]"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="wobbly-md border-2 border-[var(--border)] bg-white/70 p-3 hard-shadow-soft">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    Completed
                  </p>
                  <p className="mt-2 text-xl text-[var(--foreground)]">{completedBooks} books</p>
                </div>
                <div className="wobbly-md border-2 border-[var(--border)] bg-white/70 p-3 hard-shadow-soft">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    Remaining
                  </p>
                  <p className="mt-2 text-xl text-[var(--foreground)]">{booksLeftToGoal} books</p>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </Surface>
    </div>
  );
}
