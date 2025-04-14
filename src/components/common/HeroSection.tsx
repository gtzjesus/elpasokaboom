'use client';

import Link from 'next/link';
import { FC } from 'react';

/**
 * HeroSection component
 * This section appears as the first visual element on the landing page.
 * It contains a headline, a brief description, and a call-to-action button.
 * Positioned fixed at the bottom of the screen with a centered text content.
 */
const HeroSection: FC = () => {
  return (
    /**
     * Hero section container: Positioned fixed to the bottom of the screen
     * The flexbox utility is used to center the content horizontally and align it to the bottom.
     * The z-10 class ensures it appears above other elements like background videos or images.
     */
    <section className="absolute bottom-0 left-0 right-0 flex justify-center z-10 text-white text-center pb-10 ">
      {/* Wrapper for text content: Max width of 3xl ensures it doesn't stretch too wide on large screens */}
      <div className="max-w-3xl">
        {/* Headline: Large, bold, and prominent */}
        {/* <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide font-semibold text-white">
          3D Prints
        </h1> */}

        {/* Subheading: Smaller font for technology stack or description */}
        {/* <p className="barlow-condensed-regular tracking-very-wide text-lg sm:text-xl md:text-2xl font-semibold text-center text-white mt-4">
          Built with precision.
        </p> */}

        {/* Call to Action Button */}
        <Link
          href="/search?q=*"
          className="p-4 block bg-white border py-3 mt-4 transition-all uppercase text-xs font-light text-center text-gray-800 rounded-lg hover:bg-gray-200"
          aria-label="Start shopping 3D prints"
        >
          Start shopping 3D
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
