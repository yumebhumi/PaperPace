"use client";

import { useMemo, useRef, useState } from "react";
import { Download, Instagram, Share2, X } from "lucide-react";
import { toBlob } from "html-to-image";

import { RoughButton } from "@/components/ui/rough-button";
import { RoughSelect } from "@/components/ui/rough-field";
import type { ReadingReceipt } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatPace } from "@/lib/utils";

type ReceiptStyle = "minimal" | "strava" | "cozy" | "dark";
type BackgroundMode = "cover" | "upload" | "gradient";

const styleThemes: Record<
  ReceiptStyle,
  {
    cardClass: string;
    badgeClass: string;
    textSubtle: string;
    overlayClass: string;
  }
> = {
  minimal: {
    cardClass: "bg-[#fdfbf7] text-[#2d2d2d]",
    badgeClass: "bg-white/80 text-[#2d2d2d]",
    textSubtle: "text-[rgba(45,45,45,0.72)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(253,251,247,0.16),rgba(253,251,247,0.88))]",
  },
  strava: {
    cardClass: "bg-[#ff6a3d] text-white",
    badgeClass: "bg-white/18 text-white",
    textSubtle: "text-white/78",
    overlayClass: "bg-[linear-gradient(180deg,rgba(20,20,20,0.1),rgba(20,20,20,0.55))]",
  },
  cozy: {
    cardClass: "bg-[#f4ead5] text-[#2d2d2d]",
    badgeClass: "bg-[#fff7e9] text-[#2d2d2d]",
    textSubtle: "text-[rgba(45,45,45,0.72)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(253,251,247,0.05),rgba(244,234,213,0.82))]",
  },
  dark: {
    cardClass: "bg-[#171717] text-white",
    badgeClass: "bg-white/12 text-white",
    textSubtle: "text-white/72",
    overlayClass: "bg-[linear-gradient(180deg,rgba(23,23,23,0.12),rgba(23,23,23,0.84))]",
  },
};

const gradientOptions = [
  "linear-gradient(180deg, #355c4b 0%, #1e2a25 100%)",
  "linear-gradient(180deg, #ff6a3d 0%, #8f2d1f 100%)",
  "linear-gradient(180deg, #2d5da1 0%, #16273e 100%)",
  "linear-gradient(180deg, #f4ead5 0%, #d8c1a0 100%)",
];

export function ReadingReceiptModal({
  receipt,
  onClose,
}: {
  receipt: ReadingReceipt;
  onClose: () => void;
}) {
  const [style, setStyle] = useState<ReceiptStyle>("minimal");
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(
    receipt.coverUrl ? "cover" : "gradient",
  );
  const [gradient, setGradient] = useState(gradientOptions[0]);
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = styleThemes[style];
  const formattedDate = new Date(receipt.date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const backgroundStyle = useMemo(() => {
    if (backgroundMode === "upload" && customBackgroundUrl) {
      return {
        backgroundImage: `url(${customBackgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    if (backgroundMode === "cover" && receipt.coverUrl) {
      return {
        backgroundImage: `url(${receipt.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    return {
      backgroundImage: gradient,
    };
  }, [backgroundMode, customBackgroundUrl, gradient, receipt.coverUrl]);

  async function exportCard() {
    if (!cardRef.current) {
      return null;
    }

    setIsExporting(true);
    try {
      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      return blob;
    } finally {
      setIsExporting(false);
    }
  }

  async function downloadCard(filename = "reading-receipt.png") {
    const blob = await exportCard();
    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function shareCard() {
    const blob = await exportCard();
    if (!blob) {
      return;
    }

    const file = new File([blob], "reading-receipt.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Reading Receipt",
        text: `${receipt.bookTitle} • ${receipt.distancePages} pages`,
      });
      return;
    }

    await downloadCard();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,24,24,0.55)] p-3 md:items-center md:p-6">
      <div className="w-full max-w-5xl overflow-hidden border-2 border-[var(--border)] bg-[var(--surface)] hard-shadow wobbly-card">
        <div className="flex items-center justify-between border-b-2 border-dashed border-[rgba(45,45,45,0.2)] px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              Reading receipt
            </p>
            <h2 className="mt-1 text-2xl text-[var(--foreground)]">Session complete</h2>
          </div>
          <button type="button" onClick={onClose} className="ink-icon p-2">
            <X className="h-4 w-4" strokeWidth={2.7} />
          </button>
        </div>

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="wobbly-md border-2 border-[var(--border)] bg-[var(--surface-postit)] p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Distance</p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{receipt.distancePages} pages</p>
              </div>
              <div className="wobbly-md border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Time</p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{receipt.durationMinutes} min</p>
              </div>
              <div className="wobbly-md border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Pace</p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">
                  {formatPace(receipt.paceSecondsPerPage)}
                </p>
              </div>
              <div className="wobbly-md border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Streak</p>
                <p className="mt-2 text-2xl text-[var(--foreground)]">{receipt.currentStreak} days</p>
              </div>
            </div>

            <div className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Session details</p>
              <div className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
                <p>{receipt.bookTitle}</p>
                <p className="text-[var(--muted)]">{formattedDate}</p>
                <p className="text-[var(--muted)]">{receipt.mood ?? "Focused"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Card style</span>
                <RoughSelect
                  className="mt-2"
                  value={style}
                  onChange={(event) => setStyle(event.target.value as ReceiptStyle)}
                >
                  <option value="minimal">Minimal</option>
                  <option value="strava">Strava-style</option>
                  <option value="cozy">Cozy paper-style</option>
                  <option value="dark">Dark aesthetic</option>
                </RoughSelect>
              </label>

              <label className="block">
                <span className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Background</span>
                <RoughSelect
                  className="mt-2"
                  value={backgroundMode}
                  onChange={(event) => setBackgroundMode(event.target.value as BackgroundMode)}
                >
                  {receipt.coverUrl ? <option value="cover">Book cover</option> : null}
                  <option value="upload">Upload custom background</option>
                  <option value="gradient">Preset gradient</option>
                </RoughSelect>
              </label>

              {backgroundMode === "upload" ? (
                <label className="block">
                  <span className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2 block w-full text-sm text-[var(--muted)]"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }
                      setCustomBackgroundUrl(URL.createObjectURL(file));
                    }}
                  />
                </label>
              ) : null}

              {backgroundMode === "gradient" ? (
                <div className="grid grid-cols-4 gap-2">
                  {gradientOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGradient(item)}
                      className={cn(
                        "h-12 border-2 border-[var(--border)] hard-shadow-soft wobbly-md",
                        gradient === item && "ring-2 ring-[rgba(45,93,161,0.22)]",
                      )}
                      style={{ backgroundImage: item }}
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <RoughButton type="button" onClick={() => downloadCard()}>
                <Download className="h-4 w-4" strokeWidth={2.7} />
                Download
              </RoughButton>
              <RoughButton type="button" variant="secondary" onClick={shareCard}>
                <Instagram className="h-4 w-4" strokeWidth={2.7} />
                Instagram story
              </RoughButton>
              <RoughButton type="button" variant="ghost" onClick={() => downloadCard("save-to-gallery.png")}>
                <Share2 className="h-4 w-4" strokeWidth={2.7} />
                Save to gallery
              </RoughButton>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-[360px]">
              <div
                ref={cardRef}
                className={cn(
                  "relative aspect-[9/16] overflow-hidden border-2 border-[var(--border)] wobbly-card hard-shadow",
                  theme.cardClass,
                )}
                style={backgroundStyle}
              >
                <div className={cn("absolute inset-0", theme.overlayClass)} />
                <div className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span className={cn("wobbly-note border-2 border-[var(--border)] px-3 py-1 text-[10px] uppercase tracking-[0.18em]", theme.badgeClass)}>
                      Reading receipt
                    </span>
                    <span className={cn("text-[11px]", theme.textSubtle)}>{formattedDate}</span>
                  </div>

                  <div>
                    <p className={cn("text-sm uppercase tracking-[0.18em]", theme.textSubtle)}>
                      {receipt.bookTitle}
                    </p>
                    <p className="mt-4 text-6xl leading-none">{receipt.distancePages}</p>
                    <p className="mt-2 text-xl">pages</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className={cn("wobbly-md border-2 border-[var(--border)] px-3 py-3", theme.badgeClass)}>
                        <p className={cn("text-[10px] uppercase tracking-[0.16em]", theme.textSubtle)}>Time</p>
                        <p className="mt-2 text-xl">{receipt.durationMinutes} min</p>
                      </div>
                      <div className={cn("wobbly-md border-2 border-[var(--border)] px-3 py-3", theme.badgeClass)}>
                        <p className={cn("text-[10px] uppercase tracking-[0.16em]", theme.textSubtle)}>Pace</p>
                        <p className="mt-2 text-xl">{formatPace(receipt.paceSecondsPerPage)}</p>
                      </div>
                    </div>

                    <div className={cn("wobbly-md border-2 border-[var(--border)] px-3 py-3", theme.badgeClass)}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={cn("text-[10px] uppercase tracking-[0.16em]", theme.textSubtle)}>
                            Streak
                          </p>
                          <p className="mt-2 text-xl">{receipt.currentStreak} days</p>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-[10px] uppercase tracking-[0.16em]", theme.textSubtle)}>
                            Mood
                          </p>
                          <p className="mt-2 text-lg">{receipt.mood ?? "Focused"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                Story-sized preview. Export to share after every reading session.
              </p>
            </div>
          </div>
        </div>
      </div>

      {isExporting ? (
        <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-[rgba(24,24,24,0.25)]">
          <div className="wobbly-md border-2 border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] hard-shadow-soft">
            Generating share card...
          </div>
        </div>
      ) : null}
    </div>
  );
}
