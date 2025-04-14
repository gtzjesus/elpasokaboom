'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

const HeroSection: FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="absolute bottom-10 left-0 right-0 flex justify-center z-10 text-white text-center pb-10">
      <div className="max-w-3xl">
        <p className="barlow-condensed-regular tracking-very-wide text-lg sm:text-xl md:text-2xl font-semibold text-center text-white mb-6">
          Built with precision.
        </p>

        {/* Scroll-reactive button */}
        <Link
          href="/search?q=*"
          className={`fixed bottom-10 border-none left-1/2 transform -translate-x-1/2 p-4 block border transition-all uppercase text-xs font-light text-center  ${
            scrolled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white text-gray-800 hover:bg-gray-200'
          }`}
          aria-label="Start shopping 3D prints"
        >
          {scrolled ? 'Start shopping 3D' : 'Start shopping 3D'}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
