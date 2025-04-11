'use client';

import Link from 'next/link';

/**
 * EmptyBasket Component
 *
 * Displays a user-friendly message when the shopping basket is empty.
 */
const EmptyBasket = () => {
  return (
    <div className="container mx-auto p-6 min-h-[100vh] bg-white">
      <p className="uppercase text-sm font-light text-center p-5 text-gray-800">
        Your basket is empty.
      </p>
      <Link
        href="/search?q=*"
        className="block bg-white border py-3 mt-4 text-xs font-light text-center text-gray-800 uppercase"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyBasket;
