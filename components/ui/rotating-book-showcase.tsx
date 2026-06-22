"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";

import { cn, getInitials } from "@/lib/utils";

type ShowcaseBook = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
};

const coverPalettes = [
  {
    shell: "bg-[linear-gradient(180deg,#f2e7ca_0%,#e4d0a3_100%)]",
    accent: "bg-[rgba(155,77,53,0.14)]",
    spine: "bg-[#9b4d35]",
  },
  {
    shell: "bg-[linear-gradient(180deg,#dce7dd_0%,#c6d5ca_100%)]",
    accent: "bg-[rgba(49,95,75,0.14)]",
    spine: "bg-[#315f4b]",
  },
  {
    shell: "bg-[linear-gradient(180deg,#e3e2d9_0%,#cdc9bd_100%)]",
    accent: "bg-[rgba(32,36,31,0.1)]",
    spine: "bg-[#20241f]",
  },
];

export function RotatingBookShowcase({ books }: { books: ShowcaseBook[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const hasBooks = books.length > 0;

  useEffect(() => {
    if (!hasBooks) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % books.length);
      setFlipKey((current) => current + 1);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [books.length, hasBooks]);

  const activeBook = books[activeIndex];
  const palette = useMemo(
    () => coverPalettes[activeIndex % coverPalettes.length],
    [activeIndex],
  );

  if (!hasBooks || !activeBook) {
    return (
      <div className="relative overflow-hidden rounded-lg border-2 border-[var(--border)] bg-[var(--surface)] p-5 hard-shadow-soft">
        <div className="absolute right-4 top-4 h-14 w-14 rounded-md border border-[rgba(32,36,31,0.12)] opacity-60" />
        <div className="flex min-h-[260px] items-center justify-center">
          <div className="relative flex h-[220px] w-[180px] animate-[bookFloat_5.8s_ease-in-out_infinite] items-center justify-center rounded-lg border-2 border-[var(--border)] bg-[linear-gradient(180deg,#f2e7ca_0%,#fbfaf4_100%)] hard-shadow-soft">
            <div className="absolute inset-y-4 left-1/2 w-[2px] -translate-x-1/2 bg-[rgba(32,36,31,0.18)]" />
            <div className="absolute left-7 top-8 h-24 w-12 rounded-l-md border-2 border-r-0 border-[var(--border)] bg-white/70" />
            <div className="absolute right-7 top-8 h-24 w-12 rounded-r-md border-2 border-l-0 border-[var(--border)] bg-white/70" />
            <div className="relative z-10 text-center">
              <span className="ink-icon mx-auto inline-flex p-3">
                <BookOpen className="h-5 w-5 text-[var(--foreground)]" strokeWidth={2.6} />
              </span>
              <p className="mt-4 text-sm text-[var(--muted)]">Reading in motion</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-[var(--border)] bg-[var(--surface)] p-5 hard-shadow-soft">
      <div className="absolute right-4 top-4 h-14 w-14 rounded-md border border-[rgba(32,36,31,0.12)] opacity-60" />
      <div className="relative flex min-h-[260px] items-center justify-center">
        <div className="absolute inset-x-6 bottom-4 h-7 rounded-full bg-[rgba(45,45,45,0.08)] blur-sm" />
        <div
          key={flipKey}
          className="absolute inset-y-7 right-[18%] w-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.04))] opacity-0 animate-[pageFlip_3600ms_ease-in-out_infinite]"
        />
        <div className="relative h-[230px] w-[168px] animate-[bookFloat_5.8s_ease-in-out_infinite]">
          {books.map((book, index) => {
            const currentPalette = coverPalettes[index % coverPalettes.length];
            const isActive = index === activeIndex;

            return (
              <div
                key={book.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  isActive
                    ? "translate-y-0 rotate-[-2deg] scale-100 opacity-100"
                    : "translate-y-2 rotate-[1deg] scale-[0.97] opacity-0",
                )}
              >
                <div
                  className={cn(
                    "relative flex h-full w-full overflow-hidden rounded-lg border-2 border-[var(--border)] hard-shadow-soft",
                    currentPalette.shell,
                  )}
                  style={
                    book.coverUrl
                      ? {
                          backgroundImage: `linear-gradient(180deg, rgba(251,250,244,0.22), rgba(32,36,31,0.12)), url(${book.coverUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <div className={cn("w-5 shrink-0 border-r-2 border-[var(--border)]", currentPalette.spine)} />
                  <div className="relative flex-1 p-4">
                    <div className={cn("absolute right-4 top-4 h-10 w-10 rounded-md opacity-65", currentPalette.accent)} />
                    <div className="absolute inset-x-4 bottom-4 h-[1px] border-b border-[rgba(32,36,31,0.16)]" />
                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--muted)]">
                          Featured route
                        </p>
                        <h3 className="mt-4 text-2xl leading-tight text-[var(--foreground)]">
                          {book.title}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted)]">{book.author}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border-2 border-[var(--border)] bg-white/75 text-sm text-[var(--foreground)] hard-shadow-soft">
                          {getInitials(book.title)}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                          Page pace
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {books.map((book, index) => (
          <button
            key={book.id}
            type="button"
            aria-label={`Show ${book.title}`}
            onClick={() => {
              setActiveIndex(index);
              setFlipKey((current) => current + 1);
            }}
            className={cn(
              "h-2.5 w-2.5 rounded-full border border-[var(--border)] transition-all duration-200",
              index === activeIndex ? palette.spine : "bg-white",
            )}
          />
        ))}
      </div>
    </div>
  );
}
