// components/search/SearchPage.tsx
import NoResults from '@/components/search/NoResults';
import SearchResults from '@/components/search/SearchResults';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import { Product } from '@/types';

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const { q } = searchParams;
  const products: Product[] = await searchProductsByName(q);
  const resultCount = products.length;

  if (resultCount === 0) {
    return <NoResults query={q} />;
  }

  return (
    <SearchResults query={q} resultCount={resultCount} products={products} />
  );
};

export default SearchPage;
