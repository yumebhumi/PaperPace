import { SignUp } from "@clerk/nextjs";

import { Surface } from "@/components/ui/surface";

export default function SignUpPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <Surface className="w-full max-w-md p-5 md:p-6 lg:h-full lg:max-h-[760px] lg:min-h-0" decoration="none">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Get started</p>
      <h1 className="mt-3 text-3xl text-[var(--foreground)]">Create your account</h1>
      <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
        Start logging pages, sessions, and streaks from your first book.
      </p>
      <div className="mt-5">
        {hasClerk ? (
          <SignUp fallbackRedirectUrl="/dashboard" signInUrl="/sign-in" />
        ) : (
          <div className="wobbly-md border-2 border-[var(--border)] bg-white p-4 text-sm leading-6 text-[var(--muted)] hard-shadow-soft">
            Add your Clerk keys in <code>.env.local</code> to enable authentication.
          </div>
        )}
      </div>
    </Surface>
  );
}
