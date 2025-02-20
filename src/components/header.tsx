'use client';

// Importing necessary components and hooks from the Clerk library for authentication and user management.
import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import useBasketStore from '../../store/store'; // Import custom store for basket items
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

// CartButton component displays the cart icon and the number of items in the basket
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
      src={scrolled ? '/icons/bag.webp' : '/icons/bag-white.webp'} // Change the image based on the scroll state
      alt="Bag"
      width={50}
      height={50}
      className="w-6 h-6"
    />
    {itemCount > 0 && (
      // Displays the item count as a small badge on the cart icon if there are items
      <span className="absolute opacity-75 -top-0.5 bg-custom-gray text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold transition-all duration-200 ease-in-out">
        {itemCount}
      </span>
    )}
  </Link>
);

// AuthButtons component handles user authentication states, showing different buttons based on whether the user is signed in or not
/* eslint-disable @typescript-eslint/no-explicit-any */
const AuthButtons = ({ user }: { user: any }) => (
  <ClerkLoaded>
    {user ? (
      <>
        {/* Link to user orders */}
        <Link
          href="/orders"
          className="flex items-center space-x-2 opacity-70 text-black font-bold py-2 px-4 rounded"
        >
          <span>orders</span>
        </Link>

        {/* User profile button */}
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
      // SignInButton renders if user is not logged in
      <div className="opacity-60">
        <SignInButton mode="modal" />
      </div>
    )}
  </ClerkLoaded>
);

const Header = () => {
  // Fetching user data from Clerk
  const { user } = useUser();

  // Basket item count calculation using custom store
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  // State management for various UI functionalities
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the visibility of the mobile menu
  const [isMounted, setIsMounted] = useState(false); // Ensures the code runs on the client-side
  const [scrolled, setScrolled] = useState(false); // Tracks the scroll position to apply different header styles
  const [windowWidth, setWindowWidth] = useState<number>(0); // Keeps track of window width for responsive design

  // Router and pathname hooks
  const router = useRouter();
  const pathname = usePathname();

  // Effect hook to ensure the component mounts on the client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect hook to manage scroll and window resize events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        // Add a shadow to header when scrolling past 50px
        setScrolled(window.scrollY > 50);
      };

      const handleResize = () => setWindowWidth(window.innerWidth); // Update window width on resize

      // Adding event listeners for scroll and resize
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      // Clean-up function for event listeners
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Close the menu when resizing to a desktop view (width >= 648px)
  useEffect(() => {
    if (windowWidth >= 648) {
      setIsMenuOpen(false);
    }
  }, [windowWidth]);

  // Toggle menu visibility (mobile view)
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Close the menu when pathname changes (navigation)
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Manage body overflow based on menu visibility to prevent scrolling when menu is open
  useEffect(() => {
    // Prevent scrolling when the menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // Disable scroll on <html> element
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto'; // Re-enable scroll on <html> element
    }

    // Cleanup the styles on component unmount
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isMenuOpen]); // Only run when menu state changes

  // Handle search submission by redirecting to the search page
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const query = new FormData(form).get('query') as string;

    setIsMenuOpen(false); // Close mobile menu after search
    router.push(`/search?query=${query}`);

    const inputElement = form.querySelector(
      'input[name="query"]'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.blur(); // Blur the input field after submitting
    }
  };

  // Prevent rendering until the component is fully mounted (client-side)
  if (!isMounted) return null;

  return (
    <header
      className={`${
        scrolled ? 'bg-pearl shadow-lg' : 'bg-transparent'
      } fixed top-0 z-20 transition-all duration-500 ease-in-out flex items-center px-3 py-3 w-full`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side: Logo and Company Name */}
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/" className="font-bold cursor-pointer sm:mx-0 sm:hidden">
            <Image
              // Conditionally switch logo based on scroll state
              src={scrolled ? '/icons/logo.webp' : '/icons/logo-white.webp'}
              alt="nextcommerce"
              width={30}
              height={30}
              className="w-8 h-8 "
            />
          </Link>

          <div className="hidden sm:flex items-center space-x-2">
            <Image
              // Default logo for larger screens
              src="/icons/logo.webp"
              alt="nextcommerce"
              width={30}
              height={30}
              className=""
            />
            <span className="font-bold text-md">nextcommerce</span>
          </div>

          {/* Search Bar: Visible on larger screens */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center w-1/2"
          >
            <div className="flex items-center px-4 py-2 rounded-lg bg-gray-50 w-full">
              <Image
                src="/icons/search.webp"
                alt="search"
                width={25}
                height={25}
                className="w-5 h-5 opacity-60 mr-2"
              />
              <input
                type="search"
                name="query"
                placeholder="search"
                className="w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-md appearance-none"
              />
            </div>
          </form>
        </div>

        {/* Right side: Cart and Auth Buttons */}
        <div className="flex items-center ">
          <CartButton itemCount={itemCount} scrolled={scrolled} />
          <div className="hidden sm:flex items-center space-x-4">
            <AuthButtons user={user} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden flex flex-col justify-center items-center space-y-1 z-30 relative group"
        >
          <div
            className={`w-7 h-0.5  ${
              scrolled ? 'bg-black text-white' : 'bg-white text-black'
            }  transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}
          ></div>
          <div
            className={`w-7 h-0.5 ${
              scrolled ? 'bg-black text-white' : 'bg-white text-black'
            } transition-all duration-300 ease-in-out transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          ></div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-full shadow-xl z-20 transform transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-3 right-7 text-3xl text-gray-600"
        />
        <div className="flex flex-col space-y-6 p-16">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center px-4 py-4 rounded-lg bg-gray-50">
              <Image
                src="/icons/search.webp"
                alt="search"
                width={25}
                height={25}
                className="w-5 h-5 opacity-60 mr-2"
              />
              <input
                type="search"
                name="query"
                placeholder="Search"
                className="w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-md appearance-none"
              />
            </div>
          </form>

          {/* Mobile Auth Buttons */}
          <AuthButtons user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
