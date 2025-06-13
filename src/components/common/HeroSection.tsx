'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

/**
 * HeroSection component
 * This section appears as the first visual element on the landing page.
 * It contains a headline, a brief description, and a call-to-action button.
 * The button is fixed to the bottom of the screen and changes appearance/text when the user scrolls.
 */
const HeroSection: FC = () => {
  // Track whether the page has been scrolled to adjust button styling
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    /**
     * Hero section container
     * Positioned absolutely near the bottom of the viewport, centered horizontally.
     * Uses Tailwind utility classes to ensure responsive spacing and layout.
     */
    <section className="absolute bottom-10 left-0 right-0 flex justify-center z-10 text-white text-center pb-10">
      {/* Wrapper for text content: Max width ensures it doesn't stretch too wide on large screens */}
      <div className="max-w-3xl">
        {/* Subheading: A brief description below the headline */}
        <p className="uppercase barlow-condensed-regular tracking-very-wide text-xl sm:text-xl md:text-2xl font-semibold text-center text-white mb-6">
          light up the sky!
        </p>
        {/* Call to Action Button: 
            - Fixed at the bottom center of the screen
            - Changes background color and text when the page is scrolled */}
        <Link
          href="/search?q=*"
          className={`fixed bottom-10 border-none left-1/2 transform -translate-x-1/2 p-4 block border transition-all uppercase text-xs  font-light text-center  ${
            scrolled
              ? 'bg-flag-blue text-white hover:bg-blue-600'
              : 'bg-white text-gray-800 hover:bg-gray-200'
          }`}
          aria-label="Start shopping"
        >
          {scrolled ? 'Start shopping' : 'Start shopping'}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
