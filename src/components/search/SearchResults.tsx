// components/search/SearchResults.tsx

import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types';
import Header from '../common/header';

/**
 * `SearchResults` is a component that displays the results of a product search.
 * It shows the search query, the number of results, and a grid of products that match the search query.
 *
 * @param {string} query - The search query entered by the user.
 * @param {number} resultCount - The total number of products that match the search query.
 * @param {Product[]} products - The list of products that match the search query.
 *
 * @returns {JSX.Element} The SearchResults component, displaying the search query, result count, and a grid of products.
 */
const SearchResults = ({
  query,
  resultCount,
  products,
}: {
  query: string;
  resultCount: number;
  products: Product[];
}) => {
  return (
    <div className="container bg-white">
      {/* Header section */}
      <Header />

      {/* Search query and result count display */}
      <h1 className="uppercase text-sm font-light text-center p-5 text-gray-800">
        &ldquo;{query}&rdquo; ({resultCount})
      </h1>

      {/* Product grid display */}
      <ProductGrid products={products} />
    </div>
  );
};

export default SearchResults;
