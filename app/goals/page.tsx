import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";

const goalBoard: {
  emoji: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  background: string;
  rotate: number;
}[] = [
  {
    emoji: "📚",
    label: "Books this year",
    current: 9,
    target: 24,
    unit: "books",
    color: "#ff4d4d",
    background: "#fff9c4",
    rotate: -1.4,
  },
  {
    emoji: "📄",
    label: "Pages this year",
    current: 2140,
    target: 5000,
    unit: "pages",
    color: "#2d5da1",
    background: "#ffe9f1",
    rotate: 1.1,
  },
  {
    emoji: "🔥",
    label: "Longest streak",
    current: 12,
    target: 30,
    unit: "days",
    color: "#ff6b3d",
    background: "#d6f5e3",
    rotate: -0.8,
  },
  {
    emoji: "⏰",
    label: "Reading time",
    current: 1380,
    target: 3000,
    unit: "minutes",
    color: "#9457c4",
    background: "#dbe7ff",
    rotate: 1.6,
  },
];

function GoalSlip({
  emoji,
  label,
  current,
  target,
  unit,
  color,
  background,
  rotate,
}: (typeof goalBoard)[number]) {
  const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <div
      className="relative border-[3px] border-[var(--border)] px-4 pb-4 pt-5 wobbly-note"
      style={{ background, boxShadow: "3px 3px 0 var(--border)", transform: `rotate(${rotate}deg)` }}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-[-9px] h-4 w-4 -translate-x-1/2 rounded-full border-[2.5px] border-[var(--border)]"
        style={{ background: color, boxShadow: "1.5px 1.5px 0 var(--border)" }}
      />
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 min-w-[36px] items-center justify-center border-2 border-[var(--border)] bg-white text-[18px] wobbly-note">
          {emoji}
        </span>
        <div className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--label)]">
          {label}
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="font-display text-[26px] font-bold leading-none">
          {current.toLocaleString()}
          <span className="text-[14px] text-[var(--muted)]"> / {target.toLocaleString()} {unit}</span>
        </div>
        <div className="font-display text-[20px] font-bold leading-none" style={{ color }}>
          {pct}%
        </div>
      </div>
      <div className="mt-3 h-3.5 track">
        <div className="track-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <span className="chip">Goals</span>
      <Surface className="mt-2 p-5 md:p-6" decoration="washi-mint">
        <SectionHeading
          eyebrow="Goal board"
          emoji="🎯"
          tone="mint"
          title="Your reading goals board"
          description="Pin up a books target, a pages target, and a pace goal — everything taped in one place so you can see the whole year at a glance."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {goalBoard.map((goal) => (
            <GoalSlip key={goal.label} {...goal} />
          ))}
        </div>

        <div
          className="mt-7 border-[2.5px] border-dashed border-[var(--border)] px-4 py-3.5 wobbly-md text-center"
          style={{ background: "#fffdf2" }}
        >
          <p className="text-[13px] font-bold text-[#6b655c]">
            Small steps stack up 🌱 — every logged session nudges these bars a little further.
          </p>
        </div>
      </Surface>
    </div>
  );
}
