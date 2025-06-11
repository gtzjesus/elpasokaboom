'use client';

import { useState } from 'react';
import QuickStatsSection from '@/components/dashboard/QuickStatsSection';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import RevenueIntervalToggle from '@/components/dashboard/RevenueIntervalToggle';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { useRecentOrders } from '@/hooks/dashboard/useRecentOrders';
import { useRevenueStats } from '@/hooks/dashboard/useRevenueStats';

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

  if (statsError) {
    return <p className="text-red-500">Error loading stats.</p>;
  }

  return (
    <>
      <QuickStatsSection data={dashboardData} />

      <RecentOrdersTable
        recentOrders={recentOrders}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
      />

      <RevenueIntervalToggle onChangeAction={setInterval} active={interval} />

      {revenueError && <p className="text-red-500">{revenueError}</p>}
      {!revenueLoading && !revenueError && (
        <RevenueBarChart data={revenueData} interval={interval} />
      )}
    </>
  );
}
