'use client';

import QuickStatsSection from '@/components/dashboard/QuickStatsSection';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { useRecentOrders } from '@/hooks/dashboard/useRecentOrders';
import { useRevenueStats } from '@/hooks/dashboard/useRevenueStats';
import RevenueIntervalToggle from '@/components/dashboard/RevenueIntervalToggle';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const { dashboardData, statsError } = useDashboardStats();
  const { recentOrders, ordersLoading, ordersError } = useRecentOrders();
  const {
    revenueData,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueStats(interval);

  // 🔁 Track last order to detect new ones
  const lastOrderId = useRef<string | null>(null);

  useEffect(() => {
    if (recentOrders && recentOrders.length > 0) {
      const latest = recentOrders[0];

      if (lastOrderId.current && latest.id !== lastOrderId.current) {
        toast.custom(
          (t) => (
            <div
              onClick={() => {
                window.location.href = `/admin/orders/${latest.orderNumber || ''}`;
                toast.dismiss(t);
              }}
              className="cursor-pointer bg-green-700 text-white p-4 rounded shadow-lg transition-all"
            >
              <div className="text-sm font-light uppercase">
                New Order from {latest.customerName || 'Customer'}!
              </div>
              <div className="text-xs font-medium mt-1">
                Order #{latest.orderNumber || '—'} • ${latest.totalPrice}
              </div>
            </div>
          ),
          {
            duration: Infinity,
          }
        );
      }

      // Update last known order ID
      lastOrderId.current = latest.id;
    }
  }, [recentOrders]);

  if (statsError) {
    return <p className="text-red-500">Error loading stats.</p>;
  }

  return (
    <>
      <RevenueIntervalToggle onChangeAction={setInterval} active={interval} />;
      {revenueError && <p className="text-red-500">{revenueError}</p>}
      {!revenueLoading && !revenueError && (
        <RevenueBarChart data={revenueData} interval={interval} />
      )}
      <QuickStatsSection data={dashboardData} />
      <RecentOrdersTable
        recentOrders={recentOrders}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
      />
    </>
  );
}
