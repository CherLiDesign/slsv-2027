import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { project } from "@/lib/catalog";
import { VersionProvider, VersionToggle } from "@/components/VersionContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: project.name,
  description: project.subtitle,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <VersionProvider>
        <header className="sticky top-0 z-20 border-b border-line bg-background/85 backdrop-blur">
          <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-4">
            <Link href="/" className="flex min-w-0 items-center gap-2 font-semibold tracking-tight">
              <span className="inline-block h-5 w-5 shrink-0 rounded-full bg-accent" />
              <span className="truncate">{project.name}</span>
            </Link>
            <VersionToggle />
            <span className="hidden justify-self-end text-sm text-muted lg:block">{project.event}</span>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        </VersionProvider>
      </body>
    </html>
  );
}
