// components/HeroSection.tsx

import Link from 'next/link';
import { FC } from 'react';

const HeroSection: FC = () => {
  return (
    <section className="absolute inset-0 flex items-center justify-center z-10 text-white text-center px-6 sm:px-12">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Inventory Available Now
        </h1>
        <p className="text-lg sm:text-xl font-medium">
          Explore Reduced Pricing and Get the Best Deals!
        </p>

        {/* Call-to-action Button */}
        <Link
          href="/inventory"
          className="inline-block mt-4 px-6 py-3 bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300"
        >
          View Inventory
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
