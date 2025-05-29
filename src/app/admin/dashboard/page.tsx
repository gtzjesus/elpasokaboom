'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    totalOrders: 0,
    activeProducts: 0,
    totalRevenue: 0,
    activeCustomers: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/dashboard-data');
      const json = await res.json();
      setData(json);
    }

    fetchData();
  }, []);

  const dashboardData = [
    {
      title: 'Paid Orders',
      value: data.totalOrders,
      href: '/admin/orders',
      color: '#F1F0E1', // <-- use raw hex
    },
    {
      title: ' Products',
      value: data.activeProducts,
      href: '/admin/products',
      color: '#506385', // <-- use raw hex
    },
    {
      title: 'Total',
      value:
        data.totalRevenue != null
          ? `$${data.totalRevenue.toFixed(0)}`
          : '$0.00',
      href: '/admin/finance',
      color: '#506385', // <-- use raw hex
    },
    {
      title: ' Customers',
      value: data.activeCustomers,
      href: '/admin/customers',
      color: '#F1F0E1', // <-- use raw hex
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {dashboardData.map(({ title, value, href, color }) => (
          <Link key={title} href={href}>
            <div
              className=" px-4 py-8 text-black  cursor-pointer"
              style={{ backgroundColor: color }}
            >
              <div className="uppercase text-xs font-light text-gray-800">
                {title}
              </div>
              <div className="uppercase text-6xl font-light text-gray-800 pt-10">
                {value}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
