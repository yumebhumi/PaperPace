import { ArrowRight, Bell, BookPlus, TimerReset } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";

export function OnboardingPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  return (
    <div className="space-y-6">
      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Onboarding"
          title="The first-run flow should create action in under a minute"
          description="This page documents the product’s intended first-use UX inside the MVP so the experience stays aligned with the research plan."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: TimerReset,
              title: "Set your rhythm",
              copy: "Pick a simple weekly goal like 5 sessions. Sessions, not books, are the primary unit of success.",
            },
            {
              icon: BookPlus,
              title: "Add one active book",
              copy: `Start with ${snapshot.currentBook.title} or any current read. The user should not need to organize a whole shelf first.`,
            },
            {
              icon: Bell,
              title: "Choose reminder time",
              copy: "Anchor the habit to a calm reading window. Evening default is strong for the initial audience.",
            },
            {
              icon: ArrowRight,
              title: "Launch first session",
              copy: "Immediate action matters. The best onboarding ends with a timer already ready to start.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div
              key={title}
              className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow transition-transform duration-100 hover:-translate-y-0.5"
            >
              <div className="ink-icon inline-flex p-3 text-[var(--foreground)]">
                <Icon className="h-5 w-5" strokeWidth={2.7} />
              </div>
              <h3 className="mt-4 text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}
