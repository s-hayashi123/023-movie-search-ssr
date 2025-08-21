import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "映画検索 - SaaS UI",
  description: "映画検索アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-app-bg text-app-fg`}
      >
        <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur sticky top-0 z-50 border-b">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-semibold text-primary">
              Movie Search
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted hover:text-primary transition"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm text-muted hover:text-primary transition"
              >
                Search
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
