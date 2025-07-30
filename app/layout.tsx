import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Where Can I Watch - Find Your Favorite Movies & TV Shows",
  description: "Instantly discover where to stream any movie or TV show across all major platforms. Never miss your favorite content again.",
  keywords: "streaming, movies, tv shows, where to watch, netflix, hulu, disney plus, amazon prime",
  openGraph: {
    title: "Where Can I Watch",
    description: "Find where to stream any movie or TV show",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
                  <main className="flex-1 pb-ios-3xl" style={{ paddingTop: 'var(--ios-safe-padding-top)', paddingLeft: 'var(--ios-safe-padding-x)', paddingRight: 'var(--ios-safe-padding-x)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
