'use client';

import QuickStatsSection from '@/components/dashboard/QuickStatsSection';
import RecentOrdersTable from '@/components/dashboard/RecentOrdersTable';
import RevenueBarChart from '@/components/dashboard/RevenueBarChart';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { useRecentOrders } from '@/hooks/dashboard/useRecentOrders';
import { useRevenueStats } from '@/hooks/dashboard/useRevenueStats';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [interval, setInterval] = useState<'daily' | 'weekly'>('daily');
  const { dashboardData, statsError } = useDashboardStats();
  const { recentOrders, ordersLoading, ordersError } = useRecentOrders();
  const {
    revenueData,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueStats(interval); // ✅ Pass state!

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
      <div className="flex items-center justify-between mb-2 mt-6">
        <h2 className="text-sm font-bold uppercase tracking-widest "></h2>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setInterval('daily')}
            className={`px-2 py-1 uppercase text-xs  font-semibold text-center ${
              interval === 'daily'
                ? 'bg-green-700 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Daily
          </button>

          <button
            type="button"
            onClick={() => setInterval('weekly')}
            className={`px-2 py-1 uppercase text-xs  font-semibold text-center  ${
              interval === 'weekly'
                ? 'bg-green-700 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>
      {revenueError && <p className="text-red-500">{revenueError}</p>}
      {!revenueLoading && !revenueError && (
        <RevenueBarChart data={revenueData} interval={interval} />
      )}
    </>
  );
}
