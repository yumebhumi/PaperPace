import { cn } from "@/lib/utils";

export function Surface({
  className,
  children,
  decoration = "none",
  tone = "paper",
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  decoration?: "none" | "tape" | "tack";
  tone?: "paper" | "postit" | "muted" | "accent" | "blue";
} & React.ComponentPropsWithoutRef<"section">) {
  const toneClass = {
    paper: "bg-[var(--surface)] text-[var(--foreground)]",
    postit: "bg-[var(--surface-postit)] text-[var(--foreground)]",
    muted: "bg-[var(--surface-muted)] text-[var(--foreground)]",
    accent: "bg-[var(--accent)] text-white",
    blue: "bg-[var(--secondary-accent)] text-white",
  }[tone];

  return (
    <section
      {...props}
      className={cn(
        "wobbly-card relative border-2 border-[var(--border)] hard-shadow bg-[var(--surface)]",
        toneClass,
        decoration === "tape" && "tape",
        decoration === "tack" && "thumbtack",
        className,
      )}
    >
      {children}
    </section>
  );
}
