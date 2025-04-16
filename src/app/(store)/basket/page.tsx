// app/(store)/basket/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

import useBasketStore from '../../../../store/store';
import Loader from '@/components/common/Loader';
import Header from '@/components/common/header';
import {
  createCheckoutSession,
  Metadata,
} from '../../../../actions/createCheckoutSession';
import EmptyBasket from '@/components/basket/EmptyBasket';
import OrderSummary from '@/components/basket/OrderSummary';
import BasketItemCard from '@/components/basket/BasketItemCard';

/**
 * BasketPage Component
 *
 * Displays a list of products added to the user's shopping basket.
 * Allows users to view product details, adjust quantities, remove items,
 * and proceed to checkout (if signed in).
 *
 * Handles client-side rendering due to usage of session storage and stateful hooks.
 *
 * @returns {JSX.Element} The rendered basket page.
 */
export default function BasketPage() {
  const { isSignedIn = false } = useAuth();
  const { user } = useUser();
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const totalPrice = useBasketStore((state) => state.getTotalPrice());

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Make sure we only render on the client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loader if not yet mounted
  if (!isClient) return <Loader />;

  // Show empty state if cart has no items
  if (groupedItems.length === 0) return <EmptyBasket />;

  // Handle checkout logic
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
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove product from store and session
  const handleRemoveItem = (productId: string) => {
    useBasketStore.getState().removeItem(productId);
    sessionStorage.removeItem(productId);
  };

  // Update quantity
  const handleQuantityChange = (productId: string, quantity: number) => {
    useBasketStore.getState().updateItemQuantity(productId, quantity);
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />

      {/* Page title */}
      <div className="container mx-auto max-w-3xl bg-white">
        <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
          Shopping Bag
        </h1>
      </div>

      <div className="container mx-auto w-full px-2 lg:px-2 grid grid-cols-1 lg:grid-cols-3 ">
        {/* Product Items */}
        <div className="col-span-2 pb-80">
          {groupedItems.map((item) => (
            <BasketItemCard
              key={item.product._id}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Order Summary */}
        <OrderSummary
          totalItems={groupedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          )}
          totalPrice={totalPrice}
          isSignedIn={isSignedIn}
          isLoading={isLoading}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
