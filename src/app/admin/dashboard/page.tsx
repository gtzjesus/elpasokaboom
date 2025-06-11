'use client';

import QuickStatsSection from '@/components/dashboard/QuickStatsSection';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { useRecentOrders } from '@/hooks/dashboard/useRecentOrders';
import { useRevenueStats } from '@/hooks/dashboard/useRevenueStats';

export default function AdminDashboardPage() {
  const { dashboardData, statsError } = useDashboardStats();
  const { recentOrders, ordersLoading, ordersError } = useRecentOrders();
  const {
    revenueData,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueStats();

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
      {revenueError && <p className="text-red-500">{revenueError}</p>}
      {!revenueLoading && !revenueError && (
        <RevenueBarChart data={revenueData} />
      )}
    </>
  );
}
