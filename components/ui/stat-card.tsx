import type { LucideIcon } from "lucide-react";

const tones: Record<string, string> = {
  pink: "#ffe0ec",
  yellow: "#fff9c4",
  mint: "#d6f5e3",
  blue: "#dbe7ff",
  purple: "#efe1fb",
  peach: "#ffe4d6",
  paper: "#ffffff",
};

export type StatTone = keyof typeof tones;

export function StatCard({
  label,
  value,
  detail,
  emoji,
  icon: Icon,
  tone = "yellow",
  tack = "#ff4d4d",
  rotate = 0,
}: {
  label: string;
  value: string;
  detail?: string;
  emoji?: string;
  icon?: LucideIcon;
  tone?: StatTone;
  tack?: string;
  rotate?: number;
}) {
  return (
    <div
      className="relative h-full border-[3px] border-[var(--border)] px-3.5 pb-4 pt-4 wobbly-note"
      style={{
        background: tones[tone] ?? tones.yellow,
        boxShadow: "3px 3px 0 var(--border)",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-[-9px] h-4 w-4 -translate-x-1/2 rounded-full border-[2.5px] border-[var(--border)]"
        style={{ background: tack, boxShadow: "1.5px 1.5px 0 var(--border)" }}
      />
      <div className="text-[26px] leading-none">
        {emoji ? emoji : Icon ? <Icon className="h-6 w-6" strokeWidth={2.6} /> : null}
      </div>
      <div className="mt-2 font-display text-[25px] font-bold leading-[1.05] text-[var(--foreground)]">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
        {label}
      </div>
      {detail ? <div className="mt-1.5 text-[12px] font-bold text-[#6b655c]">{detail}</div> : null}
    </div>
  );
}
