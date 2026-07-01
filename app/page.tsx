import Link from "next/link";

import { BookCover } from "@/components/ui/book-cover";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { demoSnapshot } from "@/lib/demo-data";
import { cn, formatPace, getInitials, percent } from "@/lib/utils";

const heroPills = [
  { emoji: "🔥", label: "6-day streak", bg: "#ffe0ec", rotate: -2 },
  { emoji: "📖", label: "684 pages logged", bg: "#fff9c4", rotate: 1.5 },
  { emoji: "⏱️", label: "1:44 pace", bg: "#dbe7ff", rotate: -1 },
  { emoji: "📈", label: "67% through Atomic Habits", bg: "#d6f5e3", rotate: 2 },
];

const features = [
  {
    emoji: "⏱️",
    title: "Reading sessions",
    description: "Track every reading sprint. Start a timer, log pages, and build momentum.",
    stat: "12 sessions this week",
    bg: "#ffe0ec",
    washi: "washi",
    rotate: "-rotate-1",
  },
  {
    emoji: "📖",
    title: "Pages as distance",
    description: "Every page counts as progress. Measure your reading like movement.",
    stat: "684 pages this month",
    bg: "#dbe7ff",
    washi: "washi-blue",
    rotate: "rotate-[0.6deg]",
  },
  {
    emoji: "🐢",
    title: "Pace analytics",
    description: "Understand how fast you read and how your pace evolves book to book.",
    stat: "1:44 average pace",
    bg: "#fff9c4",
    washi: "washi-mint",
    rotate: "rotate-[-0.8deg]",
  },
  {
    emoji: "🔥",
    title: "Reading streaks",
    description: "Show up daily and watch your streak stack up, one page at a time.",
    stat: "Best streak: 11 days",
    bg: "#efe1fb",
    washi: "washi",
    rotate: "rotate-1",
  },
  {
    emoji: "🗺️",
    title: "Book journey map",
    description: "Every book becomes a route with stops — see exactly how far you've come.",
    stat: "5 stops per book",
    bg: "#d6f5e3",
    washi: "washi-blue",
    rotate: "rotate-[-0.5deg]",
  },
  {
    emoji: "📊",
    title: "Weekly heatmap",
    description: "A week-at-a-glance view of when and how much you read.",
    stat: "7-day snapshot",
    bg: "#ffe9f1",
    washi: "washi-mint",
    rotate: "rotate-[0.9deg]",
  },
];

const steps = [
  {
    emoji: "📚",
    title: "Pick a book",
    description: "Choose your next route and set the page where you want to begin.",
  },
  {
    emoji: "⏱️",
    title: "Start a reading session",
    description: "Launch the timer when you sit down to read and lock into the session.",
  },
  {
    emoji: "✍️",
    title: "Log pages and time",
    description: "Track distance, total time, and pace so each session becomes measurable.",
  },
  {
    emoji: "🗺️",
    title: "Watch your progress map grow",
    description: "See your route move forward with streaks, milestones, and book progress.",
  },
];

function CtaLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  children: React.ReactNode;
}) {
  const variantClass =
    variant === "primary"
      ? "bg-[var(--accent)] text-white hover:bg-[#ff3838]"
      : "bg-white text-[var(--foreground)] hover:bg-[var(--surface-postit)]";

  return (
    <Link
      href={href}
      className={cn(
        "rough-ring wobbly-md inline-flex min-h-11 items-center justify-center gap-2 border-[3px] border-[var(--border)] px-5 py-3 text-sm font-extrabold transition-all duration-100 hard-shadow hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d] active:translate-x-1 active:translate-y-1 active:shadow-none",
        variantClass,
        className,
      )}
    >
      {children}
    </Link>
  );
}

export default function Home() {
  const { currentBook, books } = demoSnapshot;
  const circe = books[2];
  const martian = books[1];
  const progress = percent(currentBook.currentPage, currentBook.pageCount);

  return (
    <div className="space-y-6">
      {/* ===== hero ===== */}
      <section
        id="home"
        className="relative scroll-mt-24 overflow-hidden border-[3px] border-[var(--border)] bg-white px-6 py-8 hard-shadow-lg wobbly-card washi md:scroll-mt-28 md:px-9 md:py-10"
      >
        <div className="grid items-center gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="chip">📚 Strava for readers</span>
            <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.05] text-[var(--foreground)] md:text-[3.2rem]">
              Track your reading{" "}
              <span className="relative inline-block scribble-underline text-[var(--accent)]">
                like a workout
              </span>
              .
            </h1>
            <p className="mt-4 max-w-lg text-[15px] font-bold leading-7 text-[var(--muted)]">
              Log pages, measure pace, build streaks, and watch every book become a route you can
              keep moving through.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {heroPills.map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--border)] px-3 py-1 text-[13px] font-extrabold text-[var(--foreground)]"
                  style={{
                    background: pill.bg,
                    boxShadow: "2px 2px 0 rgba(45,45,45,0.16)",
                    transform: `rotate(${pill.rotate}deg)`,
                  }}
                >
                  <span aria-hidden>{pill.emoji}</span>
                  {pill.label}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <CtaLink href="/sign-up">
                Start tracking <span aria-hidden>📖</span>
              </CtaLink>
              <CtaLink href="#features" variant="ghost">
                Explore features
              </CtaLink>
            </div>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-[360px] md:h-[340px]">
            <span
              className="absolute right-2 top-0 z-[1] whitespace-nowrap rounded-full border-2 border-dashed border-[var(--border)] px-3 py-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em]"
              style={{ background: "#fff9c4", transform: "rotate(-4deg)" }}
            >
              Currently reading
            </span>

            {circe ? (
              <div className="absolute left-2 top-16 z-0 hidden sm:block">
                <BookCover
                  title={circe.title}
                  color="purple"
                  width={104}
                  rotate={-14}
                />
              </div>
            ) : null}
            {martian ? (
              <div className="absolute right-0 top-24 z-0 hidden sm:block">
                <BookCover
                  title={martian.title}
                  color="mint"
                  width={104}
                  rotate={11}
                />
              </div>
            ) : null}

            <div className="absolute left-1/2 top-8 z-[2] -translate-x-1/2">
              <BookCover
                title={currentBook.title}
                author={currentBook.author}
                initials={getInitials(currentBook.title)}
                color="blue"
                width={176}
                rotate={-3}
                bookmark
                float
              />
            </div>

            <div
              className="absolute bottom-1 left-1/2 z-[3] -translate-x-1/2 rotate-[2deg] border-[2.5px] border-[var(--border)] px-3.5 py-2 wobbly-note"
              style={{ background: "#fffdf2", boxShadow: "3px 3px 0 var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-[22px] font-bold text-[var(--accent)]">
                  {progress}%
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">
                  through {currentBook.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== features ===== */}
      <section id="features" className="scroll-mt-24 md:scroll-mt-28">
        <SectionHeading
          eyebrow="Features"
          title="Built for consistent readers"
          description="The product is built to reward showing up, keep progress visible, and make every session feel measurable."
          emoji="🧰"
          tone="yellow"
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Surface
              key={feature.title}
              decoration={feature.washi as "washi" | "washi-mint" | "washi-blue"}
              className={cn(
                "flex min-h-[212px] flex-col justify-between gap-4 bg-white px-5 py-5",
                feature.rotate,
              )}
            >
              <div className="space-y-3">
                <span
                  className="flex h-11 w-11 -rotate-[4deg] items-center justify-center border-[3px] border-[var(--border)] text-[22px] wobbly-note"
                  style={{ background: feature.bg, boxShadow: "2px 2px 0 var(--border)" }}
                >
                  {feature.emoji}
                </span>
                <div>
                  <p className="font-display text-lg font-bold text-[var(--foreground)]">
                    {feature.title}
                  </p>
                  <p className="mt-1.5 text-[13px] font-bold leading-6 text-[var(--muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="w-fit rounded-full border-2 border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.35)] px-3 py-1 text-[11.5px] font-extrabold text-[var(--foreground)]">
                {feature.stat}
              </div>
            </Surface>
          ))}
        </div>
      </section>

      {/* ===== how it works ===== */}
      <section id="how-it-works" className="scroll-mt-24 md:scroll-mt-28">
        <SectionHeading
          eyebrow="How it works"
          title="A reading session becomes progress you can actually see."
          description="Start with one book, track one session, and let pace, distance, and streaks turn your reading into momentum."
          emoji="🧭"
          tone="pink"
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {steps.map((step, index) => (
            <Surface
              key={step.title}
              decoration="tack"
              className={cn(
                "bg-white px-6 py-6",
                index % 2 === 0 ? "-rotate-1" : "rotate-[0.7deg]",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-11 w-11 min-w-[44px] items-center justify-center border-[3px] border-[var(--border)] text-[20px] wobbly-note"
                  style={{ background: "#fff9c4", boxShadow: "2px 2px 0 var(--border)" }}
                >
                  {step.emoji}
                </span>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--muted)]">
                    Step {index + 1}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold leading-tight text-[var(--foreground)]">
                    {step.title}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[13.5px] font-bold leading-6 text-[var(--muted)]">
                {step.description}
              </p>
            </Surface>
          ))}
        </div>
      </section>

      {/* ===== closing cta ===== */}
      <Surface tone="accent" decoration="washi-blue" className="px-6 py-9 text-center md:px-10">
        <div className="mx-auto max-w-xl">
          <span className="inline-block rotate-[-2deg] text-[34px]">✨🔖📚</span>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
            Ready to make your reading count?
          </h2>
          <p className="mt-3 text-[14px] font-bold leading-6 text-white/90">
            Create a free account and log your first session in under a minute — pace: {formatPace(demoSnapshot.user.averagePace)}.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <CtaLink href="/sign-up" variant="ghost">
              Create free account
            </CtaLink>
            <CtaLink href="/sign-in" variant="ghost" className="bg-transparent text-white hover:bg-white/10">
              I already have an account
            </CtaLink>
          </div>
        </div>
      </Surface>
    </div>
  );
}
