'use client';

import { useState } from 'react';
import AddToBasketButton from '@/components/cart/AddToBasketButton';
import { Product } from 'sanity.types';
import CartPopup from '../cart/CartPopUp';

interface ProductClientProps {
  product: Product;
}

const ProductClient: React.FC<ProductClientProps> = ({ product }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div>
      <AddToBasketButton product={product} onAddedToBag={openCart} />
      {isCartOpen && <CartPopup onClose={closeCart} />}
    </div>
  );
};

export default ProductClient;
