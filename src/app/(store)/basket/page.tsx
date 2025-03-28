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
import Link from 'next/link';

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
      <div className="container mx-auto p-6 min-h-[100vh] bg-white">
        <p className="uppercase text-sm font-light text-center p-5 text-gray-800">
          Your basket is empty.
        </p>
        <Link
          href="/search?q=*" // Redirect to search page with a query to show all products
          className="block bg-white border py-3 mt-4 transition-all uppercase text-xs font-light text-center text-gray-800 "
        >
          continue shopping
        </Link>
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
    // Remove the item from the basket store
    useBasketStore.getState().removeItem(productId);

    // Remove the product from session storage
    sessionStorage.removeItem(productId);
  };

  // Handle updating item quantity in the basket
  const handleQuantityChange = (productId: string, quantity: number) => {
    useBasketStore.getState().updateItemQuantity(productId, quantity);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-full bg-white">
        <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
          Shopping Bag
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-8">
          {/* Left section: Product List */}
          <div className="col-span-2 flex-grow overflow-y-auto pb-40">
            {groupedItems.map((item) => {
              const stock = item.product.stock ?? 0;

              return (
                <div key={item.product._id} className="p-2 border-b">
                  <div
                    className="min-w-0 cursor-pointer"
                    onClick={() =>
                      router.push(`/product/${item.product.slug?.current}`)
                    }
                  >
                    <div className="flex justify-center items-center w-50 h-50">
                      {item.product.image && (
                        <Image
                          src={imageUrl(item.product.image).url()}
                          alt={item.product.name ?? 'Product Image'}
                          className="object-contain transition-transform duration-300 hover:scale-105"
                          width={200}
                          height={200}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center p-3 gap-4">
                    <div className="min-w-0">
                      <h2 className="uppercase text-md font-semibold text-center text-gray-800">
                        {item.product.name}
                      </h2>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-light text-center text-gray-800">
                        $
                        {((item.product.price ?? 0) * item.quantity).toFixed(0)}
                      </p>
                      <p className="text-xs font-light text-center text-gray-600 my-2">
                        {getStockStatus(stock)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Dropdown */}
                  <div className="min-w-0">
                    <div className="flex justify-center mb-4">
                      <select
                        value={`${item.quantity}`}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.product._id,
                            +e.target.value
                          )
                        }
                        className="border py-1 text-sm rounded-md w-full max-w-[50px] bg-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-light text-center text-gray-800"
                        disabled={stock === 0} // Disable if out of stock
                      >
                        <option value="" disabled>
                          QTY
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
                  </div>
                  {/* Remove Item Button */}
                  <div className="min-w-0">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="uppercase text-xs underline font-light text-center text-gray-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right section: Fixed Order Summary */}
          <div className="w-full lg:w-auto lg:sticky  h-fit bg-white p-6 lg:p-12 order-first lg:order-last fixed bottom-0 left-0 lg:left-auto lg:bottom-0">
            <h3 className="uppercase text-xs font-light text-center text-gray-800 border-b pb-1">
              Order Summary
            </h3>

            <div>
              <p className="flex justify-between uppercase text-xs pt-1 font-light text-center text-gray-800">
                <span>total items:</span>
                <span>
                  {groupedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </p>
              <p className="flex justify-between uppercase text-sm font-light text-center text-gray-800 pt-1">
                <span>subtotal:</span>
                <span>
                  ${useBasketStore.getState().getTotalPrice().toFixed(2)}
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
              <div className="flex items-center justify-center">
                <SignInButton mode="modal">
                  <button className="block text-center text-xs bg-black border uppercase py-3 mt-2 transition-all w-full text-white font-light lg:w-[50vh]">
                    Checkout
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasketPage;
