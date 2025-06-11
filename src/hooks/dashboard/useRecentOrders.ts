// hooks/useRecentOrders.ts
import useSWR from 'swr';

export type RecentOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string | null;
  totalPrice: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRecentOrders() {
  const {
    data = [] as RecentOrder[],
    isLoading,
    error,
  } = useSWR('/api/recent-orders', fetcher, {
    refreshInterval: 5000,
  });

  return {
    recentOrders: data,
    ordersLoading: isLoading,
    ordersError: error,
  };
}
