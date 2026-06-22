import { User } from "lucide-react";

import { Surface } from "@/components/ui/surface";

export default function UserProfilePage() {
  return (
    <Surface className="p-6 md:p-7" decoration="none">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Profile</p>
          <h1 className="mt-2 text-3xl text-[var(--foreground)]">Reader profile</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Keep your reading identity, profile details, and public-facing account settings in one place.
          </p>
        </div>
        <span className="ink-icon p-3">
          <User className="h-5 w-5" strokeWidth={2.6} />
        </span>
      </div>
    </Surface>
  );
}
