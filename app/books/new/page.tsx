import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BookCover } from "@/components/ui/book-cover";
import { RoughInput, RoughSelect } from "@/components/ui/rough-field";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NewBookPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-2 border-[3px] border-[var(--border)] bg-white px-4 py-2 text-[13px] font-extrabold text-[var(--foreground)] hard-shadow-soft wobbly-md transition-all duration-100 hover:-translate-y-[1px]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.7} />
        Back to library
      </Link>

      <section className="relative overflow-hidden border-[3px] border-[var(--border)] bg-white px-6 py-6 hard-shadow-lg wobbly-card washi md:px-7 md:py-7">
        <SectionHeading
          eyebrow="Library"
          emoji="✍️"
          title="Add a new book"
          description="Start a new reading route by adding the book you want to travel through next."
        />

        <div className="mt-7 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
          <div className="mx-auto lg:mx-0">
            <BookCover title="Your next book" author="waiting for a title" color="purple" width={132} rotate={-2} float />
          </div>

          <div className="min-w-0">
            <div
              className="relative -rotate-[0.5deg] border-[2.5px] border-[var(--border)] px-4 py-3.5 wobbly-md"
              style={{ background: "#fff9c4", boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
            >
              <div className="font-display text-[16px] font-bold leading-[1.3]">
                Fill in the title, author, total pages, current page, and reading status to get started 📚
              </div>
              <div className="mt-1 text-[12px] font-bold text-[#6b655c]">
                A shiny sticker preview of this form — hooking it up is coming soon ✨
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  Title
                </span>
                <RoughInput disabled placeholder="e.g. The Midnight Library" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  Author
                </span>
                <RoughInput disabled placeholder="e.g. Matt Haig" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  Total pages
                </span>
                <RoughInput disabled type="number" placeholder="304" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  Current page
                </span>
                <RoughInput disabled type="number" placeholder="0" />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--label)]">
                  Reading status
                </span>
                <RoughSelect disabled defaultValue="WANT_TO_READ">
                  <option value="WANT_TO_READ">Want to read</option>
                  <option value="CURRENTLY_READING">Currently reading</option>
                  <option value="FINISHED">Finished</option>
                </RoughSelect>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 border-[3px] border-[var(--border)] bg-[var(--accent)] px-4 py-2.5 text-[14px] font-extrabold text-white wobbly-md hard-shadow transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d]"
              >
                Back to the shelf 📚
              </Link>
              <span className="chip">Feature brewing</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
