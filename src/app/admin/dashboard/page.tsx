'use client';

import Link from 'next/link';

const dashboardData = [
  {
    title: 'Total Orders',
    value: 128,
    href: '/admin/orders',
    color: 'bg-blue-500',
  },
  {
    title: 'Active Products',
    value: 42,
    href: '/admin/products',
    color: 'bg-green-500',
  },
  {
    title: 'Pending Orders',
    value: 5,
    href: '/admin/orders',
    color: 'bg-yellow-500',
  },
  {
    title: 'Site Settings',
    value: 'Manage',
    href: '/admin/settings',
    color: 'bg-purple-500',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="bg-black">
      <h1 className="text-2xl font-bold mb-6">Welcome, Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardData.map(({ title, value, href, color }) => (
          <Link key={title} href={href}>
            <div
              className={`rounded-lg p-6 text-white shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer ${color}`}
            >
              <div className="text-sm opacity-80">{title}</div>
              <div className="text-3xl font-bold mt-2">{value}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
