// src/app/studio/layout.tsx

import type { Metadata } from 'next';
import '../../globals.css';

/**
 * 🧠 StudioLayout
 *
 * Layout wrapper for the `/studio` route — typically used to embed Sanity Studio
 * inside your Next.js app when self-hosting Studio as a route.
 *
 * Responsibilities:
 * - Applies global styles via `globals.css`.
 * - Wraps Sanity Studio content in a `<main>` tag.
 *
 * Metadata:
 * - Sets the default `title` and `description` for the Studio route.
 *   (Note: This is usually not critical since Studio may override it.)
 */

export const metadata: Metadata = {
  title: 'Studio Layout',
  description: 'Studio page layout',
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      {children} {/* Render Sanity Studio here */}
    </main>
  );
}
