// components/Footer.tsx
import Image from 'next/image'; // Import Next.js image component

const Footer = () => {
  return (
    <footer className="pt-6">
      <div className="max-w-7xl mx-auto text-center py-2">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Image
            src="/icons/logo.webp" // Path to your logo image
            alt="Your Logo"
            width={30} // Customize based on your logo's size
            height={30} // Customize based on your logo's size
          />
        </div>

        {/* Copyright Text */}
        <p className="barlow-condensed-regular  text-xs tracking-very-wide font-light text-center">
          &copy; worldhello {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
