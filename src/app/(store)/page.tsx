import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/header';
import VideoBackground from '@/components/VideoBackground';
import HeroSection from '@/components/HeroSection';
import BlackFridayBanner from '@/components/BlackFridayBanner';

// Define the image type for Sanity
interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

const builder = imageUrlBuilder(client);

// Function to generate image URL
function urlFor(source: SanityImage) {
  return builder.image(source);
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image?: SanityImage; // Use the SanityImage type for image
}

const Home = async () => {
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
      {/* Main content area */}
      <div className="w-full max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug.current}`}
            >
              <div className="flex flex-col items-center bg-white shadow-lg p-4 rounded-lg">
                <Image
                  src={
                    category.image
                      ? urlFor(category.image).width(96).height(96).url()
                      : '/default-image.jpg'
                  }
                  alt={category.title}
                  width={96}
                  height={96}
                  className="object-cover rounded-full mb-4"
                  priority={true}
                />
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
