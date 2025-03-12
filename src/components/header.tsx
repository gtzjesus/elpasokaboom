'use client';

// Importing necessary components and hooks from the Clerk library for authentication and user management.
import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import useBasketStore from '../../store/store'; // Import custom store for basket items
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// CartButton component displays the cart icon and the number of items in the basket.
const CartButton = ({
  itemCount,
  scrolled,
}: {
  itemCount: number;
  scrolled: boolean;
}) => (
  <Link
    href="/basket"
    className="relative flex justify-center items-center space-x-2 font-bold py-2 px-4 rounded"
  >
    <Image
      src={scrolled ? '/icons/bag.webp' : '/icons/bag.webp'}
      alt="Bag"
      width={50}
      height={50}
      className="w-6 h-6"
    />
    {itemCount > 0 && (
      <span className="absolute opacity-75 -top-0.5 bg-custom-gray text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold">
        {itemCount}
      </span>
    )}
  </Link>
);

// AuthButtons component handles user authentication states, showing different buttons based on whether the user is signed in or not.
/* eslint-disable  @typescript-eslint/no-explicit-any */
const AuthButtons = ({ user }: { user: any }) => (
  <ClerkLoaded>
    {user ? (
      <>
        <Link
          href="/orders"
          className="flex items-center space-x-2 opacity-70 text-black font-bold py-2 px-4 rounded"
        >
          <span>orders</span>
        </Link>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <UserButton />
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
          </div>
          <div className="hidden sm:block text-xs">
            <p className="text-gray-400 font-bold">{user.fullName}</p>
          </div>
        </div>
      </>
    ) : (
      <div className="opacity-60">
        <SignInButton mode="modal" />
      </div>
    )}
  </ClerkLoaded>
);

const Header = () => {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  // States for managing various UI features
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const router = useRouter();
  const pathname = usePathname();

  // Client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll and resize event handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      const handleResize = () => setWindowWidth(window.innerWidth);

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Close menu on desktop or when pathname changes
  useEffect(() => {
    if (windowWidth >= 648) setIsMenuOpen(false);
  }, [windowWidth]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Disable body scrolling when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new FormData(e.target as HTMLFormElement).get(
      'query'
    ) as string;
    setIsMenuOpen(false);
    router.push(`/search?query=${query}`);
  };

  if (!isMounted) return null; // Prevent rendering on server-side

  return (
    <header
      className={`${scrolled ? 'bg-pearl shadow-lg' : 'bg-transparent'} fixed top-0 z-20 flex items-center px-3 py-3 w-full`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side: Logo and Company Name */}
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/" className="font-bold cursor-pointer sm:mx-0 sm:hidden">
            <Image
              src={scrolled ? '/icons/logo.webp' : '/icons/logo.webp'}
              alt="nextcommerce"
              width={30}
              height={30}
              className="w-8 h-8"
            />
          </Link>
          <div className="hidden sm:flex items-center space-x-2">
            <Image
              src={scrolled ? '/icons/logo.webp' : '/icons/logo.webp'}
              alt="nextcommerce"
              width={30}
              height={30}
              className=""
            />
            <span
              className={`barlow-condensed-regular text-md ${scrolled ? 'text-black' : 'text-black'}`}
            >
              Nextcommerce
            </span>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className={`hidden sm:flex items-center w-1/2 ${scrolled ? 'bg-white border border-gray-300 shadow-lg' : 'bg-transparent border-transparent'} px-4 py-2 rounded-lg`}
          >
            <div className="flex items-center w-full">
              <Image
                src={`${scrolled ? '/icons/search.webp' : '/icons/search-white.webp'}`}
                alt="search"
                width={30}
                height={30}
                className="w-5 h-5 opacity-60 mr-2"
              />
              <input
                type="search"
                name="query"
                placeholder="Search"
                className={`w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-md appearance-none ${scrolled ? 'text-black' : 'text-white'}`}
              />
            </div>
          </form>
        </div>

        {/* Right side: Cart and Auth Buttons */}
        <div className="flex items-center">
          <CartButton itemCount={itemCount} scrolled={scrolled} />
          <div
            className={`hidden sm:flex items-center space-x-4 ${scrolled ? 'text-black' : 'text-white'}`}
          >
            <AuthButtons user={user} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden flex flex-col justify-center items-center space-y-1 z-30 relative group"
        >
          <div
            className={`w-7 h-0.5 ${scrolled ? 'bg-black' : 'bg-black'} transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}
          />
          <div
            className={`w-7 h-0.5 ${scrolled ? 'bg-black' : 'bg-black'} transition-all duration-300 ease-in-out transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-90 z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-full shadow-xl z-20 transform transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-3.5 right-12 text-lg text-white"
        >
          {isMenuOpen ? 'close' : <span className="text-white"></span>}
        </button>
        <div className="flex flex-col items-center justify-center h-full p-16 space-y-6">
          <div className="flex flex-col items-center space-y-4 text-white text-2xl">
            <AuthButtons user={user} />
          </div>
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center border-b-2 border-gray-300 px-4 py-2">
              <input
                type="search"
                name="query"
                placeholder="Search"
                className="w-full text-white focus:outline-none bg-transparent placeholder:text-md"
              />
              <Image
                src="/icons/search-white.webp"
                alt="search"
                width={30}
                height={30}
                className="w-5 h-5 opacity-90 ml-2"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
