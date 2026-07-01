import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";

const steps: {
  emoji: string;
  tone: "yellow" | "pink" | "mint" | "blue";
  tack: string;
  rotate: number;
  title: string;
  copy: (snapshot: ReaderSnapshot) => string;
}[] = [
  {
    emoji: "⏰",
    tone: "yellow",
    tack: "#ff4d4d",
    rotate: -1.5,
    title: "Set your rhythm",
    copy: () =>
      "Pick a simple weekly goal, like 5 sessions. Sessions — not whole books — are the real win here.",
  },
  {
    emoji: "📖",
    tone: "pink",
    tack: "#2d5da1",
    rotate: 1.2,
    title: "Add one active book",
    copy: (snapshot) =>
      `Start with ${snapshot.currentBook.title} or whatever you're mid-way through. One book is plenty for day one.`,
  },
  {
    emoji: "🔔",
    tone: "mint",
    tack: "#ff4d4d",
    rotate: -1,
    title: "Choose a reminder time",
    copy: () =>
      "Anchor the habit to a calm reading window — evenings are a cozy default to start with.",
  },
  {
    emoji: "🚀",
    tone: "blue",
    tack: "#2d5da1",
    rotate: 1.6,
    title: "Launch your first session",
    copy: () => "Immediate action matters most — the timer should already be one tap away.",
  },
];

export function OnboardingPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  return (
    <div className="space-y-6">
      <span className="chip">Welcome</span>
      <Surface className="mt-2 p-5 md:p-6" decoration="washi">
        <SectionHeading
          eyebrow="Onboarding"
          emoji="👋"
          tone="pink"
          title={`Hey ${snapshot.user.displayName}, let's get you set up in under a minute`}
          description="Four tiny steps — pin them up like a checklist — and you'll have a reading session ready to start. No need to organize a whole shelf first."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative border-[3px] border-[var(--border)] px-4 pb-5 pt-5 wobbly-note transition-transform duration-100 hover:-translate-y-0.5"
              style={{
                background:
                  step.tone === "yellow"
                    ? "#fff9c4"
                    : step.tone === "pink"
                      ? "#ffe9f1"
                      : step.tone === "mint"
                        ? "#d6f5e3"
                        : "#dbe7ff",
                boxShadow: "3px 3px 0 var(--border)",
                transform: `rotate(${step.rotate}deg)`,
              }}
            >
              <span
                aria-hidden
                className="absolute left-1/2 top-[-9px] h-4 w-4 -translate-x-1/2 rounded-full border-[2.5px] border-[var(--border)]"
                style={{ background: step.tack, boxShadow: "1.5px 1.5px 0 var(--border)" }}
              />
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 min-w-[44px] -rotate-[4deg] items-center justify-center border-[3px] border-[var(--border)] bg-white text-[22px] wobbly-note">
                  {step.emoji}
                </span>
                <span
                  className="whitespace-nowrap rounded-full border-2 border-[var(--border)] bg-white px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em]"
                  style={{ boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
                >
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-[19px] font-bold leading-[1.15]">{step.title}</h3>
              <p className="mt-2 text-[13px] font-bold leading-6 text-[#6b655c]">
                {step.copy(snapshot)}
              </p>
            </div>
          ))}
        </div>
      </Surface>

      <div className="pt-1 text-center font-display text-[18px] text-[var(--faint)]">
        every session counts ✦ let&apos;s begin ✦
      </div>
    </div>
  );
}
