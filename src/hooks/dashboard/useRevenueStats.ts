import useSWR from 'swr';

type RevenuePoint = {
  date: string;
  revenue: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRevenueStats(
  interval: 'daily' | 'weekly' | 'monthly' = 'daily'
) {
  const { data, error, isLoading } = useSWR<RevenuePoint[]>(
    `/api/revenue?interval=${interval}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  return {
    revenueData: data || [],
    loading: isLoading,
    error: error ? 'Failed to load revenue data' : null,
  };
}
