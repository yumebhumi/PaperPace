import { RoughButton } from "@/components/ui/rough-button";
import { RoughInput } from "@/components/ui/rough-field";
import { SectionHeading } from "@/components/ui/section-heading";
import { Surface } from "@/components/ui/surface";
import { getInitials } from "@/lib/utils";

const displayName = "Jordan Lee";

const readerBadges: { emoji: string; label: string; tone: string }[] = [
  { emoji: "🔥", label: "12-day streak", tone: "#ffe0ec" },
  { emoji: "📚", label: "9 books finished", tone: "#fff9c4" },
  { emoji: "🐢", label: "steady pacer", tone: "#d6f5e3" },
  { emoji: "🥾", label: "first mile in", tone: "#dbe7ff" },
];

const favoriteGenres = ["Fantasy", "Sci-fi", "Memoir", "Mystery"];

export default function UserProfilePage() {
  return (
    <div className="space-y-6">
      <span className="chip">Profile</span>
      <Surface className="mt-2 p-5 md:p-6" decoration="washi">
        <SectionHeading
          eyebrow="Reader profile"
          emoji="🙋"
          tone="pink"
          title="Your reading identity"
          description="Keep your name, bio, and public-facing reader details in one taped-up spot."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
          {/* avatar sticker */}
          <div className="mx-auto flex flex-col items-center gap-3 lg:mx-0">
            <div
              className="flex h-28 w-28 -rotate-2 items-center justify-center border-[3px] border-[var(--border)] font-display text-[34px] font-bold wobbly-note"
              style={{ background: "#ffe27a", boxShadow: "4px 4px 0 var(--border)" }}
            >
              {getInitials(displayName)}
            </div>
            <span
              className="rounded-full border-2 border-[var(--border)] bg-white px-3 py-1 text-[12px] font-extrabold"
              style={{ boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
            >
              📖 reading for 3 years
            </span>
          </div>

          <div className="min-w-0">
            <div className="font-display text-[26px] font-bold leading-[1.1]">{displayName}</div>
            <p className="mt-1 text-[13px] font-bold text-[var(--muted)]">
              Slow mornings, fast finishes. Always mid-way through at least two books.
            </p>

            {/* sticker badges */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              {readerBadges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--border)] px-3 py-1 text-[12px] font-extrabold"
                  style={{ background: badge.tone, boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
                >
                  <span className="text-[15px]">{badge.emoji}</span>
                  {badge.label}
                </span>
              ))}
            </div>

            {/* favorite genres */}
            <div className="mt-5">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
                Favorite genres
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border-2 border-dashed border-[var(--border)] px-3 py-1 text-[12px] font-extrabold"
                    style={{ background: "#fffdf2" }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* editable details */}
            <div
              className="mt-5 border-[2.5px] border-[var(--border)] px-4 py-4 wobbly-md"
              style={{ background: "#fffef7", boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
                    Display name
                  </label>
                  <RoughInput className="mt-1.5" type="text" defaultValue={displayName} />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
                    Currently reading
                  </label>
                  <RoughInput className="mt-1.5" type="text" defaultValue="Project Hail Mary" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--label)]">
                  Bio
                </label>
                <RoughInput
                  className="mt-1.5"
                  type="text"
                  defaultValue="Slow mornings, fast finishes."
                />
              </div>
              <div className="mt-4">
                <RoughButton type="button" variant="primary">
                  Save profile ✨
                </RoughButton>
              </div>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}
