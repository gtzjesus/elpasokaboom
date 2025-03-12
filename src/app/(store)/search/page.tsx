// app/(store)/search/page.tsx

import Header from '@/components/header';
import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
// interface SearchPageProps {
//   searchParams: { q: string };
// }

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const { q } = searchParams;

  // Fetch products based on the query parameter
  const products = await searchProductsByName(q);
  const resultCount = products.length;

  if (resultCount === 0) {
    return (
      <div>
        <Header />
        <h1 className="text-xl font-bold mb-10 mt-20 text-center">
          No results were found for &ldquo;{q}&rdquo;
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
        &ldquo;{q}&rdquo; ({resultCount} results)
      </h1>
      <ProductGrid products={products} />
    </div>
  );
};

// Since we're using a server component, we can fetch data directly within the component
const SearchPageWrapper = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const resolvedParams = await Promise.resolve(searchParams); // Resolving searchParams

  // Pass resolved params to the SearchPage component
  return <SearchPage searchParams={resolvedParams} />;
};

export default SearchPageWrapper;
