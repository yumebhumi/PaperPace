const SCALE = ["#ece6d7", "#c7e9c0", "#8fd49a", "#52b56e", "#2e9e57"];
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

/**
 * A calendar-style reading heatmap. Real snapshots don't carry a full year of
 * daily data yet, so the field is seeded deterministically and the last few
 * days are lit to reflect the live streak — same idea as GitHub's grid.
 */
export function StreakGrid({
  currentStreak,
  bestStreak,
  totalPages,
}: {
  currentStreak: number;
  bestStreak: number;
  totalPages: number;
}) {
  const cells: number[] = [];
  for (let i = 0; i < 364; i += 1) {
    const r = Math.abs(Math.sin((i + 1) * 12.9898) * 43758.5453) % 1;
    const level = r < 0.45 ? 0 : r < 0.64 ? 1 : r < 0.81 ? 2 : r < 0.93 ? 3 : 4;
    cells.push(level);
  }
  // one rest day, then the active streak lit up to today
  const streak = Math.max(0, Math.min(currentStreak, 12));
  cells[363 - streak] = 0;
  for (let k = 0; k < streak; k += 1) {
    cells[363 - streak + 1 + k] = 2 + (k % 3);
  }

  const weeks = Array.from({ length: 52 }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => cells[w * 7 + d] ?? 0),
  );

  const badges = [
    { emoji: "🔥", label: `${currentStreak}-day streak`, bg: "#ffe0ec" },
    { emoji: "🏆", label: `Best ${bestStreak}`, bg: "#dbe7ff" },
    { emoji: "📖", label: `${totalPages} pages`, bg: "#d6f5e3" },
  ];

  return (
    <section className="relative border-[3px] border-[var(--border)] bg-white px-5 py-5 hard-shadow wobbly-card washi washi-mint">
      <div className="flex flex-wrap items-start justify-between gap-3.5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-11 w-11 min-w-[44px] -rotate-3 items-center justify-center border-[3px] border-[var(--border)] text-[22px] wobbly-note"
            style={{ background: "#d6f5e3", boxShadow: "2px 2px 0 var(--border)" }}
          >
            🌱
          </span>
          <div>
            <span className="chip">Reading streak</span>
            <div className="mt-1 font-display text-[25px] font-bold leading-[1.05]">
              Your year in pages
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.label}
              className="border-[2.5px] border-[var(--border)] px-3 py-1 text-[13px] font-extrabold rounded-full"
              style={{ background: b.bg, boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
            >
              {b.emoji} {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex pl-[30px]">
        <div className="flex flex-1 justify-between text-[10.5px] font-extrabold uppercase tracking-[0.04em] text-[var(--faint)]">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <div className="mt-1.5 flex gap-[5px]">
        <div className="flex flex-col gap-[3px]">
          {WEEKDAYS.map((w, i) => (
            <div
              key={i}
              className="h-[13px] w-[25px] text-[9.5px] font-extrabold leading-[13px] text-[var(--faint)]"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="flex flex-1 gap-[3px] overflow-hidden">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-1 flex-col gap-[3px]">
              {week.map((level, di) => (
                <div
                  key={di}
                  className="aspect-square w-full rounded-[3px] border border-[rgba(45,45,45,0.14)]"
                  style={{ background: SCALE[level] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-end gap-1.5 text-[11px] font-extrabold text-[var(--faint)]">
        <span>Fewer pages</span>
        {SCALE.map((bg) => (
          <span
            key={bg}
            className="h-3.5 w-3.5 rounded-[3px] border border-[rgba(45,45,45,0.18)]"
            style={{ background: bg }}
          />
        ))}
        <span>More 🌿</span>
      </div>
    </section>
  );
}
