const PALETTE = ["#ffd6e8", "#fff3a8", "#cdeafd", "#d6f5e3", "#cdb4ff", "#ffb3a1", "#b8e0ff"];

export function WeeklyBars({ data }: { data: { day: string; pages: number }[] }) {
  const max = Math.max(...data.map((d) => d.pages), 1);
  const total = data.reduce((sum, d) => sum + d.pages, 0);

  return (
    <section className="relative border-[3px] border-[var(--border)] bg-white px-5 py-5 hard-shadow wobbly-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-[22px]">📊</span>
          <div className="font-display text-[24px] font-bold">Pages this week</div>
        </div>
        <span
          className="whitespace-nowrap rounded-full border-2 border-dashed border-[var(--border)] px-3 py-1 text-[12px] font-extrabold"
          style={{ background: "#fff9c4" }}
        >
          {total} total
        </span>
      </div>
      <div className="mt-5 flex h-[150px] items-end justify-between gap-2.5">
        {data.map((d, i) => {
          const isPeak = d.pages === max && d.pages > 0;
          const height = d.pages === 0 ? 8 : Math.round((d.pages / max) * 100);
          return (
            <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className="text-[12px] font-extrabold text-[#6b655c]">{d.pages}</div>
              <div
                className="w-full border-[3px] border-[var(--border)]"
                style={{
                  height: `${height}%`,
                  background: isPeak ? "#ff4d4d" : d.pages === 0 ? "#efe9dd" : PALETTE[i % PALETTE.length],
                  borderRadius: "8px 8px 4px 4px",
                  boxShadow: "2px 2px 0 rgba(45,45,45,0.18)",
                }}
              />
              <div className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[var(--faint)]">
                {d.day}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
