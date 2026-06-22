import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function RoughInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "rough-ring wobbly-md min-h-11 w-full border-2 border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[rgba(45,45,45,0.4)] hard-shadow-soft",
        props.className,
      )}
    />
  );
}

export function RoughSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "rough-ring wobbly-md min-h-11 w-full border-2 border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] hard-shadow-soft",
        props.className,
      )}
    />
  );
}
