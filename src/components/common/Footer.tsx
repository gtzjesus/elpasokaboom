// components/Footer.tsx
import Image from 'next/image'; // Import Next.js image component

const Footer = () => {
  return (
    <footer className="  py-2">
      <div className="max-w-7xl mx-auto text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <Image
            src="/icons/logo.webp" // Path to your logo image
            alt="Your Logo"
            width={30} // Customize based on your logo's size
            height={30} // Customize based on your logo's size
          />
          <p className="barlow-condensed-regular  text-lg tracking-very-wide font-light text-center">
            Nextcommerce
          </p>
        </div>

        {/* Copyright Text */}
        <p className="barlow-condensed-regular  text-md tracking-very-wide font-light text-center">
          &copy; worldhello {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
