// src/app/store/layout.tsx
import type { Metadata } from 'next';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '../../components/header';
import { SanityLive } from '@/sanity/lib/live';

export const metadata: Metadata = {
  title: 'basket',
  description: 'basket page layout',
};

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <main>
        <Header />
        {children} {/* Render the page content here */}
      </main>

      <SanityLive />
    </ClerkProvider>
  );
}
