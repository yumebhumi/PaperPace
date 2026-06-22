import { Target } from "lucide-react";

import { Surface } from "@/components/ui/surface";

export default function GoalsPage() {
  return (
    <Surface className="p-6 md:p-7" decoration="none">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Goals</p>
          <h1 className="mt-2 text-3xl text-[var(--foreground)]">Reading goals</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Track yearly targets, pages left, and pace-based milestones from one place.
          </p>
        </div>
        <span className="ink-icon p-3">
          <Target className="h-5 w-5" strokeWidth={2.6} />
        </span>
      </div>
    </Surface>
  );
}
