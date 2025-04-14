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
    <div className="container mx-auto min-h-[50vh] bg-white flex flex-col items-center justify-center">
      <p className="uppercase text-xs font-light text-center text-gray-800 mb-4">
        Your basket is empty.
      </p>

      <Link
        href="/search?q=*"
        className="inline-block border-none bg-black  p-4 text-xs font-light text-center text-white uppercase "
        aria-label="Continue shopping"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyBasket;
