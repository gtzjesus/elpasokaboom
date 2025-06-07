'use client';

import QuickStatsSection from '@/components/dashboard/QuickStatsSection';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useRecentOrders } from '@/hooks/useRecentOrders';

export default function AdminDashboardPage() {
  const { dashboardData, statsError } = useDashboardStats();
  const { recentOrders, ordersLoading, ordersError } = useRecentOrders();

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
    </>
  );
}
