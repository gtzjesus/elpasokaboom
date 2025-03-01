import Link from 'next/link'; // Import the Link component
import Image from 'next/image'; // Import the Image component for optimized images
import BlackFridayBanner from '@/components/BlackFridayBanner';
import VideoBackground from '@/components/VideoBackground';
import Header from '@/components/header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { client } from '@/sanity/lib/client';

// Define the category structure
interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image?: { asset: { url: string } };
}

// Enabling static generation and setting revalidation interval
export const dynamic = 'force-static';
export const revalidate = 60;

async function Home() {
  // Fetching categories data
  const categories: Category[] = await client.fetch('*[_type == "category"]');
  console.log('Categories fetched:', categories);

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
        {/* Displaying categories */}
        <div className="w-full max-w-7xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Our Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug.current}`}
              >
                {/* Now Link directly wraps the content */}
                <div className="flex flex-col items-center bg-white shadow-lg p-4 rounded-lg">
                  {/* Use next/image for optimized images */}
                  <Image
                    src={category.image?.asset?.url || '/default-image.jpg'} // Fallback if no image
                    alt={category.title}
                    width={96} // You can change this based on your layout
                    height={96} // You can change this based on your layout
                    className="object-cover rounded-full mb-4"
                    priority={true} // Use priority for important images to load faster (like hero images)
                  />
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
