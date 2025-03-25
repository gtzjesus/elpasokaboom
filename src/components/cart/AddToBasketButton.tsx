'use client';

import { useEffect, useState } from 'react';
import useBasketStore from '../../../store/store';
import { Product } from '../../../sanity.types';

interface AddToBasketButtonProps {
  product: Product;
  disabled?: boolean;
}

function AddToBasketButton({ product, disabled }: AddToBasketButtonProps) {
  const { addItem } = useBasketStore(); // Only need addItem now
  const [isClient, setIsClient] = useState(false);
  const [isAdded, setIsAdded] = useState(false); // Track if product has been added

  // Only rendered once mounted on the client side (no hydration errors with local storage)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleAddToBasket = () => {
    addItem(product); // Add exactly one product when clicked
    setIsAdded(true); // Mark product as added
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleAddToBasket}
        className={`block text-center text-xs bg-black border uppercase py-3 mt-2 transition-all w-full text-white font-light ${
          disabled || isAdded
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-black hover:bg-black'
        }`}
        disabled={disabled || isAdded} // Disable button if item is added
      >
        <span className="text-white text-xs">
          {isAdded ? 'Added to Bag' : 'Add to shopping bag'}
        </span>
      </button>
    </div>
  );
}

export default AddToBasketButton;
