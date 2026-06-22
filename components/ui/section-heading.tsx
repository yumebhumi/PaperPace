export function SectionHeading({
  eyebrow,
  title,
  description,
  sticky = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  sticky?: boolean;
}) {
  return (
    <div>
      <p
        className={`inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--foreground)] ${
          sticky ? "wobbly-note -rotate-1 hard-shadow-soft" : "wobbly-md rotate-[0.5deg] hard-shadow-soft"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 max-w-3xl text-3xl leading-tight font-bold text-[var(--foreground)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  );
}
