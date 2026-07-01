type GenreDatum = { genre: string; pace: number };

const META: Record<string, { color: string; chipBg: string; emoji: string }> = {
  Romance: { color: "#ff5d92", chipBg: "#ffe0ec", emoji: "💗" },
  Thriller: { color: "#5b6ee1", chipBg: "#e2e6ff", emoji: "🔪" },
  Fantasy: { color: "#9457c4", chipBg: "#efe1fb", emoji: "🐉" },
  "Self-help": { color: "#ff4d4d", chipBg: "#ffe0e0", emoji: "🌱" },
  Productivity: { color: "#e0761f", chipBg: "#fbe8cf", emoji: "⚡" },
  Literary: { color: "#2e9e6b", chipBg: "#d6f5e3", emoji: "🪶" },
  Philosophy: { color: "#b8742e", chipBg: "#f6e6cf", emoji: "🦉" },
  "Science Fiction": { color: "#3a6db5", chipBg: "#dbe7ff", emoji: "🚀" },
};

const fallback = { color: "#2d5da1", chipBg: "#dbe7ff", emoji: "📖" };
const meta = (g: string) => META[g] ?? fallback;

export function GenrePaceCard({ data }: { data: GenreDatum[] }) {
  const genres = data
    .filter((g) => g.pace > 0)
    .map((g) => ({ ...g, ...meta(g.genre), pph: Math.round(3600 / g.pace) }));

  const enough = genres.length >= 2;

  const bars = [...genres].sort((a, b) => b.pph - a.pph);
  const maxBar = Math.max(...bars.map((g) => g.pph), 1);
  const fast = bars[0];
  const slow = bars[bars.length - 1];
  const insight = enough
    ? `You whip through ${fast.genre} ${fast.emoji} at ~${fast.pph} pg/hr, then slow down for ${slow.genre} ${slow.emoji} (~${slow.pph}/hr).`
    : "";

  // radar geometry
  const CX = 190;
  const CY = 140;
  const R = 92;
  const N = genres.length;
  const maxPph = Math.max(...genres.map((g) => g.pph), 1);
  const ang = (i: number) => ((-90 + (i * 360) / N) * Math.PI) / 180;
  const ptAt = (i: number, rr: number): [number, number] => [
    CX + rr * Math.cos(ang(i)),
    CY + rr * Math.sin(ang(i)),
  ];
  const fix = (n: number) => n.toFixed(1);
  const rings = [0.25, 0.5, 0.75, 1].map((f) =>
    genres.map((_, i) => ptAt(i, R * f).map(fix).join(",")).join(" "),
  );
  const axes = genres.map((_, i) => ptAt(i, R));
  const dataPoly = genres.map((g, i) => ptAt(i, R * (g.pph / maxPph)).map(fix).join(",")).join(" ");
  const verts = genres.map((g, i) => ptAt(i, R * (g.pph / maxPph)));
  const labels = genres.map((g, i) => {
    const [x, y] = ptAt(i, R + 13);
    const c = Math.cos(ang(i));
    const s = Math.sin(ang(i));
    let tx: string;
    let ty: string;
    if (Math.abs(c) < 0.3) {
      tx = "-50%";
      ty = s < 0 ? "-100%" : "0%";
    } else if (c > 0) {
      tx = "0%";
      ty = "-50%";
    } else {
      tx = "-100%";
      ty = "-50%";
    }
    return {
      left: `${((x / 380) * 100).toFixed(1)}%`,
      top: `${((y / 290) * 100).toFixed(1)}%`,
      transform: `translate(${tx},${ty})`,
      text: g.genre,
    };
  });

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <span
          className="flex h-11 w-11 min-w-[44px] -rotate-[4deg] items-center justify-center border-[3px] border-[var(--border)] text-[22px] wobbly-note"
          style={{ background: "#ffe9f1", boxShadow: "2px 2px 0 var(--border)" }}
        >
          📚
        </span>
        <div>
          <span className="chip">Genre pace</span>
          <div className="mt-1 font-display text-[25px] font-bold leading-[1.05]">
            Where your reading speeds up
          </div>
        </div>
      </div>

      {enough ? (
        <div className="grid items-stretch gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          {/* radar */}
          <div className="relative flex flex-col border-[3px] border-[var(--border)] bg-white px-5 py-5 hard-shadow wobbly-card">
            <div className="font-display text-[21px] font-bold leading-[1.1]">
              How your pace shifts by genre
            </div>
            <div className="mt-1 text-[12.5px] font-bold text-[var(--muted)]">
              Further out means you read it faster, not better.
            </div>
            <div className="mt-2 flex flex-1 items-center justify-center">
              <div className="relative w-full max-w-[340px]" style={{ aspectRatio: "380 / 290" }}>
                <svg
                  viewBox="0 0 380 290"
                  className="absolute inset-0 h-full w-full"
                  style={{ overflow: "visible" }}
                >
                  {rings.map((pts, i) => (
                    <polygon
                      key={i}
                      points={pts}
                      style={{ fill: "none", stroke: "rgba(45,45,45,0.2)", strokeWidth: 1.4, strokeDasharray: "4 5" }}
                    />
                  ))}
                  {axes.map(([x, y], i) => (
                    <line
                      key={i}
                      x1={CX}
                      y1={CY}
                      x2={x}
                      y2={y}
                      style={{ stroke: "rgba(45,45,45,0.2)", strokeWidth: 1.4, strokeDasharray: "4 5" }}
                    />
                  ))}
                  <polygon
                    points={dataPoly}
                    style={{ fill: "rgba(255,77,77,0.2)", stroke: "#ff4d4d", strokeWidth: 2.5, strokeLinejoin: "round" }}
                  />
                  {verts.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={4} style={{ fill: "#ff4d4d", stroke: "#2d2d2d", strokeWidth: 2 }} />
                  ))}
                </svg>
                {labels.map((l) => (
                  <div
                    key={l.text}
                    className="absolute whitespace-nowrap text-[12px] font-extrabold text-[var(--label)]"
                    style={{ left: l.left, top: l.top, transform: l.transform }}
                  >
                    {l.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* bars */}
          <div className="relative border-[3px] border-[var(--border)] bg-white px-5 py-5 hard-shadow wobbly-card">
            <div
              className="relative -rotate-[0.6deg] border-[2.5px] border-[var(--border)] px-4 py-3"
              style={{ background: "#fff9c4", boxShadow: "3px 3px 0 var(--border)", borderRadius: "16px 80px 18px 70px / 22px 16px 74px 20px" }}
            >
              <span
                className="absolute left-[22px] top-[-9px] h-3.5 w-3.5 rounded-full border-[2.5px] border-[var(--border)]"
                style={{ background: "#ff4d4d", boxShadow: "1.5px 1.5px 0 var(--border)" }}
              />
              <div className="font-display text-[16.5px] font-bold leading-[1.3]">{insight}</div>
            </div>
            <div className="mt-4 flex flex-col gap-3.5">
              {bars.map((g, i) => {
                const isFast = i === 0;
                const isSlow = i === bars.length - 1 && bars.length > 1;
                const badge = isFast ? "🐇 fastest" : isSlow ? "🐢 cozy" : "";
                return (
                  <div key={g.genre} className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 min-w-[36px] items-center justify-center rounded-full border-[2.5px] border-[var(--border)] text-[18px]"
                      style={{ background: g.chipBg, boxShadow: "2px 2px 0 rgba(45,45,45,0.18)" }}
                    >
                      {g.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="font-display text-[17px] font-bold leading-none">{g.genre}</span>
                          {badge ? (
                            <span
                              className="whitespace-nowrap rounded-full border-2 border-[var(--border)] px-1.5 py-px text-[9.5px] font-extrabold"
                              style={{ background: isFast ? "#d6f5e3" : "#f6e6cf" }}
                            >
                              {badge}
                            </span>
                          ) : null}
                        </div>
                        <div className="whitespace-nowrap font-display text-[16px] font-bold" style={{ color: g.color }}>
                          {g.pph}
                          <span className="text-[10.5px] font-extrabold text-[var(--faint)] font-body"> pg/hr</span>
                        </div>
                      </div>
                      <div className="mt-1.5 h-[18px] track">
                        <div
                          className="track-fill"
                          style={{ width: `${Math.round((g.pph / maxBar) * 100)}%`, background: g.color }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center gap-3 border-[3px] border-dashed border-[rgba(45,45,45,0.32)] bg-[rgba(255,249,196,0.3)] px-5 py-10 text-center wobbly-card">
          <div className="text-[34px]">🧭</div>
          <div className="max-w-[260px] font-display text-[19px] font-bold leading-tight">
            Read across 2+ genres to map your pace
          </div>
        </div>
      )}
    </div>
  );
}
