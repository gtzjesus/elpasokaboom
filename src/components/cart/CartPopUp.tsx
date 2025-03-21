import { useEffect, useRef } from 'react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import useBasketStore from 'store/store';

interface CartPopupProps {
  onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  const cartItems = useBasketStore((state) => state.getGroupedItems());
  const hasItems = cartItems.length > 0;

  // Create a ref for the popup container
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle clicks outside the popup
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close the popup if the click is outside
      }
    };

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50">
      <div
        ref={popupRef} // Attach the ref here
        className="bg-white mt-0 p-4 w-full h-[90vh] max-w-[325px] overflow-hidden relative flex flex-col"
      >
        {/* Header Section */}
        <div className="border-b mb-4">
          {/* Close Button */}
          <button
            className="absolute top-2 right-6 text-xl hover:text-gray-900 transition"
            onClick={onClose}
          >
            &times;
          </button>
          {/* Title */}
          <h2 className="uppercase text-xs font-semibold text-center mb-4 text-gray-800">
            Added to shopping bag
          </h2>
        </div>

        {/* Products List - Scrollable */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {hasItems ? (
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between mb-6 pb-4"
                >
                  {/* Product Image with Link */}
                  <div className="mt-2 flex-shrink-0">
                    <Link
                      href={`/product/${item.product.slug?.current || ''}`} // Ensure slug is a valid string
                    >
                      <Image
                        src={
                          item.product.image
                            ? urlFor(item.product.image).url()
                            : '/fallback-image.jpg'
                        }
                        alt={item.product.name || 'Product'}
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 ml-4">
                    {/* Product Name */}
                    <p className="font-semibold text-xs uppercase text-gray-800 mb-2">
                      {item.product.name}
                    </p>

                    {/* Price */}
                    <p className="text-sm font-light mb-2">
                      $ {((item.product.price || 0) * item.quantity).toFixed(0)}
                    </p>

                    {/* Quantity */}
                    <p className="text-xs font-light">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Shopping bag is empty.</p>
          )}
        </div>

        {/* View Basket Link */}
        <Link
          href="/basket"
          className="block text-center text-xs bg-white border text-black uppercase py-3 mt-4 transition-all"
        >
          View shopping bag
        </Link>
      </div>
    </div>
  );
};

export default CartPopup;
