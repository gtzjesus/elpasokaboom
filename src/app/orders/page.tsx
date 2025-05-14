// app/(store)/orders/page.tsx

import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import { getMyOrders } from '@/sanity/lib/orders/getMyOrders';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';

/**
 * Orders Page (Server Component)
 *
 * Displays a list of the current user's past orders.
 * Requires authentication via Clerk — if the user is not signed in,
 * they are redirected to the home page.
 *
 * Orders are fetched from the Sanity backend and shown with
 * basic summaries, item breakdowns, pricing, and discounts if applicable.
 *
 * @returns {JSX.Element} Rendered orders page
 */
export default async function Orders() {
  const { userId } = await auth();

  // If no authenticated user, redirect to homepage
  if (!userId) {
    return redirect('/');
  }

  // Fetch user orders from Sanity
  const orders = await getMyOrders(userId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3">
      <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl">
        <h1 className="text-xl uppercase font-light text-gray-900 tracking-tight mb-8">
          orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-sm text-center uppercase font-light text-gray-900 tracking-tight m-4">
            <p>you have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className=" border border-green-600 p-3 shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-4 border-b border-green-600">
                  <div className="flex flex-row justify-between">
                    <div>
                      <p className="text-xs uppercase font-light text-gray-600 font-mono">
                        order number
                      </p>
                      <span
                        className="font-mono uppercase font-light text-xs text-green-600 dark:text-green-400"
                        title={order.orderNumber || ''}
                      >
                        {order.orderNumber?.slice(-6)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-light font-mono text-gray-600">
                        order date
                      </p>
                      <p className="font-light text-xs mt-1">
                        {order.orderDate
                          ? new Date(order.orderDate).toLocaleDateString()
                          : 'n/a'}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Discount Section
                {order.amountDiscount && (
                  <div className="mt-4 p-3 sm:p-4 bg-red-50 rounded-lg">
                    <p>
                      discount applied:{' '}
                      {formatCurrency(order.amountDiscount, order.currency)}
                    </p>
                    <p className="text-sm text-gray-600">
                      original subtotal:{' '}
                      {formatCurrency(
                        (order.totalPrice ?? 0) + order.amountDiscount,
                        order.currency
                      )}
                    </p>
                  </div>
                )} */}
                {/* Order Items */}
                <div className="font-mono p-4">
                  <p className="text-xs uppercase font-light text-gray-600">
                    items
                  </p>
                  <div>
                    {order.products?.map((product) => (
                      <div
                        key={product.product?._id}
                        className="flex flex-col border-b border-green-600 last:border-b-0"
                      >
                        <div className="flex items-center gap-6">
                          {product.product?.image && (
                            <div className="relative h-20 w-20 flex-shrink-0 mt-2 mb-2">
                              <Image
                                src={imageUrl(product.product.image).url()}
                                alt={product.product?.name ?? ''}
                                className="object-cover"
                                fill
                                priority
                              />
                            </div>
                          )}
                          <p className="font-xs uppercase text-gray-600 font-light mb-1 mt-2">
                            {product.product?.name} {product.quantity ?? 'n/a'}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-800 mb-1 text-xs text-right">
                            {product.product?.price && product.quantity
                              ? formatCurrency(
                                  product.product.price * product.quantity,
                                  order.currency
                                )
                              : 'n/a'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Order Total */}
                <div className="border-t border-green-600 font-mono p-4 flex flex-col">
                  <div className="flex justify-between">
                    <p className="uppercase text-xs mb-1 text-gray-600">
                      total
                    </p>
                    <p className="font-bold text-xs">
                      ${order.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
