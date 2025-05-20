'use client';

import { useState } from 'react';
import AddToBasketButton from '@/components/basket/AddToBasketButton';
import CartPopup from '../basket/CartPopUp';
import { Product } from '@/types';

/**
 * Props for the ProductClient component.
 *
 * @param product - The product object that is being passed to the component.
 * @param isOutOfStock - A boolean flag indicating if the product is out of stock.
 */
interface ProductClientProps {
  product: Product;
  isOutOfStock: boolean;
}

/**
 * ProductClient component is responsible for displaying the "Add to Basket" button
 * and managing the Cart Popup visibility after a product is added to the shopping bag.
 *
 * It uses the `AddToBasketButton` component to allow the user to add a product to the cart.
 * After the product is added, a popup (`CartPopup`) is shown to confirm the action and
 * give the user an option to view the cart.
 *
 * The visibility of the cart popup is controlled by the `isCartOpen` state.
 *
 * @component
 * @example
 * <ProductClient product={product} isOutOfStock={false} />
 */
const ProductClient: React.FC<ProductClientProps> = ({
  product,
  isOutOfStock,
}) => {
  // State to control the visibility of the cart popup
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Function to open the cart popup
  const openCart = () => {
    setIsCartOpen(true);
  };

  // Function to close the cart popup
  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
      {/* AddToBasketButton component to add the product to the shopping basket */}
      <AddToBasketButton
        product={product}
        onAddedToBag={openCart}
        disabled={isOutOfStock} // Disable the button if the product is out of stock
      />

      {/* Conditionally render the CartPopup when the cart is open */}
      {isCartOpen && <CartPopup onClose={closeCart} />}
    </div>
  );
};

export default ProductClient;
