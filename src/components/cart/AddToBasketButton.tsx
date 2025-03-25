'use client';

import { useState } from 'react';
import useBasketStore from '../../../store/store';
import { Product } from '../../../sanity.types';

interface AddToBasketButtonProps {
  product: Product;
  onAddedToBag: () => void; // Callback to open the cart
}

const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
  product,
  onAddedToBag,
}) => {
  const { addItem } = useBasketStore(); // Only need addItem now
  const [isAdded, setIsAdded] = useState(false); // Track if product has been added

  const handleAddToBasket = () => {
    addItem(product); // Add exactly one product when clicked
    setIsAdded(true); // Mark product as added
    onAddedToBag(); // Open the cart popup
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleAddToBasket}
        className={`block text-center text-xs bg-black border uppercase py-3 mt-2 transition-all w-full text-white font-light ${
          isAdded ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-black'
        }`}
        disabled={isAdded} // Disable button if item is added
      >
        <span className="text-white text-xs">
          {isAdded ? 'Added to Bag' : 'Add to shopping bag'}
        </span>
      </button>
    </div>
  );
};

export default AddToBasketButton;
