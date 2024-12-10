'use client';
import { ClerkLoaded, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Form from 'next/form';
import { PackageIcon, TrolleyIcon } from '@sanity/icons';
import useBasketStore from '../../store/store';

export default function Header() {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error('Error', JSON.stringify(err, null, 2));
    }
  };
  return (
    <header className="flex flex-wrap justify-between items-center px-4 py-2">
      <div className="flex w-full flex-wrap justify-between items-center">
        <Link
          href="/"
          className="font-bold hover:opacity-50 cursor-pointer mx-auto sm:mx-0"
        >
          nextcommerce
        </Link>
        <Form
          action="/search"
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0"
        >
          <input
            type="text"
            name="query"
            placeholder="search for products"
            className="bg-gray-100 text-gray-800 px-4 py-4 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 border w-full max-w-4xl"
          />
        </Form>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-1 md:flex-none">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-black hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
          >
            <TrolleyIcon className="w-5 h-5" />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
          </Link>

          {/* User Area */}
          <ClerkLoaded>
            {user && (
              <Link
                href="/orders"
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-black hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="w-5 h-5" />
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />

                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400 font-bold">{user.fullName}</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}

            {/* Passkey Area */}
            {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPasskey}
                className="bg-white hover:bg-opacity-90 hover:text-black animate-pulse text-black font-bold py-2 px-4 rounded border-black-300 border"
              >
                create passkey
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
}
