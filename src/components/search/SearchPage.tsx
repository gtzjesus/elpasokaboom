// components/search/SearchPage.tsx

import NoResults from '@/components/search/NoResults';
import SearchResults from '@/components/search/SearchResults';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import { Product, SearchPageProps } from '@/types';

/**
 * SearchPage Component
 *
 * This component is responsible for rendering the search results based on the user's search query (`q`).
 * It fetches the products that match the query using the `searchProductsByName` function and displays them
 * in the `SearchResults` component. If no products are found, it renders the `NoResults` component.
 *
 * It also manages the asynchronous fetching of product data based on the provided search parameters.
 * The `SearchPage` component expects the `searchParams` (containing the search query `q`) to be passed
 * to it. The data is fetched asynchronously, and once the data is fetched, it renders the appropriate results.
 *
 * @param {Object} props The props passed to the `SearchPage` component.
 * @param {SearchPageProps} props.searchParams The search parameters containing the query string `q`.
 *
 * @returns {JSX.Element} The rendered component based on the search results.
 */
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = searchParams;

  // Fetching the products based on the search query `q`
  const products: Product[] = await searchProductsByName(q);

  // Calculating the number of search results
  const resultCount = products.length;

  // If no results are found, render the "No Results" component
  if (resultCount === 0) {
    return <NoResults query={q} />;
  }

  // If results are found, render the search results
  return (
    <SearchResults query={q} resultCount={resultCount} products={products} />
  );
};

export default SearchPage;
