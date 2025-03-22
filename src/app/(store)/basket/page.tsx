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
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <Loader />;
  }

  if (groupedItems.length === 0) {
    return (
      <div className="container mx-auto p-4 min-h-[50vh] bg-white">
        <p className="text-gray-600 text-lg">your basket is empty.</p>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!isSignedIn) return;
    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? 'unknown',
        customerEmail: user?.emailAddresses[0].emailAddress ?? 'unknown',
        clerkUserId: user!.id,
      };

      const checkoutUrl = await createCheckoutSession(groupedItems, metadata);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('error creating checkout session', error);
    } finally {
      setIsLoading(false);
    }
  };
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
        if (block.children && Array.isArray(block.children)) {
          block.children.forEach((child: any) => {
            if (child.text) {
              combinedText += child.text;
            }
          });
        }
      });
      return combinedText.length > 30
        ? combinedText.substring(0, 30) + '...'
        : combinedText;
    }

    return '';
  };

  const getStockStatus = (stock: number | undefined) => {
    const validStock = stock ?? 0;
    return validStock > 0 ? (
      <span className="font-semibold">available</span>
    ) : (
      <span className="font-semibold">out of stock</span>
    );
  };

  // Handle item removal from the basket
  const handleRemoveItem = (productId: string) => {
    useBasketStore.getState().removeItem(productId); // Calling the remove method from the store
  };

  // Handle updating the item quantity
  const handleQuantityChange = (productId: string, quantity: number) => {
    useBasketStore.getState().updateItemQuantity(productId, quantity); // Update the quantity in the store
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto max-w-6xl bg-white">
        <h1 className="uppercase text-sm font-semibold text-center p-6 text-gray-800 ">
          shopping bag
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {groupedItems?.map((item) => {
              const stock = item.product.stock ?? 0; // Ensure stock is never undefined
              return (
                <div key={item.product._id} className="p-6 border-b">
                  <div
                    className="min-w-0"
                    onClick={() =>
                      router.push(`/product/${item.product.slug?.current}`)
                    }
                  >
                    <div className="flex justify-center items-center w-40 h-40 sm:w-24 sm:h-24 flex-shrink-0 mx-auto">
                      {item.product.image && (
                        <Image
                          src={imageUrl(item.product.image).url()}
                          alt={item.product.name ?? 'product image'}
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
                      className="border px-2 py-2 text-xs"
                      disabled={stock === 0} // Disable if stock is 0
                    >
                      {Array.from({ length: stock }, (_, i) => i + 1).map(
                        (quantity) => (
                          <option key={quantity} value={quantity}>
                            {quantity}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Remove button */}
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

          <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto ">
            <h3 className="text-xs  uppercase font-semibold border-b pb-2">
              order summary
            </h3>
            <div className="">
              <p className="flex justify-between text-sm font-light pt-2 ">
                <span>total items:</span>
                <span>
                  {groupedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </p>
              <p className="flex justify-between text-md font-light pt-2">
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
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoading ? 'processing...' : 'checkout'}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="block text-center text-xs bg-black border text-white uppercase py-3 mt-4 transition-all w-full">
                  checkout
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
