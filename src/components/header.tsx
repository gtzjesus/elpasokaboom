'use client'; // This is necessary to mark the component as client-side

import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs'; // Import from nextjs
import Link from 'next/link';
import { PackageIcon } from '@sanity/icons';
import useBasketStore from '../../store/store';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Use from next/navigation
import Image from 'next/image';

const CartButton = ({ itemCount }: { itemCount: number }) => (
  <Link
    href="/basket"
    className="relative flex justify-center items-center space-x-2 font-bold py-2 px-4 rounded"
  >
    <Image
      src="/icons/bag.webp" // Path to your image
      alt="Bag"
      width={30} // Image width (adjust as needed)
      height={30} // Image height (adjust as needed)
      className="w-6 h-6" // Image size
    />

    {itemCount > 0 && (
      <span className="absolute -top--0 -right-0.5 bg-custom-gray text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold transition-all duration-200 ease-in-out">
        {itemCount}
      </span>
    )}
  </Link>
);

const AuthButtons = ({
  user,
  createClerkPasskey,
}: {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  user: any; // Type should be `any` since `useUser()` returns a user object which can be null
  createClerkPasskey: () => void;
}) => (
  <>
    <ClerkLoaded>
      {user ? (
        <>
          <Link
            href="/orders"
            className="flex items-center space-x-2 bg-black hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
          >
            <PackageIcon className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <UserButton />
            <div className="hidden sm:block text-xs">
              <p className="text-gray-400 font-bold">{user.fullName}</p>
            </div>
          </div>
        </>
      ) : (
        <SignInButton mode="modal" />
      )}
      {user?.passkeys.length === 0 && (
        <button
          onClick={createClerkPasskey}
          className="bg-white hover:bg-opacity-90 hover:text-black animate-pulse text-black font-bold py-2 px-4 rounded border-black-300 border"
        >
          create passkey
        </button>
      )}
    </ClerkLoaded>
  </>
);

const Header = () => {
  const { user } = useUser(); // Hook from Clerk for getting the user info
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter(); // Hook for route handling
  const pathname = usePathname(); // Hook for pathname

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error('Error', JSON.stringify(err, null, 2));
    }
  };

  // Close the menu when the pathname (route) changes
  useEffect(() => {
    setIsMenuOpen(false); // Close the menu whenever the route changes
  }, [pathname]); // Listen to changes in pathname (route change)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new FormData(e.target as HTMLFormElement).get(
      'query'
    ) as string; // Get the search query from form input
    setIsMenuOpen(false); // Close the menu on submit
    router.push(`/search?query=${query}`); // Navigate to the search page with the query parameter

    // Manually blur the input to close the keyboard (mobile)
    const inputElement = document.querySelector('input[name="query"]');
    if (inputElement instanceof HTMLElement) {
      inputElement.blur(); // Close the mobile keyboard
    }
  };

  if (!isMounted) return null;

  return (
    <header className="flex flex-wrap justify-between items-center px-8 py-4 relative">
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href="/"
          className="font-bold hover:opacity-50 cursor-pointer sm:mx-0"
        >
          <Image
            src="/icons/logo.webp" // Path to your image
            alt="Nextcommerce"
            width={30} // Image width (adjust as needed)
            height={30} // Image height (adjust as needed)
            className="w-8 h-8" // Image size
          />
        </Link>

        <div className="flex items-center space-x-4  sm:mt-0">
          {/* Menu Button for Mobile */}
          {/* Cart Button next to Menu */}
          <CartButton itemCount={itemCount} />
          <button
            onClick={toggleMenu}
            className="sm:hidden flex items-center space-x-2 text-black font-bold"
          >
            <Image
              src="/icons/menu.webp" // Path to your image
              alt="Menu"
              width={30} // Image width (adjust as needed)
              height={30} // Image height (adjust as needed)
              className="w-6 h-6" // Image size
            />
          </button>
        </div>
      </div>

      {/* Backdrop (Mobile) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      />

      {/* Sliding Menu (Mobile) */}
      <div
        className={`fixed right-0 top-0 h-full w-full bg-white shadow-xl z-20 transform transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-3 right-7 text-3xl text-gray-600"
        >
          &times;
        </button>
        <div className="flex flex-col space-y-6 p-12">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center px-4 py-4 rounded">
              <Image
                src="/icons/search.webp" // Path to your image
                alt="Search"
                width={25} // Image width (adjust as needed)
                height={25} // Image height (adjust as needed)
                className="mr-2" // Add margin to the right of the image
              />
              <input
                type="search"
                name="query"
                placeholder="Search"
                className="w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-gray-500 placeholder:text-lg appearance-none"
              />
            </div>
          </form>

          <CartButton itemCount={itemCount} />
          <AuthButtons user={user} createClerkPasskey={createClerkPasskey} />
        </div>
      </div>
    </header>
  );
};

export default Header;
