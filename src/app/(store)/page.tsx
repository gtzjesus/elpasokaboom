// pages/Home.tsx

// Importing utility functions for fetching data
import { getAllProducts } from '@/sanity/lib/products/getAllProducts';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';

// Importing components
import ProductsView from '@/components/ProductsView';
import BlackFridayBanner from '@/components/BlackFridayBanner';
import VideoBackground from '@/components/VideoBackground';
import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';

// Enabling static generation and setting revalidation interval
export const dynamic = 'force-static';
export const revalidate = 60;

async function Home() {
  // Fetching products and categories data
  const products = await getAllProducts();
  const categories = await getAllCategories();

  return (
    <div>
      {/* Header Nav */}
      <Header />
      {/* Background video + Hero Text */}
      <VideoBackground />
      {/* Hero Text Overlay */}
      <HeroSection />
      {/* Black Friday promotional banner */}
      <BlackFridayBanner />
      {/* Main content area */}
      <div className="flex flex-col items-center justify-top min-h-screen bg-pearl">
        {/* Displaying products and categories */}
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}

export default Home;
