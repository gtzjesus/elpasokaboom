// src/app/studio/layout.tsx
import type { Metadata } from 'next';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'Studio Layout',
  description: 'Studio page layout',
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>; // Just render the children content
}
