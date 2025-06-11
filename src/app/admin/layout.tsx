'use client';

import { ClerkProvider } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import clsx from 'clsx';
import '../globals.css';
import AdminGuard from '@/components/auth/AdminGuard';
import { Toaster } from 'sonner';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ClerkProvider>
      <AdminGuard>
        <div className="flex h-screen" style={{ backgroundColor: '#101015' }}>
          {/* Sidebar */}
          <aside
            className={clsx(
              'fixed inset-y-0 left-0 z-30 w-64  bg-black text-white p-6 transform transition-transform duration-300 ease-in-out',
              {
                '-translate-x-full': !sidebarOpen,
                'translate-x-0': sidebarOpen,
                'md:translate-x-0 md:static md:inset-auto': true,
              }
            )}
          >
            <nav className="space-y-4">
              {navItems.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    'block px-3 py-2  hover:bg-black-100',
                    pathname === href && 'bg-gray-900'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  {name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile header */}
            <header className="md:hidden flex justify-between items-center style={{ backgroundColor: '#101015' }} text-white p-4">
              <h1 className="uppercase font-light text-md">Admin HQ</h1>

              {/* Hamburger Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
                className="focus:outline-none focus:ring-2 focus:ring-white "
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </header>
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={Infinity} // optional global default
            />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </div>
      </AdminGuard>
    </ClerkProvider>
  );
}
