'use client';

import { SignInButton } from '@clerk/nextjs';
import React from 'react';

interface Props {
  totalItems: number;
  totalPrice: number;
  isSignedIn: boolean;
  isLoading: boolean;
  onCheckout: () => void;
}

const OrderSummary = ({
  totalItems,
  totalPrice,
  isSignedIn,
  isLoading,
  onCheckout,
}: Props) => {
  return (
    <div className="w-full lg:w-auto lg:sticky h-fit bg-white p-6 lg:p-12 fixed bottom-0 left-0 lg:left-auto lg:bottom-0 lg:order-last">
      <h3 className="uppercase text-xs font-light text-center text-gray-800 border-b pb-1">
        Order Summary
      </h3>

      <div className="pt-1">
        <p className="flex justify-between uppercase text-xs font-light text-gray-800">
          <span>Total items:</span>
          <span>{totalItems}</span>
        </p>
        <p className="flex justify-between uppercase text-sm font-light text-gray-800 pt-1">
          <span>Subtotal:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </p>
      </div>

      {isSignedIn ? (
        <button
          onClick={onCheckout}
          disabled={isLoading}
          className="mt-2 w-full text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Checkout'}
        </button>
      ) : (
        <div className="flex items-center justify-center mt-2">
          <SignInButton mode="modal">
            <button className="w-full text-xs bg-black border uppercase py-3 text-white font-light">
              Checkout
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
