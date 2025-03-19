// components/Footer.tsx
import Image from 'next/image'; // Import Next.js image component

const Footer = () => {
  return (
    <footer className="  py-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <Image
            src="/icons/logo.webp" // Path to your logo image
            alt="Your Logo"
            width={25} // Customize based on your logo's size
            height={25} // Customize based on your logo's size
          />
          <p className="text-sm text-black">nextcommerce</p>
        </div>

        {/* Copyright Text */}
        <p className="text-xs text-black">
          &copy; worldhello {new Date().getFullYear()}. all rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
