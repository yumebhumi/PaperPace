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
    primary: "bg-[var(--accent)] text-white hover:bg-[#ff3838]",
    secondary:
      "bg-[var(--surface-postit)] text-[var(--foreground)] hover:bg-[var(--surface-postit-deep)]",
    ghost:
      "bg-white text-[var(--foreground)] hover:bg-[var(--surface-postit)]",
  }[variant];

  return (
    <button
      className={cn(
        "rough-ring wobbly-md inline-flex min-h-11 items-center justify-center gap-2 border-[3px] border-[var(--border)] px-4 py-2.5 text-sm font-extrabold transition-all duration-100 hard-shadow hover:-translate-y-[1px] hover:rotate-[-1deg] hover:[box-shadow:4px_5px_0px_0px_#2d2d2d] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-60",
        variantClass,
        className,
      )}
      {...props}
    />
  );
}
