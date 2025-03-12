// app/(store)/search/page.tsx

import Header from '@/components/header';
import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';

interface SearchPageProps {
  searchParams: { q: string };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams.q;

  // Fetch products based on the query parameter
  const products = await searchProductsByName(query);

  const resultCount = products.length;

  if (resultCount === 0) {
    return (
      <div>
        <Header />
        <h1 className="text-xl font-bold mb-10 mt-20 text-center">
          No results were found for &ldquo;{query}&rdquo;
        </h1>
        <p className="text-gray-600 text-center">
          Please try a different search.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h1 className="text-xl font-bold mb-10 mt-20 text-center">
        &ldquo;{query}&rdquo; ({resultCount} results)
      </h1>
      <ProductGrid products={products} />
    </div>
  );
};

export default SearchPage;
