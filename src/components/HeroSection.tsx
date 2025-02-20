// components/HeroSection.tsx
import { FC } from 'react';

/**
 * HeroSection component
 * This is the section that appears as the first visual element on the landing page.
 * It typically contains a headline, a brief description, and any other introductory content.
 *
 * It is positioned absolutely at the top of the screen with a centered text content
 * that overlays on top of the background video or image.
 */
const HeroSection: FC = () => {
  return (
    /**
     * Hero section container: Positioned absolutely to fill the entire screen (inset-0)
     * The flexbox utility is used to center the content both vertically and horizontally.
     * The z-10 class ensures it appears above other elements like background videos or images.
     */
    <section className="absolute inset-0 flex items-center justify-center z-10 text-white text-center">
      {/* Wrapper for text content: Max width of 3xl ensures it doesn't stretch too wide on large screens */}
      <div className="space-y-4 max-w-3xl">
        {/* Headline: Large, bold, and prominent */}
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          Nextcommerce
        </h1>

        {/* Subheading: Smaller font for technology stack or description */}
        <p className="text-sm sm:text-xl font-medium">
          nextjs | sanity | clerk | vercel | stripe
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
