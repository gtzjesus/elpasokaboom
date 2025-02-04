'use client'; // This is necessary to mark the component as client-side

import {
  ClerkLoaded,
  SignInButton,
  UserButton,
  useUser,
  ClerkUser,
} from '@clerk/nextjs';
import Link from 'next/link';
import { PackageIcon, TrolleyIcon } from '@sanity/icons';
import useBasketStore from '../../store/store';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Use from next/navigation

const CartButton = ({ itemCount }: { itemCount: number }) => (
  <Link
    href="/basket"
    className="relative flex justify-center items-center space-x-2 bg-black hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
  >
    <TrolleyIcon className="w-5 h-5" />
    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
      {itemCount}
    </span>
  </Link>
);

const AuthButtons = ({
  user,
  createClerkPasskey,
}: {
  user: ClerkUser | null; // Explicit type for user
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
  const { user } = useUser(); // Type is inferred from the useUser hook
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter(); // Hook from next/navigation to handle routing
  const pathname = usePathname(); // To track path changes

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
  };

  if (!isMounted) return null;

  return (
    <header className="flex flex-wrap justify-between items-center px-8 py-4 relative">
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href="/"
          className="font-bold hover:opacity-50 cursor-pointer sm:mx-0"
        >
          Nextcommerce
        </Link>

        <button
          onClick={toggleMenu}
          className="sm:hidden flex items-center space-x-2 text-black font-bold"
        >
          Menu
        </button>

        <div className="hidden sm:flex items-center space-x-4 mt-4 sm:mt-0 flex-1 md:flex-none">
          <CartButton itemCount={itemCount} />
          <AuthButtons user={user} createClerkPasskey={createClerkPasskey} />
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
            <input
              type="text"
              name="query"
              placeholder="Search"
              className="bg-gray-100 text-gray-800 px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 border w-full"
            />
          </form>

          <CartButton itemCount={itemCount} />
          <AuthButtons user={user} createClerkPasskey={createClerkPasskey} />
        </div>
      </div>
    </header>
  );
};

export default Header;
