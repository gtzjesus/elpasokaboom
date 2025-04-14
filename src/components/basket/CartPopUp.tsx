'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useBasketStore from 'store/store';
import { urlFor } from '@/sanity/lib/image';

/**
 * Props for the CartPopup component.
 */
interface CartPopupProps {
  /**
   * Function to close the popup when triggered.
   */
  onClose: () => void;
}

/**
 * CartPopup displays a modal-style cart summary showing the items
 * currently added to the shopping basket.
 * It supports closing the popup when clicking outside and navigating to the basket or shopping page.
 *
 * @component
 * @example
 * <CartPopup onClose={() => setShowCart(false)} />
 */
const CartPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  const cartItems = useBasketStore((state) => state.getGroupedItems());
  const hasItems = cartItems.length > 0;
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Close popup when user clicks outside of it.
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed top-12 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-[9999]">
      <div
        ref={popupRef}
        className="bg-white  p-4 w-full h-[75vh] max-w-[325px] lg:h-[95vh] lg:max-w-[525px] overflow-hidden relative flex flex-col"
      >
        {hasItems ? (
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b py-2 px-2">
              <p className="uppercase text-xs font-light text-gray-800">
                Added to shopping bag
              </p>
              <button
                className="text-xl hover:text-gray-900 transition"
                onClick={onClose}
                aria-label="Close empty cart popup"
              >
                &times;
              </button>
            </div>
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center gap-4 py-4 border-b border-gray-200"
              >
                {/* Product Image */}
                <div className="w-24 flex-shrink-0">
                  <Link href={`/product/${item.product.slug?.current || ''}`}>
                    <Image
                      src={
                        item.product.image
                          ? urlFor(item.product.image).url()
                          : '/fallback-image.jpg'
                      }
                      alt={item.product.name || 'Product'}
                      width={96}
                      height={96}
                      className="object-contain rounded"
                      priority
                    />
                  </Link>
                </div>

                {/* Product Info */}
                <div className="flex flex-1 items-center">
                  <p className="uppercase text-xs font-semibold text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-xs font-light text-gray-700 ml-2 whitespace-nowrap">
                    ${((item.product.price || 0) * item.quantity).toFixed(0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between border-b py-4 px-4">
            <p className="uppercase text-xs font-light text-gray-800">
              Shopping bag is empty
            </p>
            <button
              className="text-xl hover:text-gray-900 transition"
              onClick={onClose}
              aria-label="Close empty cart popup"
            >
              &times;
            </button>
          </div>
        )}

        {/* Footer CTA */}
        <Link
          href={hasItems ? '/basket' : '/search?q=*'}
          className="absolutebottom-0 inline-block border-none bg-black  py-4 px-4 text-xs font-light text-center text-white uppercase"
          onClick={onClose}
        >
          {hasItems ? 'View shopping bag' : 'Start shopping'}
        </Link>
      </div>
    </div>
  );
};

export default CartPopup;
