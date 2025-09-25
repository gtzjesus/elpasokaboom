'use client';

import { useState, useEffect } from 'react';
import { getAllOrders } from '@/sanity/lib/orders/getAllOrders';
import OrderCard from '@/components/orders/OrderCard';
// import { formatCurrency } from '@/lib/formatCurrency';

export const dynamic = 'force-dynamic';

interface Order {
  _id: string;
  totalPrice: number;
  currency?: string;
  orderDate?: string;
  products?: {
    quantity: number;
    product?: {
      itemNumber?: number | string;
    };
  }[];
}

export default function AdminOrdersPage() {
  const [filteredItemQuantity, setFilteredItemQuantity] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchItemNumber, setSearchItemNumber] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const allOrders: Order[] = await getAllOrders(); // ✅ Tell TS what this is

      const unique: Order[] = Array.from(
        new Map(allOrders.map((o) => [o._id, o])).values()
      );

      setOrders(unique); // ✅ Now TS knows this is Order[]
    }

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchItemNumber) {
      setFilteredOrders(orders);
      setFilteredItemQuantity(0);
      return;
    }

    const filtered = orders.filter((order) =>
      order.products?.some(
        (p) => String(p.product?.itemNumber ?? '') === searchItemNumber.trim()
      )
    );

    setFilteredOrders(filtered);

    const totalQuantity = filtered.reduce((acc, order) => {
      const quantityInOrder =
        order.products?.reduce((sum, p) => {
          return String(p.product?.itemNumber ?? '') === searchItemNumber.trim()
            ? sum + (p.quantity ?? 0)
            : sum;
        }, 0) ?? 0;

      return acc + quantityInOrder;
    }, 0);

    setFilteredItemQuantity(totalQuantity);
  }, [orders, searchItemNumber]);

  // const totalSales = filteredOrders.reduce((acc, order) => {
  //   return acc + (typeof order.totalPrice === 'number' ? order.totalPrice : 0);
  // }, 0);

  // const fifteenPercent = totalSales * 0.15;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="uppercase text-xl font-semibold mb-4">All Orders</h1>

      {/* 🔍 Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search with item number for orders..."
          value={searchItemNumber}
          onChange={(e) => setSearchItemNumber(e.target.value)}
          className="uppercase px-4 py-2 border border-gray-300 text-xs w-full max-w-md"
        />
        {searchItemNumber && (
          <p className="mt-2 text-xs text-black font-light">
            Showing orders containing item #{searchItemNumber}
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="uppercase mb-2 text-xs font-semibold text-flag-blue">
        {/* Filtered Sales:{' '}
        <strong className="text-green">
          {formatCurrency(totalSales, filteredOrders[0]?.currency || 'usd')}
        </strong>
        <br />
        15%:{' '}
        <strong className="text-flag-blue">
          {formatCurrency(fifteenPercent, filteredOrders[0]?.currency || 'usd')}
        </strong> */}
        {searchItemNumber && (
          <>
            <br />
            Quantity sold:{' '}
            <strong className="text-flag-red">{filteredItemQuantity}</strong>
          </>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-600 uppercase tracking-wide font-light">
          No matching orders found.
        </p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
