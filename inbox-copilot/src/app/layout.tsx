import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inbox Copilot",
  description: "Draft Gmail replies in your voice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gradient-to-b from-white to-slate-50 text-slate-900`}>
        <div className="border-b bg-white/70 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="font-semibold">Inbox Copilot</Link>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/settings" className="hover:underline">Settings</Link>
            </div>
          </nav>
        </div>
        <div className="min-h-[calc(100vh-57px)]">{children}</div>
        <footer className="border-t bg-white/50">
          <div className="mx-auto max-w-6xl p-4 text-xs text-slate-500">© Inbox Copilot</div>
        </footer>
      </body>
    </html>
  );
}
