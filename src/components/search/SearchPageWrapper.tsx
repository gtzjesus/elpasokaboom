import SearchPage from '@/app/(store)/search/page';

const SearchPageWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  return <SearchPage searchParams={resolvedSearchParams} />;
};

export default SearchPageWrapper;
