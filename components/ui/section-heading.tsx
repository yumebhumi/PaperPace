const chipTones: Record<string, string> = {
  yellow: "#fff9c4",
  pink: "#ffe9f1",
  mint: "#d6f5e3",
  blue: "#dbe7ff",
  purple: "#efe1fb",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  emoji,
  tone = "yellow",
  sticky = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  emoji?: string;
  tone?: keyof typeof chipTones;
  /** kept for backwards compatibility */
  sticky?: boolean;
}) {
  const heading = (
    <div>
      <span
        className={`inline-block border-2 border-[var(--border)] px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-[var(--foreground)] ${
          sticky ? "wobbly-note -rotate-1 hard-shadow-soft" : "rounded-full"
        }`}
        style={{ background: chipTones[tone] ?? chipTones.yellow }}
      >
        {eyebrow}
      </span>
      <h2 className="mt-2.5 max-w-2xl font-display text-[26px] font-bold leading-[1.05] text-[var(--foreground)] md:text-[30px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-2xl text-[13px] font-bold leading-6 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );

  if (!emoji) {
    return heading;
  }

  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-11 w-11 min-w-[44px] -rotate-[4deg] items-center justify-center border-[3px] border-[var(--border)] text-[22px] wobbly-note"
        style={{ background: chipTones[tone] ?? chipTones.yellow, boxShadow: "2px 2px 0 var(--border)" }}
      >
        {emoji}
      </span>
      {heading}
    </div>
  );
}
