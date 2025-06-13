// app/(store)/page.tsx

import { client } from '@/sanity/lib/client';
import VideoBackground from '@/components/common/VideoBackground';
import HeroSection from '@/components/common/HeroSection';
import BlackFridayBanner from '@/components/common/BlackFridayBanner';
import Footer from '@/components/common/Footer';
import Categories from '@/components/categories/Categories';
import Header from '@/components/common/header';
import { Category } from '@/types';
import Script from 'next/script';

/**
 * Home Component
 *
 * This is the main landing page of the store. It is designed to showcase key visual elements,
 * highlight promotional content, and provide navigation to product categories.
 *
 * Data Fetching:
 * - Retrieves product categories from the Sanity CMS.
 *
 * Components Rendered:
 * - `Header`: Top navigation bar for site-wide links and branding.
 * - `VideoBackground`: Fullscreen background video used as a dynamic hero background.
 * - `HeroSection`: Overlays promotional text on top of the background video.
 * - `BlackFridayBanner`: Optional promotional banner (e.g. for seasonal sales).
 * - `Categories`: Displays available product categories fetched from Sanity.
 * - `Footer`: Persistent footer with site-wide information or navigation.
 *
 * @returns {JSX.Element} The complete home page layout with all major sections.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ElPasoKaBoom - Fireworks & Party Supplies',
  description:
    'Shop the best fireworks, party supplies, and more. Safe and explosive fun delivered fast!',
  keywords: [
    'fireworks',
    'party supplies',
    'explosives',
    'ElPasoKaBoom',
    'pyrotechnics',
  ],
  authors: [{ name: 'ElPasoKaBoom', url: 'https://elpasokaboom.com' }],
  openGraph: {
    title: 'ElPasoKaBoom - Fireworks & Party Supplies',
    description:
      'Shop the best fireworks, party supplies, and more. Safe and explosive fun delivered fast!',
    url: 'https://elpasokaboom.com',
    siteName: 'ElPasoKaBoom',
    type: 'website',
    images: [
      {
        url: '/images/elpaso.webp',
        width: 1200,
        height: 630,
        alt: 'ElPasoKaBoom logo and fireworks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElPasoKaBoom - Fireworks & Party Supplies',
    description:
      'Shop the best fireworks, party supplies, and more. Safe and explosive fun delivered fast!',
    images: ['/images/elpaso.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://elpasokaboom.com',
  },
};

const Home = async () => {
  const categories: Category[] = await client.fetch('*[_type == "category"]');

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: categories.map((cat, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cat.title,
      url: `https://elpasokaboom.com/categories/${cat.slug.current}`,
    })),
  };

  return (
    <div>
      <Header />
      <VideoBackground />
      <HeroSection />
      <BlackFridayBanner />
      <Categories categories={categories} />
      <Footer />

      <Script
        id="category-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        strategy="afterInteractive"
      />
    </div>
  );
};

export default Home;
