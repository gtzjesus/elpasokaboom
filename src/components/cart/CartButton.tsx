// components/CartButton.tsx
import { useState } from 'react';
import Image from 'next/image';
import CartPopup from './CartPopUp';
// import useBasketStore from 'store/store';

interface CartButtonProps {
  itemCount: number;
  scrolled: boolean;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, scrolled }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  // const cartItems = useBasketStore((state) => state.getGroupedItems()); // Get items from the store

  const openPopup = () => setIsPopupOpen(true); // Open popup
  const closePopup = () => setIsPopupOpen(false); // Close popup

  return (
    <div className="relative">
      <button
        onClick={openPopup}
        className="relative flex justify-center items-center space-x-4 font-bold px-6 rounded"
      >
        <Image
          src={scrolled ? '/icons/bag.webp' : '/icons/bag.webp'}
          alt="Bag"
          width={50}
          height={50}
          className="w-6 h-6"
        />
        {itemCount > 0 && (
          <span className="absolute opacity-75 -top-0.5 bg-custom-gray text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Conditionally render the popup if it's open */}
      {isPopupOpen && <CartPopup onClose={closePopup} />}
    </div>
  );
};

export default CartButton;
