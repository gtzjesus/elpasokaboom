// components/HeroSection.tsx

// import Link from 'next/link';
import { FC } from 'react';

const HeroSection: FC = () => {
  return (
    <section className="absolute inset-0 flex items-center justify-center z-10 text-white text-center ">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          Nextcommerce
        </h1>
        <p className="text-sm sm:text-xl font-medium">
          nextjs | sanity | clerk | vercel | stripe
        </p>

        {/* Call-to-action Button */}
        {/* <Link
          href="/inventory"
          className="inline-block mt-4 px-6 py-3 bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300"
        >
          View Inventory
        </Link> */}
      </div>
    </section>
  );
};

export default HeroSection;
