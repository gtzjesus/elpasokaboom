'use client';

import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import useBasketStore from '../../../../store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { imageUrl } from '@/lib/imageUrl';
import Loader from '@/components/common/Loader';
import {
  createCheckoutSession,
  Metadata,
} from '../../../../actions/createCheckoutSession';
import Header from '@/components/common/header';

function BasketPage() {
  // Fetch basket items and user info
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the component is rendered on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Loading state if client is not yet available
  if (!isClient) {
    return <Loader />;
  }

  // Display message if basket is empty
  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 min-h-[50vh] bg-white">
        <p className="text-gray-600 text-lg">Your basket is empty.</p>
      </div>
    );
  }

  // Handle checkout session creation
  const handleCheckout = async () => {
    if (!isSignedIn) return;

    setIsLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? 'Unknown',
        customerEmail: user?.emailAddresses[0].emailAddress ?? 'Unknown',
        clerkUserId: user!.id,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Error creating checkout session', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to truncate product descriptions
  /* eslint-disable  @typescript-eslint/no-explicit-any */

  const getTruncatedDescription = (description: any) => {
    if (typeof description === 'string') {
      return description.length > 30
        ? description.substring(0, 30) + '...'
        : description;
    }

    if (Array.isArray(description)) {
      let combinedText = '';
      description.forEach((block: any) => {
        block.children?.forEach((child: any) => {
          if (child.text) {
            combinedText += child.text;
          }
        });
      });
      return combinedText.length > 30
        ? combinedText.substring(0, 30) + '...'
        : combinedText;
    }

    return '';
  };

  // Display stock status
  const getStockStatus = (stock: number | undefined) => {
    return stock && stock > 0 ? (
      <span className="font-semibold">Available</span>
    ) : (
      <span className="font-semibold">Out of stock</span>
    );
  };

  // Handle item removal from the basket
  const handleRemoveItem = (productId: string) => {
    useBasketStore.getState().removeItem(productId);
  };

  // Handle updating item quantity in the basket
  const handleQuantityChange = (productId: string, quantity: number) => {
    useBasketStore.getState().updateItemQuantity(productId, quantity);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      <div className="container mx-auto max-w-6xl bg-white">
        <h1 className="uppercase text-sm font-semibold text-center p-6 text-gray-800">
          Shopping Bag
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product List */}
          <div className="flex-grow overflow-y-auto pr-4 pb-40 lg:pb-0">
            {groupedItems.map((item) => {
              const stock = item.product.stock ?? 0;

              return (
                <div key={item.product._id} className="p-6 border-b">
                  <div
                    className="min-w-0 cursor-pointer"
                    onClick={() =>
                      router.push(`/product/${item.product.slug?.current}`)
                    }
                  >
                    <div className="flex justify-center items-center w-40 h-40 sm:w-24 sm:h-24 flex-shrink-0 mx-auto">
                      {item.product.image && (
                        <Image
                          src={imageUrl(item.product.image).url()}
                          alt={item.product.name ?? 'Product Image'}
                          className="w-full h-full object-cover"
                          width={120}
                          height={120}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center items-center text-center p-10">
                    <div className="min-w-0">
                      <h2 className="text-md uppercase sm:text-xl font-semibold truncate">
                        {item.product.name}
                      </h2>
                      {item.product.description && (
                        <p className="py-2 text-xs font-light">
                          {getTruncatedDescription(item.product.description)}
                        </p>
                      )}
                      <p className="text-sm font-light mt-2">
                        ${' '}
                        {((item.product.price ?? 0) * item.quantity).toFixed(0)}
                      </p>
                      <p className="mt-2 text-xs uppercase">
                        {getStockStatus(stock)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Dropdown */}
                  <div className="flex justify-center mb-4">
                    <select
                      value={`${item.quantity}`}
                      onChange={(e) =>
                        handleQuantityChange(item.product._id, +e.target.value)
                      }
                      className="border px-3 py-2 text-sm rounded-md w-full max-w-[120px] bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={stock === 0} // Disable if out of stock
                    >
                      <option value="" disabled>
                        quantity
                      </option>
                      {Array.from({ length: stock }, (_, i) => i + 1).map(
                        (quantity) => (
                          <option key={quantity} value={quantity}>
                            {quantity}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Remove Item Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="uppercase underline text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fixed Order Summary */}
          <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
            <h3 className="text-xs uppercase font-semibold border-b pb-1">
              Order Summary
            </h3>

            <div>
              <p className="flex justify-between text-sm font-light pt-1">
                <span>total items:</span>
                <span>
                  {groupedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </p>
              <p className="flex justify-between text-md font-light pt-1">
                <span>subtotal:</span>
                <span>
                  $ {useBasketStore.getState().getTotalPrice().toFixed(2)}
                </span>
              </p>
            </div>

            {isSignedIn ? (
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="mt-2 w-full text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : 'Checkout'}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="block text-center text-xs bg-black border text-white uppercase py-3 mt-2 transition-all w-full">
                  Checkout
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketPage;
