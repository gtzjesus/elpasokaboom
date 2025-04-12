// components/Footer.tsx

import Image from 'next/image';

/**
 * Footer component displays the site’s branding and copyright info.
 *
 * @component
 * @example
 * <Footer />
 */
const Footer: React.FC = () => {
  return (
    <footer className="pt-6 bg-white">
      <div className="max-w-7xl mx-auto text-center py-4 px-4">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Image
            src="/icons/logo.webp"
            alt="WorldHello logo"
            width={30}
            height={30}
            priority
          />
        </div>

        {/* Copyright */}
        <p className="barlow-condensed-regular text-xs tracking-very-wide font-light text-gray-700">
          &copy; WorldHello {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
