// This is the actual route file
import SearchPageWrapper from '@/components/search/SearchPageWrapper';

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  return <SearchPageWrapper searchParams={searchParams} />;
}
