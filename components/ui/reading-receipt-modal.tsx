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
    label: string;
    cardClass: string;
    badgeClass: string;
    textSubtle: string;
    overlayClass: string;
  }
> = {
  minimal: {
    label: "Minimal ✨",
    cardClass: "bg-[#fdfbf7] text-[#2d2d2d]",
    badgeClass: "bg-white/85 text-[#2d2d2d] border-[var(--border)]",
    textSubtle: "text-[rgba(45,45,45,0.72)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(253,251,247,0.14),rgba(253,251,247,0.9))]",
  },
  strava: {
    label: "Strava-style 🏃",
    cardClass: "bg-[#ff6a3d] text-white",
    badgeClass: "bg-white/20 text-white border-white/70",
    textSubtle: "text-white/80",
    overlayClass: "bg-[linear-gradient(180deg,rgba(20,20,20,0.08),rgba(20,20,20,0.5))]",
  },
  cozy: {
    label: "Cozy paper 🍂",
    cardClass: "bg-[#f4ead5] text-[#2d2d2d]",
    badgeClass: "bg-[#fff7e9] text-[#2d2d2d] border-[var(--border)]",
    textSubtle: "text-[rgba(45,45,45,0.72)]",
    overlayClass: "bg-[linear-gradient(180deg,rgba(253,251,247,0.04),rgba(244,234,213,0.85))]",
  },
  dark: {
    label: "Dark aesthetic 🌙",
    cardClass: "bg-[var(--border)] text-white",
    badgeClass: "bg-white/12 text-white border-white/60",
    textSubtle: "text-white/72",
    overlayClass: "bg-[linear-gradient(180deg,rgba(23,23,23,0.1),rgba(23,23,23,0.86))]",
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(24,24,24,0.6)] p-3 md:items-center md:p-6">
      <div className="relative w-full max-w-5xl overflow-hidden border-[3px] border-[var(--border)] bg-white hard-shadow-lg wobbly-card washi">
        <div className="flex items-center justify-between gap-4 border-b-2 border-dashed border-[rgba(45,45,45,0.22)] px-5 py-4 md:px-6">
          <div>
            <span className="chip">Session complete</span>
            <h2 className="mt-2 font-display text-[26px] font-bold leading-[1.05]">
              Sticker your session <span className="inline-block rotate-[6deg]">🎉</span>
            </h2>
            <p className="mt-0.5 text-[12.5px] font-bold text-[var(--muted)]">
              Turn today&apos;s pages into a postcard worth sharing ✨
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ink-icon flex h-10 w-10 min-w-[40px] items-center justify-center text-[var(--foreground)] transition-transform duration-100 hover:-translate-y-[1px] hover:rotate-[-6deg]"
          >
            <X className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[0.95fr_1.05fr] md:px-6">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniStat label="Distance" value={`${receipt.distancePages} pages`} emoji="📖" bg="#fff9c4" rotate={-1.2} />
              <MiniStat label="Time" value={`${receipt.durationMinutes} min`} emoji="⏱️" bg="#ffe0ec" rotate={0.8} />
              <MiniStat label="Pace" value={formatPace(receipt.paceSecondsPerPage)} emoji="🐢" bg="#dbe7ff" rotate={-0.6} />
              <MiniStat label="Streak" value={`${receipt.currentStreak} days`} emoji="🔥" bg="#d6f5e3" rotate={1} />
            </div>

            <div
              className="relative border-[2.5px] border-[var(--border)] bg-white p-4 wobbly-note"
              style={{ boxShadow: "3px 3px 0 var(--border)" }}
            >
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
                📝 Session details
              </p>
              <div className="mt-2.5 space-y-1">
                <p className="font-display text-[19px] font-bold leading-tight">{receipt.bookTitle}</p>
                <p className="text-[13px] font-bold text-[var(--muted)]">{formattedDate}</p>
                <p className="text-[13px] font-bold text-[var(--muted)]">
                  Feeling {receipt.mood ?? "Focused"} today
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  🎨 Card style
                </span>
                <RoughSelect
                  className="mt-1.5"
                  value={style}
                  onChange={(event) => setStyle(event.target.value as ReceiptStyle)}
                >
                  <option value="minimal">{styleThemes.minimal.label}</option>
                  <option value="strava">{styleThemes.strava.label}</option>
                  <option value="cozy">{styleThemes.cozy.label}</option>
                  <option value="dark">{styleThemes.dark.label}</option>
                </RoughSelect>
              </label>

              <label className="block">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  🖼️ Background
                </span>
                <RoughSelect
                  className="mt-1.5"
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
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                    📤 Upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1.5 block w-full text-[12.5px] font-bold text-[var(--muted)]"
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
                <div className="grid grid-cols-4 gap-2.5">
                  {gradientOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGradient(item)}
                      aria-pressed={gradient === item}
                      className={cn(
                        "relative h-12 border-[2.5px] border-[var(--border)] wobbly-md transition-transform duration-100 hover:-translate-y-[1px]",
                        gradient === item
                          ? "outline outline-2 outline-offset-2 outline-[var(--secondary-accent)]"
                          : "",
                      )}
                      style={{ backgroundImage: item, boxShadow: "2px 2px 0 rgba(45,45,45,0.25)" }}
                    >
                      {gradient === item ? (
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface-postit)] text-[11px]">
                          ✓
                        </span>
                      ) : null}
                    </button>
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
                  "relative aspect-[9/16] -rotate-[1deg] overflow-hidden border-[3px] border-[var(--border)] wobbly-card hard-shadow-lg",
                  theme.cardClass,
                )}
                style={backgroundStyle}
              >
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[-11px] h-5 w-5 -translate-x-1/2 rounded-full border-[2.5px] border-[var(--border)]"
                  style={{ background: "#ff4d4d", boxShadow: "1.5px 1.5px 0 var(--border)" }}
                />
                <div className={cn("absolute inset-0", theme.overlayClass)} />
                <div className="relative flex h-full flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        "rounded-full border-2 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]",
                        theme.badgeClass,
                      )}
                    >
                      📖 Reading receipt
                    </span>
                    <span className={cn("text-[11px] font-extrabold", theme.textSubtle)}>{formattedDate}</span>
                  </div>

                  <div>
                    <p className={cn("text-[12px] font-extrabold uppercase tracking-[0.18em]", theme.textSubtle)}>
                      {receipt.bookTitle}
                    </p>
                    <p className="mt-3 font-display text-[64px] font-bold leading-none">
                      {receipt.distancePages}
                    </p>
                    <p className="mt-1.5 text-[20px] font-extrabold">pages turned ✨</p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className={cn("rounded-2xl border-2 px-3 py-2.5", theme.badgeClass)}>
                        <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.16em]", theme.textSubtle)}>
                          ⏱️ Time
                        </p>
                        <p className="mt-1.5 font-display text-[20px] font-bold leading-none">
                          {receipt.durationMinutes} min
                        </p>
                      </div>
                      <div className={cn("rounded-2xl border-2 px-3 py-2.5", theme.badgeClass)}>
                        <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.16em]", theme.textSubtle)}>
                          🐢 Pace
                        </p>
                        <p className="mt-1.5 font-display text-[20px] font-bold leading-none">
                          {formatPace(receipt.paceSecondsPerPage)}
                        </p>
                      </div>
                    </div>

                    <div className={cn("rounded-2xl border-2 px-3 py-2.5", theme.badgeClass)}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.16em]", theme.textSubtle)}>
                            🔥 Streak
                          </p>
                          <p className="mt-1.5 font-display text-[20px] font-bold leading-none">
                            {receipt.currentStreak} days
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.16em]", theme.textSubtle)}>
                            Mood
                          </p>
                          <p className="mt-1.5 text-[15px] font-extrabold">{receipt.mood ?? "Focused"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[12px] font-bold text-[var(--muted)]">
                Story-sized preview — export it to share after every session 📮
              </p>
            </div>
          </div>
        </div>
      </div>

      {isExporting ? (
        <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-[rgba(24,24,24,0.28)]">
          <div
            className="border-[2.5px] border-[var(--border)] bg-white px-4 py-3 text-[14px] font-extrabold text-[var(--foreground)] wobbly-md"
            style={{ boxShadow: "3px 3px 0 var(--border)" }}
          >
            Printing your sticker... 🖨️
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MiniStat({
  label,
  value,
  emoji,
  bg,
  rotate = 0,
}: {
  label: string;
  value: string;
  emoji: string;
  bg: string;
  rotate?: number;
}) {
  return (
    <div
      className="relative border-[2.5px] border-[var(--border)] px-4 py-3 wobbly-md"
      style={{ background: bg, boxShadow: "2px 2px 0 var(--border)", transform: `rotate(${rotate}deg)` }}
    >
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#6b655c]">
        {emoji} {label}
      </p>
      <p className="mt-1.5 font-display text-[20px] font-bold leading-none">{value}</p>
    </div>
  );
}
