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
  title: 'basket',
  description: 'basket page layout',
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
