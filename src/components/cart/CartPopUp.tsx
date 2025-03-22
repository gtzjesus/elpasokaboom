// components/CartPopup.tsx

import { useEffect, useRef } from 'react';
import { urlFor } from '@/sanity/lib/image'; // Utility to fetch image URLs from Sanity
import Image from 'next/image'; // Next.js image component for optimized image loading
import Link from 'next/link'; // Next.js link component for client-side navigation
import useBasketStore from 'store/store'; // Custom hook to manage the basket state

interface CartPopupProps {
  onClose: () => void; // Function to handle closing the popup
}

/**
 * CartPopup component displays the shopping cart contents in a popup.
 * It shows product details, allows the user to navigate to the basket page, and closes when clicked outside.
 *
 * @param onClose - Function to close the popup when triggered.
 */
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
  }, [onClose]); // Dependency array ensures effect runs once on mount and when 'onClose' changes

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50">
      <div
        ref={popupRef} // Attach the ref to the popup container
        className="bg-white mt-0 p-4 w-full h-[90vh] max-w-[325px] overflow-hidden relative flex flex-col"
      >
        {/* Header Section */}
        <div className="border-b mb-4">
          {/* Close Button */}
          <button
            className="absolute top-2 right-6 text-xl hover:text-gray-900 transition"
            onClick={onClose} // Trigger close function on click
          >
            &times; {/* Close symbol */}
          </button>
          {/* Title */}
          <h2 className="uppercase text-sm font-light text-center text-gray-800 mb-2">
            Added to shopping bag
          </h2>
        </div>

        {/* Conditionally Render Cart Items or Empty Message */}
        {hasItems ? (
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {cartItems.map((item) => (
              <div
                key={item.product._id} // Use product ID as key for optimal rendering
                className="flex items-center justify-between mb-5 pb-3"
              >
                {/* Product Image with Link to Product Page */}
                <div className="mt-2 flex-shrink-0">
                  <Link
                    href={`/product/${item.product.slug?.current || ''}`} // Ensure valid slug for navigation
                  >
                    <Image
                      src={
                        item.product.image
                          ? urlFor(item.product.image).url() // Sanity image URL
                          : '/fallback-image.jpg' // Fallback image in case no product image
                      }
                      alt={item.product.name || 'Product'} // Alt text for accessibility
                      width={110} // Fixed width for image
                      height={110} // Fixed height for image
                      className="" // Image styling
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1 ml-6 space-y-2">
                  {/* Product Name */}
                  <p className="uppercase text-sm font-light text-gray-800">
                    {item.product.name}
                  </p>

                  {/* Price */}
                  <p className=" text-xs font-light text-gray-800">
                    ${((item.product.price || 0) * item.quantity).toFixed(0)}{' '}
                    {/* Calculate total price */}
                  </p>

                  {/* Quantity */}
                  <p className=" text-xs font-light text-gray-800">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Display message when there are no items in the cart
          <p className="text-center text-gray-500">Shopping bag is empty.</p>
        )}

        {/* View Basket Link - only show when there are items in the cart */}
        {hasItems && (
          <Link
            href="/basket"
            className="block bg-white borde py-3 mt-4 transition-all uppercase text-xs font-light text-center text-gray-800 border"
          >
            View shopping bag
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartPopup;
