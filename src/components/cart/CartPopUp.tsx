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
    <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96 h-auto max-h-[90vh] overflow-hidden relative">
        <div className="border-b mb-4 ">
          {' '}
          {/* Close Button */}
          <button
            className="absolute top-4 right-6 text-xl hover:text-gray-900 transition"
            onClick={onClose}
          >
            &times;
          </button>
          {/* Title */}
          <h2 className="uppercase text-sm font-semibold text-center mb-4  text-gray-800 ">
            added to shopping bag
          </h2>
        </div>

        {/* Products List */}
        {hasItems ? (
          <div className="max-h-[20vh] overflow-y-auto border-b">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between mb-6 pb-4"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={
                      item.product.image
                        ? urlFor(item.product.image).url()
                        : '/fallback-image.jpg'
                    }
                    alt={item.product.name || 'Product'}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 ml-4">
                  <p className="font-semibold text-lg text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-900">
                    ${((item.product.price || 0) * item.quantity).toFixed(2)}
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
          className="block text-center text-xs bg-blue-600 text-white uppercase py-3  mt-4 transition-all hover:bg-blue-700"
        >
          view shopping bag
        </Link>
      </div>
    </div>
  );
};

export default CartPopup;
