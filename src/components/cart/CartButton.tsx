// components/CartButton.tsx

import { useState } from 'react';
import Image from 'next/image';
import CartPopup from './CartPopUp'; // Importing the CartPopup component to display when the button is clicked

interface CartButtonProps {
  itemCount: number; // The number of items in the cart, to display as a badge
  scrolled: boolean; // Boolean flag to determine if the user has scrolled (used to adjust icon appearance)
}

/**
 * CartButton component that displays a button to open the shopping cart popup.
 * This button shows the total number of items in the cart and changes its appearance when scrolled.
 *
 * @param itemCount - The number of items currently in the cart.
 * @param scrolled - Boolean to determine the button's appearance based on scroll position.
 */
const CartButton: React.FC<CartButtonProps> = ({ itemCount, scrolled }) => {
  // State hook to manage whether the cart popup is open or closed
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to open the cart popup
  const openPopup = () => setIsPopupOpen(true);

  // Function to close the cart popup
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="relative">
      {/* Button that opens the cart popup */}
      <button
        onClick={openPopup} // When clicked, open the cart popup
        className="relative flex justify-center items-center space-x-4 font-bold px-6 rounded"
      >
        {/* Cart icon */}
        <Image
          src={scrolled ? '/icons/bag.webp' : '/icons/bag.webp'} // Using the same icon for simplicity, but you can change based on 'scrolled'
          alt="Bag"
          width={50}
          height={50}
          className="w-6 h-6" // Set width and height for the icon
        />

        {/* Display cart item count as a badge on top of the icon */}
        {itemCount > 0 && (
          <span className="absolute opacity-75 -top-0.5 bg-custom-gray text-black rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Conditionally render the CartPopup when the popup is open */}
      {isPopupOpen && <CartPopup onClose={closePopup} />}
    </div>
  );
};

export default CartButton;
