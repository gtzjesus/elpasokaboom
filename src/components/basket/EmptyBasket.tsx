'use client';

import Link from 'next/link';

/**
 * EmptyBasket component displays a message and a call-to-action
 * when the user's shopping basket is empty.
 *
 * @component
 * @example
 * <EmptyBasket />
 */
const EmptyBasket: React.FC = () => {
  return (
    <div className="container mx-auto p-6 min-h-[100vh] bg-white flex flex-col items-center justify-center">
      <p className="uppercase text-sm font-light text-center text-gray-800 mb-4">
        Your basket is empty.
      </p>

      <Link
        href="/search?q=*"
        className="inline-block bg-white border py-3 px-6 text-xs font-light text-center text-gray-800 uppercase hover:bg-gray-50 transition"
        aria-label="Continue shopping"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyBasket;
