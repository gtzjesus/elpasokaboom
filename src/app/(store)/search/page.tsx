import Header from '@/components/common/header';
import ProductGrid from '@/components/products/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import { Product } from '@/types';

const SearchPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const { q } = searchParams;

  console.log('Search Query: ', q); // Log the query parameter

  // Fetch products based on the query parameter
  const products: Product[] = await searchProductsByName(q);
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
    <div className="container bg-white">
      <Header />
      <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
        &ldquo;{q}&rdquo; ({resultCount})
      </h1>
      <ProductGrid products={products} /> {/* Render the products */}
    </div>
  );
};

const SearchPageWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>; // Accepting a Promise here
}) => {
  // Resolve the Promise before passing to SearchPage
  const resolvedSearchParams = await searchParams;

  console.log('Resolved Search Params: ', resolvedSearchParams); // Log the resolved search parameters

  // Pass resolvedParams to the SearchPage component
  return <SearchPage searchParams={resolvedSearchParams} />;
};

// Default export of the wrapper
export default SearchPageWrapper;
