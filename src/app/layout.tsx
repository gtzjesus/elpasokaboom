// app/layout.tsx

import React from 'react';
import type { Metadata } from 'next';
import './globals.css'; // ✅ critical for Tailwind to work

/**
 * App Metadata
 * Populates <head> and improves SEO/accessibility.
 */
export const metadata: Metadata = {
  title: {
    default: 'world hello',
    template: '%s | world hello',
  },
  description: 'A modern eCommerce experience built with Next.js and Sanity',
  authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
  metadataBase: new URL('https://your-domain.com'),
  robots: {
    index: true,
    follow: true,
  },
  // Remove themeColor from here
};

/**
 * Viewport Settings
 * Includes themeColor for mobile address bar customization.
 */
export const viewport = {
  themeColor: '#ffffff', // Set theme color for mobile browsers
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
  viewportFit: 'cover',
};

/**
 * RootLayout
 * Wraps the entire app, applies consistent <html> structure, sets language,
 * viewport settings, and global styles.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        {/* NOTE: <title> is controlled by `metadata` in Next.js 13+ */}
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-white text-black">{children}</body>
    </html>
  );
}
