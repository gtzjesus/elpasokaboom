// hooks/useRecentOrders.ts
import useSWR from 'swr';

export type RecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string | null;
  totalPrice: number;
};

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  });

export function useRecentOrders() {
  const { data, isLoading, error } = useSWR<RecentOrder[]>(
    '/api/recent-orders',
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  // ✅ Always return an array (empty if data is undefined or not an array)
  const recentOrders = Array.isArray(data) ? data : [];

  return {
    recentOrders,
    ordersLoading: isLoading,
    ordersError: error,
  };
}
