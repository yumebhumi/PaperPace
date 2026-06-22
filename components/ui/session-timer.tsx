"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Square, TimerReset } from "lucide-react";

import { ReadingReceiptModal } from "@/components/ui/reading-receipt-modal";
import { RoughButton } from "@/components/ui/rough-button";
import { RoughInput, RoughSelect } from "@/components/ui/rough-field";
import { Surface } from "@/components/ui/surface";
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
      <Surface className="p-6 md:p-8" decoration="none">
        <div className="flex items-start justify-between gap-4">
          <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] hard-shadow-soft wobbly-note">
            Live session
          </p>
          <div
            className={`wobbly-md border-2 px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
              running
                ? "border-[var(--border)] bg-[var(--accent)] text-white hard-shadow-soft"
                : "border-[var(--border)] bg-white text-[var(--muted)]"
            }`}
          >
            {running ? "Session active" : "Ready to start"}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--muted)]">Today’s focused reading time</p>
          <p className="mt-3 text-6xl leading-none text-[var(--foreground)] md:text-7xl">
            {durationLabel}
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1.2fr_1fr_1fr]">
          <RoughButton
            type="button"
            onClick={() => setRunning((value) => !value)}
            className={`min-h-14 text-base md:text-lg ${
              running
                ? "bg-[var(--surface-postit)]"
                : "bg-[var(--accent)] text-white hover:bg-[var(--foreground)]"
            }`}
          >
            <Play className="h-4.5 w-4.5" strokeWidth={2.7} />
            {running ? "Pause session" : "Start session"}
          </RoughButton>
          <RoughButton
            type="button"
            onClick={endSession}
            variant="secondary"
            className="min-h-14 text-base"
          >
            <Square className="h-4.5 w-4.5" strokeWidth={2.7} />
            End session
          </RoughButton>
          <RoughButton
            type="button"
            onClick={reset}
            variant="ghost"
            className="min-h-14 text-base"
          >
            <TimerReset className="h-4.5 w-4.5" strokeWidth={2.7} />
            Reset
          </RoughButton>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Start page</span>
            <RoughInput
              className="mt-2 min-h-12 text-base"
              type="number"
              value={startPage}
              onChange={(event) => setStartPage(Number(event.target.value))}
            />
          </label>
          <label className="block">
            <span className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">End page</span>
            <RoughInput
              className="mt-2 min-h-12 text-base"
              type="number"
              value={endPage}
              onChange={(event) => setEndPage(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Mood</span>
            <RoughSelect
              className="mt-2 min-h-12 text-base"
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
      </Surface>

      {receipt ? <ReadingReceiptModal receipt={receipt} onClose={() => setReceipt(null)} /> : null}
    </>
  );
}
