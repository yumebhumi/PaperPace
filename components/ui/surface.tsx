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
  decoration?: "none" | "tape" | "tack" | "washi" | "washi-mint" | "washi-blue";
  tone?: "paper" | "postit" | "muted" | "accent" | "blue" | "pink" | "mint" | "purple" | "sky";
} & React.ComponentPropsWithoutRef<"section">) {
  const toneClass = {
    paper: "bg-[var(--surface)] text-[var(--foreground)]",
    postit: "bg-[var(--surface-postit)] text-[var(--foreground)]",
    muted: "bg-[var(--surface-muted)] text-[var(--foreground)]",
    accent: "bg-[var(--accent)] text-white",
    blue: "bg-[var(--secondary-accent)] text-white",
    pink: "bg-[var(--pink-050)] text-[var(--foreground)]",
    mint: "bg-[var(--mint-100)] text-[var(--foreground)]",
    purple: "bg-[var(--purple-100)] text-[var(--foreground)]",
    sky: "bg-[var(--blue-050)] text-[var(--foreground)]",
  }[tone];

  const decorationClass = {
    none: "",
    tape: "tape",
    tack: "thumbtack",
    washi: "washi",
    "washi-mint": "washi washi-mint",
    "washi-blue": "washi washi-blue",
  }[decoration];

  return (
    <section
      {...props}
      className={cn(
        "wobbly-card relative border-[3px] border-[var(--border)] hard-shadow",
        toneClass,
        decorationClass,
        className,
      )}
    >
      {children}
    </section>
  );
}
