import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { OptionalClerkProvider } from "@/components/optional-clerk-provider";

export const metadata: Metadata = {
  title: "PaperPace",
  description: "A habit-first reading tracker that treats books like training.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OptionalClerkProvider>
          <AppShell>{children}</AppShell>
        </OptionalClerkProvider>
      </body>
    </html>
  );
}
