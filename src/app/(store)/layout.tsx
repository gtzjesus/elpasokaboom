// src/app/store/layout.tsx
import type { Metadata } from 'next';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { SanityLive } from '@/sanity/lib/live';
import { draftMode } from 'next/headers';
import { DisableDraftMode } from '@/components/DisableDraftMode';
import { VisualEditing } from 'next-sanity';

export const metadata: Metadata = {
  title: 'basket',
  description: 'basket page layout',
};

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <main>
        {children} {/* Render the page content here */}
      </main>

      <SanityLive />
    </ClerkProvider>
  );
}
