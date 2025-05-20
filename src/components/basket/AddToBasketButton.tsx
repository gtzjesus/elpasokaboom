'use client';

import { useState, useEffect } from 'react';
import useBasketStore from '../../../store/store';
import { Product } from '@/types';

/**
 * Props for the AddToBasketButton component.
 */
interface AddToBasketButtonProps {
  /**
   * Product object to be added to the basket.
   */
  product: Product;

  /**
   * Callback to open the shopping cart or perform a side effect after item is added.
   */
  onAddedToBag: () => void;

  /**
   * Boolean flag to disable the button if the product is out of stock.
   */
  disabled: boolean;
}

/**
 * AddToBasketButton handles the logic and UI for adding a product to the shopping basket.
 * It prevents duplicate additions by checking session storage.
 *
 * @component
 * @example
 * <AddToBasketButton product={product} onAddedToBag={openCart} disabled={isOutOfStock} />
 */
const AddToBasketButton: React.FC<AddToBasketButtonProps> = ({
  product,
  onAddedToBag,
  disabled,
}) => {
  const { addItem } = useBasketStore();
  const [isAdded, setIsAdded] = useState(false);

  /**
   * Check if the product was previously added by looking in session storage.
   */
  useEffect(() => {
    // Re-check sessionStorage for the product after any update (such as after clearing it)
    const addedProduct = sessionStorage.getItem(product._id);
    setIsAdded(!!addedProduct); // Set to true if it exists in sessionStorage
  }, [product._id]); // Trigger effect when the product ID changes (or on first load)

  /**
   * Handles adding the product to the basket and updating session state.
   */
  const handleAddToBasket = () => {
    addItem(product);
    setIsAdded(true);
    sessionStorage.setItem(product._id, 'added');
    onAddedToBag();
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleAddToBasket}
        className={`block text-center text-xs border uppercase py-3 mt-2 transition-all w-full lg:w-[50vh] font-light ${
          disabled || isAdded
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-opacity-90'
        }`}
        disabled={disabled || isAdded} // Disable the button if the product is out of stock or already added
      >
        <span>
          {disabled
            ? 'Out of Stock'
            : isAdded
              ? 'Added to Bag'
              : 'Add to shopping bag'}
        </span>
      </button>
    </div>
  );
};

export default AddToBasketButton;
