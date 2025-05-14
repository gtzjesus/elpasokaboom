'use client';

import { useSearchParams } from 'next/navigation';
import useBasketStore from '../../../../store/store';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

/**
 * SuccessPage Component
 * Displays a confirmation screen after a successful checkout.
 * Clears the user's basket, shows a confetti animation, and provides navigation options.
 *
 * @returns {JSX.Element} The rendered success page with confirmation and order info.
 */
function SuccessPage() {
  // 🔍 Get query parameters from the URL (e.g., orderNumber)
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  // 🛒 Access store action to clear the basket
  const clearBasket = useBasketStore((state) => state.clearBasket);

  /**
   * 🎉 useEffect Hook
   * Runs on mount if there's an order number:
   * - Clears the user's basket
   * - Triggers confetti animation
   */
  useEffect(() => {
    if (orderNumber) {
      clearBasket();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [orderNumber, clearBasket]);

  /**
   * 💡 UI Structure
   * - Checkmark icon
   * - Confirmation message
   * - Truncated order number (last 6 chars)
   * - Navigation buttons
   */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 p-10 sm:p-12 rounded-xl shadow-xl max-w-2xl w-full"
      >
        {/* ✅ Checkmark Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-green-50 dark:bg-green-900 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* ✅ Confirmation Title */}
        <h1 className="text-lg text-center mb-2 text-green-700 dark:text-green-400 uppercase font-light">
          Order Confirmed!
        </h1>

        {/* ✅ Subtitle */}
        <p className="text-xs text-gray-700 dark:text-gray-300 text-center mb-6">
          thank you for your purchase.
        </p>

        {/* ✅ Order Summary */}
        {orderNumber && (
          <div className="bg-green-50 dark:bg-green-800 p-6 mb-8 text-center">
            <h3 className="font-light text-sm uppercase text-gray-800 dark:text-gray-200 mb-2">
              Order Summary
            </h3>
            <ul className="text-xs font-mono uppercase text-gray-600 dark:text-gray-400 space-y-1">
              <li>
                🧾 <span>Order Number:</span>{' '}
                <span
                  className="text-green-600 dark:text-green-400"
                  title={orderNumber || ''}
                >
                  #{orderNumber?.slice(-6)}
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* 🔒 Optional: Email Confirmation Note */}
        {/*
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          A confirmation email has been sent to your inbox.
        </p>
        */}

        {/* ✅ Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="uppercase text-xs font-light bg-green-600 hover:bg-green-700 transition-all duration-200 shadow-md"
          >
            <Link href="/orders">View Order</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="transition-all duration-200 uppercase text-xs font-light"
          >
            <Link href="/search?q=*">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default SuccessPage;
