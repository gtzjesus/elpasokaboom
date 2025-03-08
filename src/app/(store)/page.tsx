import { client } from '@/sanity/lib/client';
import VideoBackground from '@/components/VideoBackground';
import HeroSection from '@/components/HeroSection';
import BlackFridayBanner from '@/components/BlackFridayBanner';
import Footer from '@/components/Footer';
import Categories from '@/components/Categories';
import { Category } from '@/types';
import Header from '@/components/Header';

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
