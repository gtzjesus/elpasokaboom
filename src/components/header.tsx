'use client';

import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import useBasketStore from '../../store/store';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const CartButton = ({ itemCount }: { itemCount: number }) => (
  <Link
    href="/basket"
    className="relative flex justify-center items-center space-x-2 font-bold py-2 px-4 rounded"
  >
    <Image
      src="/icons/bag.webp"
      alt="Bag"
      width={50}
      height={50}
      className="w-6 h-6 opacity-70"
    />
    {itemCount > 0 && (
      <span className="absolute opacity-55 -top-0.5 bg-custom-gray text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold transition-all duration-200 ease-in-out">
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
  user: any;
  createClerkPasskey: () => void;
}) => (
  <>
    <ClerkLoaded>
      {user ? (
        <>
          {/* Orders Button */}
          <Link
            href="/orders"
            className="flex items-center space-x-2 opacity-60 text-black font-bold py-2 px-4 rounded"
          >
            <span>orders</span>
          </Link>

          {/* User Profile */}
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

      {/* Passkey Creation Button */}
      {user?.passkeys.length === 0 && (
        <button
          onClick={createClerkPasskey}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded border border-blue-600 transition duration-200 ease-in-out transform hover:scale-105"
        >
          passkey
        </button>
      )}
    </ClerkLoaded>
  </>
);

const Header = () => {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => setWindowWidth(window.innerWidth));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  useEffect(() => {
    // Close menu when resizing to desktop view
    if (windowWidth >= 648) {
      setIsMenuOpen(false);
    }
  }, [windowWidth]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error('Error', JSON.stringify(err, null, 2));
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const query = new FormData(form).get('query') as string;

    setIsMenuOpen(false);
    router.push(`/search?query=${query}`);

    const inputElement = form.querySelector(
      'input[name="query"]'
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.blur();
    }
  };

  if (!isMounted) return null;

  return (
    <header
      className={`${
        scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      } sticky top-0 z-10 transition-all duration-500 ease-in-out flex items-center px-3 py-3 relative`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side: Logo and Company Name */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Logo for Mobile */}
          <Link href="/" className="font-bold cursor-pointer sm:mx-0 sm:hidden">
            <Image
              src="/icons/logo.webp"
              alt="nextcommerce"
              width={30}
              height={30}
              className="w-8 h-8 opacity-70"
            />
          </Link>

          {/* Company Title for Desktop */}
          <div className="hidden sm:flex items-center space-x-2">
            <Image
              src="/icons/logo.webp"
              alt="nextcommerce"
              width={30}
              height={30}
              className=" opacity-70 "
            />
            <span className=" font-bold text-md opacity-70">nextcommerce</span>
          </div>

          {/* Search Bar for Desktop */}
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

        {/* Right side: Cart Button and Auth Buttons */}
        <div className="flex items-center ">
          <CartButton itemCount={itemCount} />
          <div className="hidden sm:flex items-center space-x-4">
            <AuthButtons user={user} createClerkPasskey={createClerkPasskey} />
          </div>
        </div>

        <button
          onClick={toggleMenu}
          className="sm:hidden flex flex-col justify-center items-center space-y-1 z-30 relative group"
        >
          <div
            className={`w-7 h-0.5 bg-black opacity-50 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}
          ></div>
          <div
            className={`w-7 h-0.5 bg-black opacity-50 transition-all duration-300 ease-in-out transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
          ></div>
        </button>
      </div>

      {/* Backdrop (Mobile) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      />

      {/* Sliding Menu (Mobile) */}
      <div
        className={`fixed right-0 top-0 h-full w-full bg-white shadow-xl z-20 transform transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-3 right-7 text-3xl text-gray-600"
        >
          {/* &times; */}
        </button>
        <div className="flex flex-col space-y-6 p-16">
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
                placeholder="search"
                className="w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-md appearance-none"
              />
            </div>
          </form>

          <AuthButtons user={user} createClerkPasskey={createClerkPasskey} />
        </div>
      </div>
    </header>
  );
};

export default Header;
