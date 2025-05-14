'use client';

import React from 'react';
import { SignInButton } from '@clerk/nextjs';

interface OrderSummaryProps {
  /**
   * Total number of items in the basket.
   */
  totalItems: number;

  /**
   * Total price of all items.
   */
  totalPrice: number;

  /**
   * Whether the user is signed in.
   */
  isSignedIn: boolean;

  /**
   * Loading state for checkout action.
   */
  isLoading: boolean;

  /**
   * Callback to trigger checkout flow.
   */
  onCheckout: () => void;
}

/**
 * OrderSummary displays a cart summary with item count, subtotal,
 * tax, and a checkout button. If the user is not signed in, it shows a Sign In CTA.
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalItems,
  totalPrice,
  isSignedIn,
  isLoading,
  onCheckout,
}) => {
  const TAX_RATE = 0.0825;
  const taxAmount = totalPrice * TAX_RATE;
  const totalWithTax = totalPrice + taxAmount;

  return (
    <div className="w-full lg:w-auto lg:sticky h-fit bg-white p-6 lg:p-12 fixed bottom-0 left-0 lg:left-auto lg:bottom-0 lg:order-last shadow-md">
      <h3 className="uppercase text-xs font-light text-center text-gray-800 border-b pb-1">
        Order Summary
      </h3>

      <div className="pt-1 space-y-1">
        <p className="flex justify-between uppercase text-xs font-light text-gray-800">
          <span>Total items:</span>
          <span>{totalItems}</span>
        </p>
        <p className="flex justify-between uppercase text-xs font-light text-gray-800">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </p>
        <p className="flex justify-between uppercase text-xs font-light text-gray-800">
          <span>Tax (8.25%):</span>
          <span>${taxAmount.toFixed(2)}</span>
        </p>
        <p className="flex justify-between uppercase text-xs font-semibold text-gray-900 border-t pt-2">
          <span>Total:</span>
          <span>${totalWithTax.toFixed(2)}</span>
        </p>
      </div>

      {/* Action button */}
      {isSignedIn ? (
        <button
          onClick={onCheckout}
          disabled={isLoading}
          className="mt-3 w-full text-sm uppercase font-light bg-blue-500 text-white py-3 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
          aria-disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Checkout'}
        </button>
      ) : (
        <div className="flex items-center justify-center mt-3">
          <SignInButton mode="modal">
            <button
              className="w-full text-sm bg-black border uppercase py-3 text-white font-light hover:bg-opacity-90 transition"
              onClick={() => {
                // Set a flag to run checkout after login
                sessionStorage.setItem('checkoutAfterLogin', 'true');
              }}
            >
              Checkout
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
