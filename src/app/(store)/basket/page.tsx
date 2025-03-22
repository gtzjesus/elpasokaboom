'use client';

import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import useBasketStore from '../../../../store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import AddToBasketButton from '@/components/cart/AddToBasketButton';
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

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto max-w-6xl bg-white">
        <h1 className="uppercase text-sm font-semibold text-center p-6 text-gray-800 ">
          shopping bag
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            {groupedItems?.map((item) => (
              <div key={item.product._id} className="p-6 border-b">
                <div
                  className="min-w-0"
                  onClick={() =>
                    router.push(`/product/${item.product.slug?.current}`)
                  }
                >
                  <div className="flex justify-center items-center w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 mx-auto">
                    {item.product.image && (
                      <Image
                        src={imageUrl(item.product.image).url()}
                        alt={item.product.name ?? 'product image'}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    )}
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold truncate">
                        {item.product.name}
                      </h2>
                      <p className="text sm sm:text-base">
                        price: $
                        {((item.product.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center ml-4 flex-shrink-0">
                  <AddToBasketButton product={item.product} />
                </div> */}
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 lg:sticky lg:top-4 h-fit bg-white p-6 border rounded order-first lg:order-last fixed bottom-0 left-0 lg:left-auto">
            <h3 className="text-xl font-semibold">order summary</h3>
            <div className="mt-4 space-y-2">
              <p className="flex justify-between">
                <span>items:</span>
                <span>
                  {groupedItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </p>
              <p className="flex justify-between text-2xl font-bold border-t pt-2">
                <span>total:</span>
                <span>
                  ${useBasketStore.getState().getTotalPrice().toFixed(2)}
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
                <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  sign in to checkout
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
