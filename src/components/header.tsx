'use client';

import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { PackageIcon } from '@sanity/icons';
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
      <span className="absolute opacity-55 -top-0.5 bg-custom-gray text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold transition-all duration-500 ease-in-out">
        {itemCount}
      </span>
    )}
  </Link>
);

const AuthButtons = ({
  user,
  createClerkPasskey,
}: {
  user: any;
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
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
      } sticky top-0 z-10 transition-all duration-500 ease-in-out flex flex-wrap justify-between items-center px-3 py-3 relative`}
    >
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href="/"
          className="font-bold hover:opacity-50 cursor-pointer sm:mx-0"
        >
          <Image
            src="/icons/logo.webp"
            alt="Nextcommerce"
            width={30}
            height={30}
            className="w-8 h-8 opacity-70"
          />
        </Link>

        {/* Search Bar for Desktop */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex items-center w-1/2"
        >
          <div className="flex items-center px-4 py-2 rounded-lg bg-gray-50  w-full">
            <Image
              src="/icons/search.webp"
              alt="Search"
              width={25}
              height={25}
              className="w-6 h-6 opacity-70 mr-2"
            />
            <input
              type="search"
              name="query"
              placeholder="Search"
              className="w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-lg appearance-none"
            />
          </div>
        </form>

        <div className="flex items-center space-x-2 sm:mt-0">
          <CartButton itemCount={itemCount} />

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
        <div className="flex flex-col space-y-6 p-12">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center px-4 py-4 rounded-lg bg-gray-100">
              <Image
                src="/icons/search.webp"
                alt="Search"
                width={25}
                height={25}
                className="mr-2"
              />
              <input
                type="search"
                name="query"
                placeholder="Search"
                className="w-full caret-blue-500 focus:outline-none bg-transparent placeholder:text-lg appearance-none"
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
