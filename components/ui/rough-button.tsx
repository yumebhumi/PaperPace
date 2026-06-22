import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function RoughButton({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variantClass = {
    primary:
      "bg-white text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white",
    secondary:
      "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--secondary-accent)] hover:text-white",
    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-postit)]",
  }[variant];

  return (
    <button
      className={cn(
        "rough-ring wobbly inline-flex min-h-11 items-center justify-center gap-2 border-2 border-[var(--border)] px-4 py-2.5 text-sm transition-all duration-100 hard-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-60",
        variantClass,
        className,
      )}
      {...props}
    />
  );
}
