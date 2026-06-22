"use client";

import { motion } from "framer-motion";

import { percent } from "@/lib/utils";

export function BookRoute({
  currentPage,
  pageCount,
  stops,
}: {
  currentPage: number;
  pageCount: number;
  stops: string[];
}) {
  const progress = percent(currentPage, pageCount);

  return (
    <div className="wobbly-card rotate-1 border-[3px] border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.88)] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Book route</p>
        <p className="text-sm text-[var(--foreground)]">{progress}% complete</p>
      </div>
      <div className="relative mt-6">
        <div className="absolute left-0 top-4 h-[3px] w-full border-b-[3px] border-dashed border-[rgba(45,45,45,0.28)]" />
        <motion.div
          className="absolute left-0 top-4 h-[4px] bg-[var(--accent)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <div className="relative grid grid-cols-5 gap-2">
          {stops.map((stop, index) => {
            const stopPercent = (index / (stops.length - 1 || 1)) * 100;
            const active = progress >= stopPercent;

            return (
              <div key={stop} className="flex flex-col items-center text-center">
                <div
                  className={`h-8 w-8 rounded-full border ${
                    active
                      ? "border-[var(--border)] bg-[var(--accent)] text-white"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
                  } flex items-center justify-center border-[3px] text-xs hard-shadow-soft`}
                  style={{
                    borderRadius:
                      index % 2 === 0
                        ? "58% 42% 46% 54% / 52% 44% 56% 48%"
                        : "44% 56% 52% 48% / 58% 42% 46% 54%",
                  }}
                >
                  {index + 1}
                </div>
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{stop}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
