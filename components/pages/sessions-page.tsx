import { Calendar, Flame, NotebookPen } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import type { ReaderSnapshot } from "@/lib/types";
import { formatPace } from "@/lib/utils";

export function SessionsPage({ snapshot }: { snapshot: ReaderSnapshot }) {
  return (
    <div className="space-y-6">
      <Surface className="p-5 md:p-6" decoration="none">
        <SectionHeading
          eyebrow="Sessions"
          title="Reading logs that feel like training summaries"
          description="This page keeps the core session history, mood signal, and reading notes visible without turning into a social feed."
        />
        <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div className="space-y-4">
            {snapshot.sessions.map((session) => (
              <article
                key={session.id}
                className="wobbly-card border-2 border-[var(--border)] bg-white p-4 hard-shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] hard-shadow-soft wobbly-note">
                      {new Date(session.endedAt).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="mt-3 text-2xl">{session.bookTitle}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {session.pagesRead} pages in {session.durationMinutes} minutes
                    </p>
                  </div>
                  <div className="wobbly-md border-2 border-[var(--border)] bg-[var(--secondary-accent)] px-3 py-2 text-sm text-white hard-shadow-soft">
                    {formatPace(session.paceSecondsPerPage)}
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="wobbly-md border-[3px] border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.4)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Mood</p>
                    <p className="mt-2 text-lg">{session.mood ?? "Untracked"}</p>
                  </div>
                  <div className="wobbly-md border-[3px] border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.4)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Focus score</p>
                    <p className="mt-2 text-lg">{session.focusScore ?? "—"}</p>
                  </div>
                  <div className="wobbly-md border-[3px] border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.4)] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Window</p>
                    <p className="mt-2 text-lg">
                      {new Date(session.startedAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-5">
            <Surface className="p-5" tone="postit" decoration="none">
              <div className="flex items-start gap-3">
                <div className="ink-icon p-3 text-[var(--foreground)]">
                  <Flame className="h-5 w-5" strokeWidth={2.7} />
                </div>
                <div>
                  <p className="text-lg">Streak principle</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Short sessions count. The design goal is to reduce guilt and maintain rhythm, not to create reading shame.
                  </p>
                </div>
              </div>
            </Surface>
            <Surface className="p-5" tone="muted" decoration="none">
              <div className="flex items-start gap-3">
                <div className="ink-icon p-3 text-[var(--foreground)]">
                  <NotebookPen className="h-5 w-5" strokeWidth={2.7} />
                </div>
                <div>
                  <p className="text-lg">Future extension</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Quotes and notes can attach here later without changing the session-centric model.
                  </p>
                </div>
              </div>
            </Surface>
            <Surface className="p-5" tone="paper" decoration="none">
              <div className="flex items-start gap-3">
                <div className="ink-icon p-3 text-[var(--foreground)]">
                  <Calendar className="h-5 w-5" strokeWidth={2.7} />
                </div>
                <div>
                  <p className="text-lg">Consistency marker</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Keep Monday summaries and yearly recap generation as follow-on work. The core logging flow comes first.
                  </p>
                </div>
              </div>
            </Surface>
          </div>
        </div>
      </Surface>
    </div>
  );
}
