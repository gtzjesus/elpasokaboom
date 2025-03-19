import { client } from '@/sanity/lib/client';
import VideoBackground from '@/components/common/VideoBackground';
import HeroSection from '@/components/common/HeroSection';
import BlackFridayBanner from '@/components/common/BlackFridayBanner';
import Footer from '@/components/common/Footer';
import Categories from '@/components/categories/Categories';
import { Category } from '@/types';
import Header from '@/components/common/header';

const Home = async () => {
  // Fetch categories from Sanity
  const categories: Category[] = await client.fetch('*[_type == "category"]');

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
      {/* Main Categories Area - Use the Categories Component */}
      <Categories categories={categories} />
      <Footer />
    </div>
  );
};

export default Home;
