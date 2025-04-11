'use client';
import { useEffect, useRef } from 'react';
import { urlFor } from '@/sanity/lib/image'; // Utility to fetch image URLs from Sanity
import Image from 'next/image'; // Next.js image component for optimized image loading
import Link from 'next/link'; // Next.js link component for client-side navigation
import useBasketStore from 'store/store'; // Custom hook to manage the basket state

interface CartPopupProps {
  onClose: () => void; // Function to handle closing the popup
}

const CartPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  // Get the grouped items in the cart from the global state/store
  const cartItems = useBasketStore((state) => state.getGroupedItems());

  // Flag to check if there are items in the cart
  const hasItems = cartItems.length > 0;

  // Create a ref to attach to the popup container to detect clicks outside
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle click events outside the popup
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close the popup if the click is outside
      }
    };

    // Add event listener on mount to detect mouse clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-12 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-[9999]">
      <div
        ref={popupRef}
        className="bg-white mt-1 p-4 w-full h-[75vh] max-w-[325px] lg:h-[95vh] lg:max-w-[525px] overflow-hidden relative flex flex-col"
      >
        {/* Conditionally Render Cart Items or Empty Message */}
        {hasItems ? (
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Header Section */}
            <div className="border-b mb-4">
              {/* Close Button */}
              <button
                className="absolute top-2 right-6 text-xl hover:text-gray-900 transition"
                onClick={onClose} // Trigger close function on click
              >
                &times;
              </button>
              {/* Title */}
              <h2 className="uppercase text-sm font-light text-center text-gray-800 mb-2">
                Added to shopping bag
              </h2>
            </div>
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between mb-5 pb-3"
              >
                {/* Product Image with Link to Product Page */}
                <div className="mt-2 flex-shrink-0">
                  <Link href={`/product/${item.product.slug?.current || ''}`}>
                    <Image
                      src={
                        item.product.image
                          ? urlFor(item.product.image).url()
                          : '/fallback-image.jpg'
                      }
                      alt={item.product.name || 'Product'}
                      width={110}
                      height={110}
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1 ml-7 space-y-2">
                  <p className="uppercase text-sm font-semibold text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-xs font-light text-gray-800">
                    ${((item.product.price || 0) * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Close Button */}
            <button
              className="absolute top-2 right-6 text-xl hover:text-gray-900 transition"
              onClick={onClose} // Trigger close function on click
            >
              &times;
            </button>
            <p className="uppercase text-sm border-b mb-2 pb-2 font-light text-center text-gray-800">
              Shopping bag is empty
            </p>
          </div>
        )}

        {/* Conditionally Render the Button */}
        <Link
          href={hasItems ? '/basket' : '/search?q=*'} // Redirect to search page with a query to show all products
          className="block bg-white border py-3 mt-4 transition-all uppercase text-xs font-light text-center text-gray-800"
          onClick={onClose} // Close the popup when clicked
        >
          {hasItems ? 'View shopping bag' : 'Start shopping'}{' '}
          {/* Button Text */}
        </Link>
      </div>
    </div>
  );
};

export default CartPopup;
