// components/RecentOrdersTable.tsx
import React from 'react';
import { RecentOrder } from '@/hooks/dashboard/useRecentOrders';
/* eslint-disable  @typescript-eslint/no-explicit-any */
type RecentOrdersTableProps = {
  recentOrders: RecentOrder[];
  ordersLoading: boolean;
  ordersError: any;
};

export default function RecentOrdersTable({
  recentOrders,
  ordersLoading,
  ordersError,
}: RecentOrdersTableProps) {
  if (ordersLoading) {
    return <p>Loading orders...</p>;
  }

  if (ordersError) {
    return <p className="text-red-500">Error loading orders.</p>;
  }

  return (
    <div className="grid grid-cols-1 py-4 ">
      <h2
        className="uppercase text-sm font-extrabold pb-3 tracking-widest"
        style={{
          color: '#F1F0E1',
          textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        Latest orders
      </h2>

      <div className="overflow-x-auto">
        <table
          className="min-w-full"
          style={{ backgroundColor: '#F1F0E1', color: '#333' }} // base text color
        >
          <thead className="" style={{ backgroundColor: '#aabee0' }}>
            <tr className="uppercase text-xs">
              <th className="text-left p-2">Order #</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="text-xs font-light border-t">
                <td className="p-2 font-bold">{order.orderNumber}</td>
                <td className="p-2">{order.customerName}</td>
                <td className="p-2">
                  {order.date ? new Date(order.date).toLocaleDateString() : '—'}
                </td>
                <td className="p-2 font-bold" style={{ color: '#2E8B57' }}>
                  ${order.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
