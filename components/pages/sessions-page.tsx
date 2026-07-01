import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import type { ReadingSession, ReaderSnapshot } from "@/lib/types";
import { formatPace } from "@/lib/utils";

const washiCycle = ["washi", "washi washi-mint", "washi washi-blue"] as const;
const rotateCycle = [-0.5, 0.4, -0.3, 0.55] as const;

const moodMeta: Record<string, { emoji: string; bg: string }> = {
  Focused: { emoji: "🎯", bg: "#dbe7ff" },
  Calm: { emoji: "😌", bg: "#d6f5e3" },
  Curious: { emoji: "🤔", bg: "#efe1fb" },
  Tired: { emoji: "😴", bg: "#ffe9f1" },
  Immersed: { emoji: "🌊", bg: "#d9f2ff" },
};

function moodInfo(mood?: string) {
  if (mood && moodMeta[mood]) {
    return moodMeta[mood];
  }
  return { emoji: "✨", bg: "#f3ece2" };
}

export function SessionsPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Sessions"
        title="Your reading journal, one taped-in entry at a time"
        description="Every sit-down session lands here — pace, mood, and focus, tracked without turning into a guilt trip. Just keep turning pages ✨"
        emoji="📝"
        tone="pink"
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          {snapshot.sessions.length === 0 ? (
            <Surface tone="postit" decoration="washi" className="p-6 text-center">
              <div className="text-[28px]">📔</div>
              <p className="mt-2 font-display text-[20px] font-bold">No entries taped in yet</p>
              <p className="mt-1.5 text-[13px] font-bold text-[var(--muted)]">
                Start a reading session from the dashboard and it&apos;ll show up here like a fresh journal page.
              </p>
            </Surface>
          ) : (
            snapshot.sessions.map((session, index) => (
              <SessionEntry key={session.id} session={session} index={index} />
            ))
          )}
        </div>

        <div className="space-y-4">
          <JournalNote
            emoji="🔥"
            title="Streak principle"
            body="Short sessions absolutely count. The goal here is rhythm, not reading shame — every taped-in entry keeps the streak alive."
            tone="pink"
            decoration="washi"
            rotate={-0.6}
          />
          <JournalNote
            emoji="🖊️"
            title="Future extension"
            body="Quotes and marginalia notes will tape in right here later, without needing to redesign a single sticker."
            tone="mint"
            decoration="washi-mint"
            rotate={0.5}
          />
          <JournalNote
            emoji="📅"
            title="Consistency marker"
            body="Monday recaps and yearly wrap-ups are queued up next — first, let's keep the logging habit humming along."
            tone="sky"
            decoration="washi-blue"
            rotate={-0.4}
          />
        </div>
      </div>
    </div>
  );
}

function SessionEntry({ session, index }: { session: ReadingSession; index: number }) {
  const mood = moodInfo(session.mood);
  const dateLabel = new Date(session.endedAt).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timeLabel = new Date(session.startedAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const rotate = rotateCycle[index % rotateCycle.length];
  const washi = washiCycle[index % washiCycle.length];

  return (
    <article
      className={`relative border-[3px] border-[var(--border)] bg-white p-5 wobbly-card hard-shadow ${washi}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span
            className="inline-block whitespace-nowrap rounded-full border-2 border-dashed border-[var(--border)] px-3 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em]"
            style={{ background: "#fff9c4" }}
          >
            {dateLabel}
          </span>
          <h3 className="mt-2.5 font-display text-[22px] font-bold leading-[1.1]">
            {session.bookTitle}
          </h3>
          <p className="mt-1 text-[13px] font-bold text-[var(--muted)]">
            {session.pagesRead} pages in {session.durationMinutes} min · nice work 👏
          </p>
        </div>
        <span
          className="whitespace-nowrap rounded-full border-2 border-[var(--border)] px-3 py-1.5 text-[13px] font-extrabold text-white"
          style={{ background: "var(--secondary-accent)", boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
        >
          ⏱️ {formatPace(session.paceSecondsPerPage)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div
          className="border-[2.5px] border-[var(--border)] px-3.5 py-3 wobbly-md"
          style={{ background: mood.bg, boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
        >
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#6b655c]">
            {mood.emoji} Mood
          </p>
          <p className="mt-1.5 font-display text-[18px] font-bold leading-none">
            {session.mood ?? "Untracked"}
          </p>
        </div>

        <div
          className="border-[2.5px] border-[var(--border)] px-3.5 py-3 wobbly-md"
          style={{ background: "#fffdf2", boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
        >
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#6b655c]">
            🎯 Focus score
          </p>
          <p className="mt-1.5 font-display text-[18px] font-bold leading-none">
            {session.focusScore ?? "—"}
          </p>
          {typeof session.focusScore === "number" ? (
            <div className="relative mt-2 h-2.5 track">
              <div
                className="track-fill"
                style={{ width: `${Math.min(100, Math.max(0, session.focusScore))}%`, background: "var(--secondary-accent)" }}
              />
            </div>
          ) : null}
        </div>

        <div
          className="border-[2.5px] border-[var(--border)] px-3.5 py-3 wobbly-md"
          style={{ background: "#dbe7ff", boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
        >
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#6b655c]">
            ⏰ Window
          </p>
          <p className="mt-1.5 font-display text-[18px] font-bold leading-none">{timeLabel}</p>
        </div>
      </div>
    </article>
  );
}

function JournalNote({
  emoji,
  title,
  body,
  tone,
  decoration,
  rotate,
}: {
  emoji: string;
  title: string;
  body: string;
  tone: "pink" | "mint" | "sky";
  decoration: "washi" | "washi-mint" | "washi-blue";
  rotate: number;
}) {
  return (
    <Surface tone={tone} decoration={decoration} className="p-5" style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 min-w-[44px] -rotate-[4deg] items-center justify-center border-[3px] border-[var(--border)] text-[22px] wobbly-note"
          style={{ background: "#fff", boxShadow: "2px 2px 0 var(--border)" }}
        >
          {emoji}
        </span>
        <div className="min-w-0">
          <div className="font-display text-[19px] font-bold leading-tight">{title}</div>
          <p className="mt-1.5 text-[13px] font-bold leading-6 text-[#6b655c]">{body}</p>
        </div>
      </div>
    </Surface>
  );
}
