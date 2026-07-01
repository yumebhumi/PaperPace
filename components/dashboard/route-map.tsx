import { percent } from "@/lib/utils";

const STOP_EMOJI = ["🌱", "💭", "✏️", "🔖", "🌟", "🧭", "🚀", "🏁"];

export function RouteMap({
  stops,
  currentPage,
  pageCount,
}: {
  stops: string[];
  currentPage: number;
  pageCount: number;
}) {
  const progress = percent(currentPage, pageCount);
  const total = stops.length;
  const activeIndex = Math.min(total - 1, Math.floor((progress / 100) * total));

  return (
    <section className="relative border-[3px] border-[var(--border)] bg-white px-5 py-5 hard-shadow wobbly-card">
      <div className="flex items-center gap-2.5">
        <span className="text-[22px]">🗺️</span>
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--muted)]">
            Progress map
          </div>
          <div className="font-display text-[24px] font-bold leading-none">Your reading route</div>
        </div>
      </div>
      <div className="mt-5 flex flex-col">
        {stops.map((stop, index) => {
          const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "future";
          const isLast = index === stops.length - 1;
          const dot =
            state === "done"
              ? { mark: "✓", bg: "#2d5da1", color: "#fff", line: "#2d5da1", name: "#2d2d2d" }
              : state === "active"
                ? { mark: "🔖", bg: "#ff4d4d", color: "#fff", line: "rgba(45,45,45,0.3)", name: "#ff4d4d" }
                : { mark: "", bg: "#fff", color: "#9a9388", line: "rgba(45,45,45,0.2)", name: "#9a9388" };
          const note =
            state === "done" ? "done" : state === "active" ? "you are here!" : "up next";
          return (
            <div key={stop} className="relative flex items-center gap-3.5">
              <div className="flex flex-col items-center">
                <div
                  className="z-[2] flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-[var(--border)] text-[16px] font-extrabold"
                  style={{ background: dot.bg, color: dot.color, boxShadow: "2px 2px 0 rgba(45,45,45,0.18)" }}
                >
                  {dot.mark}
                </div>
                {!isLast ? (
                  <div className="h-[26px] w-0 border-l-[3px] border-dashed" style={{ borderColor: dot.line }} />
                ) : null}
              </div>
              <div className="flex-1 py-1.5">
                <div className="font-display text-[19px] font-bold leading-none" style={{ color: dot.name }}>
                  {stop}
                </div>
                <div className="text-[12px] font-bold text-[var(--faint)]">{note}</div>
              </div>
              <div className="text-[20px]">{STOP_EMOJI[index % STOP_EMOJI.length]}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
