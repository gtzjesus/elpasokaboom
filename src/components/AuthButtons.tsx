// components/AuthButtons.tsx

import { ClerkLoaded, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

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

export default AuthButtons;
