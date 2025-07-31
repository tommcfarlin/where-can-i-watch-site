import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Where Can I Watch?',
  description: 'Find where to stream your favorite movies and TV shows',
  keywords: ['streaming', 'movies', 'tv shows', 'watch', 'netflix', 'hulu', 'disney+'],
  authors: [{ name: 'Tom McFarlin' }],
  creator: 'Tom McFarlin',
  publisher: 'Where Can I Watch',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://where-can-i-watch.vercel.app/',
    title: 'Where Can I Watch?',
    description: 'Find where to stream your favorite movies and TV shows',
    siteName: 'Where Can I Watch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Where Can I Watch?',
    description: 'Find where to stream your favorite movies and TV shows',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Performance and iOS optimization */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Where Can I Watch?" />

        {/* Performance hints */}
        <link rel="dns-prefetch" href="//image.tmdb.org" />
        <link rel="dns-prefetch" href="//api.themoviedb.org" />
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.themoviedb.org" crossOrigin="anonymous" />

        {/* Font optimization */}
        <link rel="preload" href="/fonts/sf-pro.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-ios-system-background text-ios-label antialiased`}
        style={{
          paddingLeft: 'var(--ios-safe-padding-x)',
          paddingRight: 'var(--ios-safe-padding-x)'
        }}
      >
        <main className="flex-1 pb-ios-3xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
