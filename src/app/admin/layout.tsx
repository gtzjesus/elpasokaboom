'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import clsx from 'clsx';
import '../globals.css'; // ⬅️ This MUST be imported here
import AdminGuard from '@/components/auth/AdminGuard';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ClerkProvider>
      <AdminGuard>
        <div className="flex h-screen bg-gray-100">
          <aside className="w-64 bg-gray-900 text-white p-6">
            <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
            <nav className="space-y-4">
              {navItems.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'block px-3 py-2 rounded hover:bg-gray-700',
                    pathname === href && 'bg-gray-700'
                  )}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </AdminGuard>
    </ClerkProvider>
  );
}
