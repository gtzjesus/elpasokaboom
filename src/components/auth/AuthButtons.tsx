// components/AuthButtons.tsx

import { ClerkLoaded, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import type { UserResource } from '@clerk/types';

/**
 * Props for the AuthButtons component.
 */
interface AuthButtonsProps {
  /**
   * The authenticated user object from Clerk. If undefined or null, the user is not signed in.
   */
  user: UserResource | null;
}

/**
 * AuthButtons component conditionally renders authentication-related UI.
 * - When the user is signed in, shows the Orders link and UserButton.
 * - When signed out, displays a SignIn button.
 *
 * @component
 * @example
 * <AuthButtons user={user} />
 */
const AuthButtons = ({ user }: AuthButtonsProps) => (
  <ClerkLoaded>
    {user ? (
      <>
        <Link
          href="/orders"
          className="flex items-center space-x-2 opacity-70 text-black font-bold py-2 px-4 rounded lowercase"
        >
          <span>orders</span>
        </Link>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <UserButton />
            {/* Optional status indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white" />
          </div>
          <div className="hidden sm:block text-xs">
            <p className="text-gray-400 font-bold lowercase">{user.fullName}</p>
          </div>
        </div>
      </>
    ) : (
      <div className="opacity-60 lowercase">
        <SignInButton mode="modal" />
      </div>
    )}
  </ClerkLoaded>
);

export default AuthButtons;
