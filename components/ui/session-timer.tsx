"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Square, TimerReset } from "lucide-react";

import { ReadingReceiptModal } from "@/components/ui/reading-receipt-modal";
import { RoughInput, RoughSelect } from "@/components/ui/rough-field";
import type { ReadingReceipt } from "@/lib/types";

type SessionTimerProps = {
  bookId: string;
  initialPage: number;
};

export function SessionTimer({ bookId, initialPage }: SessionTimerProps) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startPage, setStartPage] = useState(initialPage);
  const [endPage, setEndPage] = useState(initialPage);
  const [mood, setMood] = useState("Focused");
  const [receipt, setReceipt] = useState<ReadingReceipt | null>(null);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  const durationLabel = useMemo(() => {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [elapsed]);

  async function endSession() {
    setRunning(false);
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookId,
        startPage,
        endPage,
        durationSeconds: elapsed,
        mood,
        focusScore: Math.min(100, 60 + Math.round((endPage - startPage) * 1.5)),
      }),
    });
    if (!response.ok) {
      return;
    }
    const result = (await response.json()) as { receipt?: ReadingReceipt };
    if (result.receipt) {
      setReceipt(result.receipt);
      setElapsed(0);
      setStartPage(endPage);
    }
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setStartPage(initialPage);
    setEndPage(initialPage);
  }

  return (
    <>
      <section
        className="relative overflow-hidden border-[3px] border-[var(--border)] bg-[var(--border)] px-5 py-5 wobbly-md md:px-6"
        style={{ boxShadow: "5px 5px 0 rgba(45,45,45,0.35)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-[3px] text-[26px]"
              style={{ borderColor: "#fff9c4", background: "rgba(255,255,255,0.06)" }}
            >
              ⏱️
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: "#ffd6e8" }}>
                Reading session
              </div>
              <div className="font-display text-[40px] font-bold leading-none tracking-[0.02em] text-white">
                {durationLabel}
              </div>
              <div className="mt-0.5 text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.66)" }}>
                on page {endPage} · {running ? "keep going, you've got this 💪" : "ready when you are ✨"}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRunning((value) => !value)}
              className="inline-flex items-center gap-1.5 rounded-[18px] border-[3px] border-[var(--border)] px-5 py-2.5 text-[15px] font-extrabold text-[var(--foreground)]"
              style={{ background: running ? "#ffd6e8" : "#fff9c4", boxShadow: "3px 3px 0 #000" }}
            >
              <Play className="h-4 w-4" strokeWidth={2.7} />
              {running ? "Pause" : "Start"}
            </button>
            <button
              type="button"
              onClick={endSession}
              className="inline-flex items-center gap-1.5 rounded-[18px] border-[3px] px-4 py-2.5 text-[14px] font-extrabold"
              style={{ borderColor: "#fff9c4", color: "#fff9c4", background: "transparent" }}
            >
              <Square className="h-4 w-4" strokeWidth={2.7} />
              End
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-[18px] border-[3px] px-4 py-2.5 text-[14px] font-extrabold"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.75)", background: "transparent" }}
            >
              <TimerReset className="h-4 w-4" strokeWidth={2.7} />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-[16px] border-2 border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.05)] p-3.5 sm:grid-cols-3">
          <label className="block">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Start page
            </span>
            <RoughInput
              className="mt-1.5 min-h-11 text-base"
              type="number"
              value={startPage}
              onChange={(event) => setStartPage(Number(event.target.value))}
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.6)" }}>
              End page
            </span>
            <RoughInput
              className="mt-1.5 min-h-11 text-base"
              type="number"
              value={endPage}
              onChange={(event) => setEndPage(Number(event.target.value))}
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.6)" }}>
              Mood
            </span>
            <RoughSelect
              className="mt-1.5 min-h-11 text-base"
              value={mood}
              onChange={(event) => setMood(event.target.value)}
            >
              <option>Focused</option>
              <option>Calm</option>
              <option>Curious</option>
              <option>Tired</option>
              <option>Immersed</option>
            </RoughSelect>
          </label>
        </div>
      </section>

      {receipt ? <ReadingReceiptModal receipt={receipt} onClose={() => setReceipt(null)} /> : null}
    </>
  );
}
