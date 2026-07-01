import type { Metadata } from "next";
import { Kalam, Nunito } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { OptionalClerkProvider } from "@/components/optional-clerk-provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

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
    <html lang="en" className={`${nunito.variable} ${kalam.variable}`}>
      <body>
        <OptionalClerkProvider>
          <AppShell>{children}</AppShell>
        </OptionalClerkProvider>
      </body>
    </html>
  );
}
