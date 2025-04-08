// components/HeroSection.tsx
import Link from 'next/link';
import { FC } from 'react';

/**
 * HeroSection component
 * This is the section that appears as the first visual element on the landing page.
 * It typically contains a headline, a brief description, and any other introductory content.
 *
 * It is positioned fixed at the bottom of the screen with a centered text content
 * that overlays on top of the background video or image.
 */
const HeroSection: FC = () => {
  return (
    /**
     * Hero section container: Positioned fixed to the bottom of the screen
     * The flexbox utility is used to center the content horizontally and align it to the bottom.
     * The z-10 class ensures it appears above other elements like background videos or images.
     */
    <section className="absolute bottom-0 left-0 right-0 flex justify-center z-10 text-white text-center pb-10">
      {/* Wrapper for text content: Max width of 3xl ensures it doesn't stretch too wide on large screens */}
      <div className="max-w-3xl">
        {/* Headline: Large, bold, and prominent */}
        <h1 className="uppercase text-3xl tracking-wide font-semibold text-white ">
          3D Prints
        </h1>

        {/* Subheading: Smaller font for technology stack or description */}
        <p className="barlow-condensed-regular tracking-very-wide text-lg font-semibold text-center text-white">
          Built with precision.
        </p>

        <Link
          href="/search?q=*" // Redirect to search page with a query to show all products
          className="block bg-white border py-3 mt-4 transition-all uppercase text-xs font-light text-center text-gray-800 rounded-lg"
        >
          start shopping 3d
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
