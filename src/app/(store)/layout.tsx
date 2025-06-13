// src/app/store/layout.tsx

import type { Metadata } from 'next';
import '../globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { draftMode } from 'next/headers';
import { DisableDraftMode } from '@/components/auth/DisableDraftMode';
import { VisualEditing } from 'next-sanity';
import { SanityLive } from '@/sanity/lib/live';

/**
 * 📦 Store Layout
 *
 * Layout wrapper for all routes under `/store`.
 * Sets up shared context providers and tools used across the storefront pages.
 *
 * Providers:
 * - `ClerkProvider`: Handles authentication and session context from Clerk.
 * - `SanityLive`: Enables live-editing capabilities from Sanity Studio.
 * - `VisualEditing`: Allows Sanity Studio users to visually edit content when in draft mode.
 * - `DisableDraftMode`: UI control to disable draft mode from the frontend.
 *
 * Features:
 * - Dynamically checks if draft mode is active and conditionally renders visual editing tools.
 * - Wraps all content in a `<main>` tag for semantic structure and styling control.
 *
 * Metadata:
 * - Default metadata set for the basket/store layout. Can be overridden per page.
 */

export const metadata: Metadata = {
  title: 'ElPasoKaBoom | Buy Fireworks Online in El Paso, TX',
  description:
    'ElPasoKaBoom is your go-to online fireworks store in El Paso, Texas. Shop safe, legal fireworks with fast pickup and unforgettable celebrations.',
  keywords: [
    'ElPasoKaBoom',
    'El Paso fireworks',
    'buy fireworks online',
    'Texas fireworks store',
    'Fourth of July El Paso',
    'El Paso party supplies',
    'legal fireworks El Paso',
  ],
  openGraph: {
    title: 'ElPasoKaBoom | Buy Fireworks Online in El Paso',
    description:
      'Shop fireworks in El Paso, TX from ElPasoKaBoom. Get ready for your next big celebration with top-tier pyrotechnics!',
    url: 'https://elpasokaboom.com',
    siteName: 'ElPasoKaBoom',
    images: [
      {
        url: '/images/elpaso.webp', // Use a real OG image here!
        width: 1200,
        height: 630,
        alt: 'ElPasoKaBoom Fireworks Store',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElPasoKaBoom | Buy Fireworks Online in El Paso',
    description:
      'Shop fireworks online in El Paso, TX. Safe, legal, and ready to party — only at ElPasoKaBoom!',
    images: ['/images/elpaso.webp'], // Same OG image
  },
};

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();

  return (
    <ClerkProvider dynamic>
      {isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}

      {/* Page content rendered inside main tag */}
      <main>{children}</main>

      {/* Enables live Sanity updates */}
      <SanityLive />
    </ClerkProvider>
  );
}
