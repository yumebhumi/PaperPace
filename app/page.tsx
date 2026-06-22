import Link from "next/link";
import { BookOpen, Flame, Gauge, Route, Timer } from "lucide-react";

import { RotatingBookShowcase } from "@/components/ui/rotating-book-showcase";
import { Surface } from "@/components/ui/surface";
import { demoSnapshot } from "@/lib/demo-data";

const stats = [
  { label: "Pages read", value: "1,842" },
  { label: "Reading pace", value: "1:44 / page" },
  { label: "Current streak", value: "6 days" },
  { label: "Book progress", value: "67%" },
];

const steps = [
  {
    title: "Pick a book",
    description: "Choose your next route and set the page where you want to begin.",
  },
  {
    title: "Start a reading session",
    description: "Launch the timer when you sit down to read and lock into the session.",
  },
  {
    title: "Log pages and time",
    description: "Track distance, total time, and pace so each session becomes measurable.",
  },
  {
    title: "Watch your progress map grow",
    description: "See your route move forward with streaks, milestones, and book progress.",
  },
];

const features = [
  {
    title: "Reading Sessions",
    icon: Timer,
    description: "Track every reading sprint. Start a timer, log pages, and build momentum.",
    stat: "12 sessions this week",
  },
  {
    title: "Pages as Distance",
    icon: BookOpen,
    description: "Every page counts as progress. Measure your reading like movement.",
    stat: "1,842 pages this month",
  },
  {
    title: "Pace Analytics",
    icon: Gauge,
    description: "Understand how fast you read and how your pace evolves.",
    stat: "1:44 average pace",
  },
  { title: "Reading streaks", icon: Flame },
  { title: "Book journey map", icon: Route },
  { title: "Weekly heatmap", icon: BookOpen },
];

export default function Home() {
  const showcaseBooks = demoSnapshot.books.map(({ id, title, author, coverUrl }) => ({
    id,
    title,
    author,
    coverUrl,
  }));

  return (
    <div className="space-y-6">
      <Surface
        id="home"
        className="scroll-mt-24 px-6 py-8 md:scroll-mt-28 md:px-8 md:py-9 xl:px-9 xl:py-10"
        decoration="none"
      >
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-stretch">
          <div className="flex h-full flex-col justify-between gap-6 border-2 border-[var(--border)] bg-[rgba(255,255,255,0.72)] p-5 hard-shadow-soft wobbly-card md:p-6">
            <div>
              <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] hard-shadow-soft wobbly-note">
                Strava for readers
              </p>
              <h1 className="mt-5 max-w-xl text-4xl leading-tight text-[var(--foreground)] md:text-5xl">
                Track your reading like a workout.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-[var(--muted)]">
                Log pages, measure pace, build streaks, and watch every book become a route you can keep moving through.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
              <div className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Why it works
                </p>
                <p className="mt-3 text-lg text-[var(--foreground)]">
                  Turn reading into a habit you can measure, repeat, and share.
                </p>
              </div>
              <div className="wobbly-card border-2 border-[var(--border)] bg-[var(--surface-postit)] p-4 hard-shadow-soft">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  Today
                </p>
                <p className="mt-3 text-2xl text-[var(--foreground)]">28 pages</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">1 session logged</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="wobbly-md border-2 border-[var(--border)] bg-[var(--accent)] px-5 py-3 text-sm text-white hard-shadow"
              >
                Start tracking
              </Link>
              <a
                href="#features"
                className="wobbly-md border-2 border-[var(--border)] bg-white px-5 py-3 text-sm text-[var(--foreground)] hard-shadow"
              >
                Explore features
              </a>
            </div>
          </div>

          <div className="flex h-full flex-col justify-between gap-4">
            <RotatingBookShowcase books={showcaseBooks} />
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft"
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl text-[var(--foreground)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <Surface
        id="features"
        className="scroll-mt-24 p-6 md:scroll-mt-28 md:p-8"
        decoration="none"
      >
        <section>
          <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] hard-shadow-soft wobbly-note">
            Features
          </p>
          <h2 className="mt-4 text-3xl text-[var(--foreground)] md:text-4xl">
            Built for consistent readers
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            The product is built to reward showing up, keep progress visible, and make every session feel measurable.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ title, icon: Icon, description, stat }) => (
              <div
                key={title}
                className="flex min-h-[198px] flex-col justify-between gap-4 border-2 border-[var(--border)] bg-white p-4 hard-shadow-soft wobbly-card"
              >
                <div className="space-y-3">
                  <div className="ink-icon inline-flex p-2 text-[var(--foreground)]">
                    <Icon className="h-4 w-4" strokeWidth={2.7} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg text-[var(--foreground)]">{title}</p>
                    {description ? (
                      <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{description}</p>
                    ) : (
                      <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
                        Stay consistent, keep your reading visible, and build momentum one session at a time.
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-fit border-2 border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.35)] px-3 py-2 text-xs text-[var(--foreground)] wobbly-md">
                  {stat ?? "Daily reading, clearly tracked"}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Surface>

      <Surface
        id="how-it-works"
        className="scroll-mt-24 p-6 md:scroll-mt-28 md:p-8 xl:min-h-[min(82vh,860px)] xl:px-9 xl:py-10"
        decoration="none"
      >
        <section className="flex h-full flex-col justify-between">
          <div>
            <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] hard-shadow-soft wobbly-note">
              How it works
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl leading-tight text-[var(--foreground)] md:text-5xl">
              A reading session becomes progress you can actually see.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Start with one book, track one session, and let pace, distance, and streaks turn your reading into momentum.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:mt-10">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="flex min-h-[220px] flex-col justify-between border-2 border-[var(--border)] bg-white p-6 hard-shadow-soft wobbly-card md:min-h-[240px] md:p-7"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)] md:text-[15px]">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-5 text-2xl leading-tight text-[var(--foreground)] md:text-[2rem]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-6 max-w-md text-base leading-7 text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Surface>
    </div>
  );
}
