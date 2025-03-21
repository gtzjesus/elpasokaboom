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

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50 flex justify-center ">
      <div className="bg-white mt-14 p-4 w-96 h-auto max-h-[35vh] overflow-hidden relative">
        <div className="border-b mb-4  ">
          {' '}
          {/* Close Button */}
          <button
            className="absolute top-4 right-6 text-xl hover:text-gray-900 transition"
            onClick={onClose}
          >
            &times;
          </button>
          {/* Title */}
          <h2 className="uppercase text-xs font-semibold text-center mb-4  text-gray-800 ">
            added to shopping bag
          </h2>
        </div>

        {/* Products List */}
        {hasItems ? (
          <div className="max-h-[20vh]  overflow-y-auto  border-b">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex  justify-between mb-6 pb-4"
              >
                {/* Product Image */}
                <div className="mt-2 flex-shrink-0">
                  <Image
                    src={
                      item.product.image
                        ? urlFor(item.product.image).url()
                        : '/fallback-image.jpg'
                    }
                    alt={item.product.name || 'Product'}
                    width={120}
                    height={120}
                    className="rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 ml-4 ">
                  {/* Product Name */}
                  <p className=" font-semibold text-xs uppercase text-gray-800 mb-2">
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
        {/* View Basket Link */}
        <Link
          href="/basket"
          className="block text-center text-xs bg-white border text-black uppercase py-3  mt-4 transition-all "
        >
          view shopping bag
        </Link>
      </div>
    </div>
  );
};

export default CartPopup;
