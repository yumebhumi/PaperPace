import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { Surface } from "@/components/ui/surface";

export default function NewBookPage() {
  return (
    <div className="space-y-5">
      <Surface className="p-6 md:p-7" decoration="none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Library</p>
            <h1 className="mt-2 text-3xl text-[var(--foreground)]">Add a new book</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              Start a new reading route by adding the book you want to train through next.
            </p>
          </div>
          <span className="ink-icon p-3">
            <Plus className="h-5 w-5" strokeWidth={2.6} />
          </span>
        </div>
      </Surface>

      <Surface className="p-6 md:p-7" decoration="none">
        <div className="space-y-4">
          <p className="text-sm text-[var(--foreground)]">Add title, author, total pages, current page, and reading status to get started.</p>
          <Link
            href="/books"
            className="inline-flex items-center gap-2 border-2 border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] hard-shadow-soft wobbly-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
            Back to library
          </Link>
        </div>
      </Surface>
    </div>
  );
}
