// components/CartButton.tsx
import Link from 'next/link';
import Image from 'next/image';

interface CartButtonProps {
  itemCount: number;
  scrolled: boolean;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, scrolled }) => (
  <Link
    href="/basket"
    className="relative flex justify-center items-center space-x-2 font-bold py-2 px-4 rounded"
  >
    <Image
      src={scrolled ? '/icons/bag.webp' : '/icons/bag-white.webp'}
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
  </Link>
);

export default CartButton;
