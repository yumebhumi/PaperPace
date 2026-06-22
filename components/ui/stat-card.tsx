import type { LucideIcon } from "lucide-react";

import { Surface } from "@/components/ui/surface";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <Surface
      className="h-full min-h-[158px] overflow-hidden p-5 transition-transform duration-100 hover:-translate-y-0.5 md:min-h-[168px] md:p-6"
      decoration="none"
    >
      <div className="flex h-full items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
          <p className="mt-3 text-[1.8rem] leading-none text-[var(--foreground)] md:text-[2.2rem]">
            {value}
          </p>
          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">{detail}</p>
        </div>
        <div className="ink-icon shrink-0 p-2.5 text-[var(--foreground)]">
          <Icon className="h-4.5 w-4.5" strokeWidth={2.7} />
        </div>
      </div>
    </Surface>
  );
}
