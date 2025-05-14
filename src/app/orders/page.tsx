// app/(store)/orders/page.tsx

import { formatCurrency } from '@/lib/formatCurrency';
import { imageUrl } from '@/lib/imageUrl';
import { getMyOrders } from '@/sanity/lib/orders/getMyOrders';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

/**
 * Orders Page (Server Component)
 *
 * Displays a list of the current user's past orders.
 * Requires authentication via Clerk — if the user is not signed in,
 * they are redirected to the home page.
 *
 * Each order includes:
 * - Order number and date
 * - Items with quantity and pricing
 * - Linkable product names and images to navigate to individual product pages
 * - Total cost of the order
 *
 * @returns {JSX.Element} Rendered orders page
 */
export default async function Orders() {
  const { userId } = await auth();

  // Redirect unauthenticated users to home
  if (!userId) {
    return redirect('/');
  }

  // Fetch orders from backend
  const orders = await getMyOrders(userId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-3">
      <div className="p-4 w-full max-w-3xl">
        <div className="flex justify-between">
          <h1 className="text-xl uppercase font-light text-gray-900 tracking-tight mb-8">
            orders
          </h1>
          <Link
            href="/search?q=*"
            className="inline-block border-none bg-green-600 p-4 text-xs font-light text-center text-white uppercase mb-4"
            aria-label="Continue shopping"
          >
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-sm text-center uppercase font-light text-gray-900 tracking-tight m-4">
            <p>you have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="border border-green-600 p-3 shadow-sm overflow-hidden"
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

                {/* Order Items */}
                <div className="font-mono p-4">
                  <p className="text-xs uppercase font-light text-gray-600">
                    items
                  </p>
                  <div>
                    {order.products?.map((product) => {
                      const prod = product.product;
                      const slug = prod?.slug?.current;

                      return (
                        <div
                          key={prod?._id}
                          className="flex flex-col border-b border-green-600 last:border-b-0"
                        >
                          <div className="flex items-center gap-6">
                            {prod?.image && slug && (
                              <Link
                                href={`/product/${slug}`}
                                className="relative h-20 w-20 flex-shrink-0 mt-2 mb-2"
                                aria-label={`View ${prod.name}`}
                              >
                                <Image
                                  src={imageUrl(prod.image).url()}
                                  alt={prod.name ?? ''}
                                  className="object-cover"
                                  fill
                                  priority
                                />
                              </Link>
                            )}

                            <div>
                              {slug ? (
                                <Link
                                  href={`/product/${slug}`}
                                  className="font-xs uppercase text-gray-600 font-light mb-1 mt-2 hover:underline"
                                >
                                  {prod?.name}
                                </Link>
                              ) : (
                                <p className="font-xs uppercase text-gray-600 font-light mb-1 mt-2">
                                  {prod?.name}
                                </p>
                              )}
                              <p className="text-xs uppercase font-light text-gray-600">
                                quantity: {product.quantity ?? 'n/a'}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-green-800 mb-1 text-xs text-right">
                              {prod?.price && product.quantity
                                ? formatCurrency(
                                    prod.price * product.quantity,
                                    order.currency
                                  )
                                : 'n/a'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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
