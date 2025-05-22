'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ADMIN_EMAILS = ['gtz.jesus@outlook.com'];

const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Not signed in: wait for modal to be used
    if (!isSignedIn) return;

    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email || !ADMIN_EMAILS.includes(email)) {
      router.push('/'); // Redirect if signed in but not admin
    } else {
      setIsAuthorized(true); // Signed in and admin
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading or nothing until ready
  if (!isLoaded || isAuthorized === null) {
    return (
      <div>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button>admin sign in</button>
          </SignInButton>
        ) : null}
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default AdminGuard;
