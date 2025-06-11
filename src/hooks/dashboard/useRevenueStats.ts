import useSWR from 'swr';

type RevenuePoint = {
  date: string;
  revenue: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRevenueStats() {
  const { data, error, isLoading } = useSWR<RevenuePoint[]>(
    '/api/revenue',
    fetcher,
    {
      refreshInterval: 5000, // ✅ auto-refresh every 5 seconds
    }
  );

  return {
    revenueData: data || [],
    loading: isLoading,
    error: error ? 'Failed to load revenue data' : null,
  };
}
