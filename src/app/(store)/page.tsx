// app/(store)/page.tsx

import { client } from '@/sanity/lib/client';
import VideoBackground from '@/components/common/VideoBackground';
import HeroSection from '@/components/common/HeroSection';
import BlackFridayBanner from '@/components/common/BlackFridayBanner';
import Footer from '@/components/common/Footer';
import Categories from '@/components/categories/Categories';
import Header from '@/components/common/header';
import { Category } from '@/types';

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
const Home = async () => {
  // Fetch categories from Sanity
  const categories: Category[] = await client.fetch('*[_type == "category"]');

  return (
    <div>
      {/* Header Navigation */}
      <Header />

      {/* Background Video with Hero Text Overlay */}
      <VideoBackground />
      <HeroSection />

      {/* Promotional Banner */}
      <BlackFridayBanner />

      {/* Product Categories Grid */}
      <Categories categories={categories} />

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default Home;
