"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  Flame,
  Github,
  LibraryBig,
  Mail,
  Menu,
  Plus,
  Settings,
  Target,
  Timer,
  User,
  UserRound,
  X,
} from "lucide-react";
import { SignOutButton, SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const appNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Flame, emoji: "🏠", tint: "#ffe0ec" },
  { href: "/books", label: "Library", icon: LibraryBig, emoji: "📚", tint: "#dbe7ff" },
  { href: "/sessions", label: "Sessions", icon: Timer, emoji: "⏱️", tint: "#d6f5e3" },
  { href: "/stats", label: "Stats", icon: BookOpen, emoji: "📊", tint: "#efe1fb" },
];

const publicNavItems = [
  { href: "/#home", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
];

function XBrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M5 4.5h3.8l4.1 5.8 4.9-5.8H20l-6 7.1 6.5 9.4h-3.8l-4.5-6.4-5.4 6.4H4.4l6.5-7.7L5 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const socialLinks = [
  { href: "https://github.com/yumebhumi", label: "GitHub", icon: Github },
  { href: "https://x.com/coldcoffeecoder", label: "X", icon: XBrandIcon },
  { href: "mailto:bhumikastem15@gmail.com", label: "Email", icon: Mail },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit text-sm text-[var(--foreground)] transition-colors duration-100 hover:text-[var(--accent)]"
    >
      <span className="group relative inline-flex pb-1">
        {children}
        <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-100 group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group relative inline-flex items-center text-sm text-[var(--foreground)] transition-transform duration-100 hover:-rotate-[1deg]"
    >
      <span className="relative inline-flex pb-1">
        {children}
        <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-100 group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 items-center justify-center border-2 border-[var(--border)] bg-[var(--surface-postit)] hard-shadow-soft wobbly-note">
        <BookOpen className="h-3.5 w-3.5 -rotate-6 text-[var(--foreground)]" strokeWidth={2.6} />
      </span>
      <span className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] hard-shadow-soft wobbly-note">
        PaperPace
      </span>
    </span>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const initials = useMemo(() => {
    const source = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || "PP";
    return source
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex items-center gap-2 border-2 border-[var(--border)] bg-white px-2.5 py-1.5 text-sm text-[var(--foreground)] transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft wobbly-md"
      >
        <span
          className="inline-flex h-8 w-8 items-center justify-center border-2 border-[var(--border)] bg-[var(--surface-postit)] text-[11px] uppercase tracking-[0.08em] wobbly-note"
          style={user?.imageUrl ? { backgroundImage: `url(${user.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", color: "transparent" } : undefined}
        >
          {initials}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-100", open ? "rotate-180" : "")} strokeWidth={2.5} />
      </button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-56 border-2 border-[var(--border)] bg-[var(--surface)] p-2 hard-shadow wobbly-card">
          <div className="border-2 border-dashed border-[rgba(45,45,45,0.18)] bg-white px-3 py-2.5 wobbly-md">
            <p className="text-sm text-[var(--foreground)]">{user?.fullName || "Reader"}</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className="mt-2 space-y-1.5">
            <Link
              href="/user-profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 border-2 border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] transition-transform duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hard-shadow-soft wobbly-md"
            >
              <User className="h-3.5 w-3.5" strokeWidth={2.5} />
              Profile
            </Link>
            <Link
              href="/goals"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 border-2 border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] transition-transform duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hard-shadow-soft wobbly-md"
            >
              <Target className="h-3.5 w-3.5" strokeWidth={2.5} />
              Goals
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 border-2 border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--foreground)] transition-transform duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hard-shadow-soft wobbly-md"
            >
              <Settings className="h-3.5 w-3.5" strokeWidth={2.5} />
              Settings
            </Link>
            <SignOutButton>
              <button
                type="button"
                className="flex w-full items-center gap-2.5 border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-2 text-sm text-[var(--foreground)] transition-transform duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hard-shadow-soft wobbly-md"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                Sign out
              </button>
            </SignOutButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PaperPaceFooter({ hasClerk }: { hasClerk: boolean }) {
  return (
    <footer id="contact" className="mt-6 scroll-mt-24 border-t-2 border-dashed border-[rgba(45,45,45,0.24)] pt-4 md:scroll-mt-28">
      <div className="wobbly-card border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-4 hard-shadow-soft md:px-5">
        <div className="grid gap-6 md:grid-cols-3 md:items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center border-2 border-[var(--border)] bg-[var(--surface-postit)] hard-shadow-soft wobbly-note">
                <BookOpen className="h-4 w-4 -rotate-6 text-[var(--foreground)]" strokeWidth={2.6} />
              </span>
              <div>
                <p className="text-lg text-[var(--foreground)]">PaperPace</p>
                <p className="text-sm text-[var(--muted)]">Track your reading like a workout.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Quick links</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:max-w-sm">
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/books">Library</FooterLink>
              <FooterLink href="/sessions">Sessions</FooterLink>
              <FooterLink href="/stats">Stats</FooterLink>
              {hasClerk ? (
                <>
                  <SignedOut>
                    <FooterLink href="/sign-in">Sign in</FooterLink>
                    <FooterLink href="/sign-up">Sign up</FooterLink>
                  </SignedOut>
                </>
              ) : (
                <>
                  <FooterLink href="/sign-in">Sign in</FooterLink>
                  <FooterLink href="/sign-up">Sign up</FooterLink>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 md:justify-self-end">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">Connect</p>
            <div className="flex items-center justify-center gap-3 md:justify-end">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="group relative inline-flex"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center border-2 border-[var(--border)] bg-white transition-all duration-100 group-hover:-translate-y-[2px] group-hover:rotate-3 group-hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft wobbly-note">
                    <Icon className="h-4 w-4 text-[var(--foreground)]" strokeWidth={2.5} />
                  </span>
                  <span className="absolute inset-x-2 -bottom-1 h-[2px] origin-center scale-x-0 bg-[var(--accent)] transition-transform duration-100 group-hover:scale-x-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 border-t-2 border-dashed border-[rgba(45,45,45,0.16)] pt-3 text-center">
          <p className="text-sm text-[var(--foreground)]">Every page counts.</p>
          <p className="mt-1 text-xs text-[var(--muted)]">© 2026 PaperPace — built for readers who train.</p>
        </div>
      </div>
    </footer>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isAppPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/books") ||
    pathname.startsWith("/sessions") ||
    pathname.startsWith("/stats") ||
    pathname.startsWith("/onboarding");
  const authValuePoints = [
    "Track pages like distance",
    "Measure time per page",
    "Build a reading streak",
    "Watch your book route grow",
    "Track pace by genre",
    "Build consistency over time",
    "Save notes & quotes",
    "Share reading receipts",
    "Set yearly goals",
    "Weekly reading insights",
  ];

  if (isAuthPage) {
    return (
      <div className="paper-shell min-h-screen">
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-4 md:px-6 md:py-5">
          <div className="grid w-full items-stretch gap-5 lg:grid-cols-[1.22fr_1fr] lg:[min-height:calc(100vh-2.5rem)] lg:max-h-[760px]">
            <section className="hidden h-full border-2 border-[var(--border)] bg-[var(--surface)] p-6 hard-shadow lg:flex lg:flex-col lg:justify-between xl:p-7 wobbly-card">
              <div>
                <BrandMark />
                <h1 className="mt-5 max-w-md text-[2rem] leading-tight text-[var(--foreground)] xl:text-[2.15rem]">
                  Track your reading like a workout.
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
                  Log pages, measure pace, build streaks, and turn every book into a clear progress journey.
                </p>
              </div>
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
                  Built for readers who train.
                </p>
                <div className="mt-3 grid gap-2.5 xl:grid-cols-2">
                  {authValuePoints.map((item) => (
                    <div
                      key={item}
                      className="flex min-h-[48px] items-center border-2 border-[var(--border)] bg-white px-3.5 py-2.5 text-[13px] leading-5 text-[var(--foreground)] hard-shadow-soft wobbly-md"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <div className="flex h-full items-center justify-center lg:min-h-0">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAppPage) {
    return (
      <div className="paper-shell min-h-screen">
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
          <header className="flex items-center justify-between border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 hard-shadow wobbly-card">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandMark />
            </Link>
            <nav className="hidden items-center gap-4 text-sm text-[var(--foreground)] md:flex">
              {publicNavItems.map(({ href, label }) => (
                <NavLink key={href} href={href}>
                  {label}
                </NavLink>
              ))}
              {hasClerk ? (
                <>
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="wobbly-md border-2 border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="wobbly-md border-2 border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm text-white transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft"
                    >
                      Get started
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    {appNavItems.map(({ href, label }) => (
                      <NavLink key={href} href={href}>
                        {label}
                      </NavLink>
                    ))}
                    <Link
                      href="/books/new"
                      className="inline-flex items-center gap-2 border-2 border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm text-white transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft wobbly-md"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                      Add Book
                    </Link>
                    <UserMenu />
                  </SignedIn>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="wobbly-md border-2 border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--foreground)] transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="wobbly-md border-2 border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm text-white transition-all duration-100 hover:-translate-y-[1px] hover:rotate-[1deg] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] hard-shadow-soft"
                  >
                    Get started
                  </Link>
                </>
              )}
            </nav>
          </header>
          <main className="mt-6 flex-1">{children}</main>
          <PaperPaceFooter hasClerk={hasClerk} />
        </div>
      </div>
    );
  }

  return (
    <div className="paper-shell min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl gap-5 px-4 py-4 md:px-6 md:py-6">
        <aside className="sticky top-6 hidden w-64 shrink-0 self-start border-2 border-[var(--border)] bg-[var(--surface)] p-4 hard-shadow lg:flex lg:flex-col wobbly-card">
          <div className="flex items-start justify-between gap-3">
            <Link href="/dashboard" className="block">
              <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-3 py-1 text-[11px] uppercase tracking-[0.25em] hard-shadow-soft wobbly-note">
                PaperPace
              </p>
              <h1 className="mt-3 text-xl leading-tight text-[var(--foreground)]">Reading tracker</h1>
              <p className="mt-1.5 text-sm leading-5 text-[var(--muted)]">Pages, pace, sessions, and streaks.</p>
            </Link>
            {hasClerk ? <UserButton afterSignOutUrl="/" /> : null}
          </div>

          <nav className="mt-6 space-y-2">
            {appNavItems.map(({ href, label, emoji, tint }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 border-2 border-[var(--border)] bg-white px-3.5 py-2.5 text-sm font-extrabold text-[var(--foreground)] transition-all duration-100 hover:bg-[var(--surface-postit)] hover:translate-x-[1px] hover:translate-y-[1px] hover:[box-shadow:2px_2px_0px_0px_#2d2d2d] active:translate-x-1 active:translate-y-1 active:shadow-none wobbly-md hard-shadow",
                )}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center border-2 border-[var(--border)] text-[15px] wobbly-note"
                  style={{ background: tint, boxShadow: "1.5px 1.5px 0 rgba(45,45,45,0.16)" }}
                >
                  {emoji}
                </span>
                {label}
              </Link>
            ))}
          </nav>

          <div className="my-4 h-px border-t-2 border-dashed border-[rgba(45,45,45,0.22)]" />

          <div className="space-y-3">
            <div className="wobbly-md border-2 border-[var(--border)] bg-[var(--surface-postit)] p-3 hard-shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Current streak</p>
                  <p className="mt-1 text-2xl text-[var(--foreground)]">6 days</p>
                </div>
                <span className="ink-icon p-2">
                  <Flame className="h-4 w-4" strokeWidth={2.7} />
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">Best streak: 11 days</p>
            </div>

            <div className="wobbly-md border-2 border-[var(--border)] bg-white p-3 hard-shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">Yearly goal</p>
                  <p className="mt-1 text-2xl text-[var(--foreground)]">3 / 24</p>
                </div>
                <span className="ink-icon p-2">
                  <Target className="h-4 w-4" strokeWidth={2.7} />
                </span>
              </div>
              <div className="mt-3 h-2.5 rounded-full border-2 border-dashed border-[var(--border)] bg-[rgba(229,224,216,0.42)]">
                <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: "13%" }} />
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">21 books left this year</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 hard-shadow md:hidden wobbly-card">
            <div>
              <p className="inline-block border-2 border-[var(--border)] bg-[var(--surface-postit)] px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] hard-shadow-soft wobbly-note">
                PaperPace
              </p>
              <h1 className="mt-2 text-2xl">Dashboard</h1>
            </div>
            <button
              type="button"
              aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((value) => !value)}
              className="ink-icon p-2"
            >
              {mobileNavOpen ? <X className="h-4 w-4" strokeWidth={2.7} /> : <Menu className="h-4 w-4" strokeWidth={2.7} />}
            </button>
          </header>
          {mobileNavOpen ? (
            <div className="mt-3 border-2 border-[var(--border)] bg-[var(--surface)] p-3 hard-shadow md:hidden wobbly-card">
              <nav className="space-y-2">
                {appNavItems.map(({ href, label, emoji, tint }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-3 border-2 border-[var(--border)] bg-white px-3 py-2.5 text-sm font-extrabold text-[var(--foreground)] hard-shadow-soft wobbly-md"
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center border-2 border-[var(--border)] text-[15px] wobbly-note"
                      style={{ background: tint, boxShadow: "1.5px 1.5px 0 rgba(45,45,45,0.16)" }}
                    >
                      {emoji}
                    </span>
                    {label}
                  </Link>
                ))}
              </nav>
              {hasClerk ? (
                <div className="mt-3 flex items-center justify-end">
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="mt-3 flex justify-end">
                  <span className="ink-icon p-2">
                    <UserRound className="h-4 w-4" strokeWidth={2.7} />
                  </span>
                </div>
              )}
            </div>
          ) : null}
          <main className="mt-4 flex-1">{children}</main>
          <PaperPaceFooter hasClerk={hasClerk} />
        </div>
      </div>
    </div>
  );
}
