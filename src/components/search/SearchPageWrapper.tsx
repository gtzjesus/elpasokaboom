import SearchPage from '@/components/search/SearchPage'; // ✅ not from the route file

const SearchPageWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  return <SearchPage searchParams={resolvedSearchParams} />;
};

export default SearchPageWrapper;
