import { SignIn } from "@clerk/nextjs";

import { Surface } from "@/components/ui/surface";

export default function SignInPage() {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <Surface
      className="w-full max-w-md p-5 md:p-6 lg:h-full lg:max-h-[760px] lg:min-h-0"
      decoration="washi"
    >
      <span className="chip">🔖 Sign in</span>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-[var(--foreground)]">
        Welcome back, reader
      </h1>
      <p className="mt-1.5 text-[13.5px] font-bold leading-6 text-[var(--muted)]">
        Continue your streak and jump back into your dashboard — every page counts ✨
      </p>
      <div className="mt-5">
        {hasClerk ? (
          <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
        ) : (
          <div
            className="border-[2.5px] border-[var(--border)] bg-white p-4 text-sm font-bold leading-6 text-[var(--muted)] wobbly-md"
            style={{ boxShadow: "2px 2px 0 rgba(45,45,45,0.16)" }}
          >
            📌 Add your Clerk keys in <code>.env.local</code> to enable authentication.
          </div>
        )}
      </div>
    </Surface>
  );
}
