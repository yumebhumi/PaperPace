import { SignIn } from "@clerk/nextjs";

import { Surface } from "@/components/ui/surface";

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <Surface className="w-full max-w-md p-5 md:p-6 lg:h-full lg:max-h-[760px] lg:min-h-0" decoration="none">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Sign in</p>
      <h1 className="mt-3 text-3xl text-[var(--foreground)]">Welcome back</h1>
      <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
        Continue your reading streak and jump back into your dashboard.
      </p>
      <div className="mt-5">
        {hasClerk ? (
          <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
        ) : (
          <div className="wobbly-md border-2 border-[var(--border)] bg-white p-4 text-sm leading-6 text-[var(--muted)] hard-shadow-soft">
            Add your Clerk keys in <code>.env.local</code> to enable authentication.
          </div>
        )}
      </div>
    </Surface>
  );
}
