// app/(store)/search/page.tsx

import Header from '@/components/header';
import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import React from 'react';

/**
 * SearchPage Component
 * Handles the search results display based on the query provided in the URL parameters.
 * It shows the number of results found for the query and displays the products in a grid format.
 *
 * @param {Object} searchParams - The query parameters from the URL
 * @returns {JSX.Element} The rendered page showing search results or a message if no results are found.
 */
async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  // Resolving the searchParams promise to get the search query
  const { query } = await searchParams;

  // Fetch products that match the search query
  const products = await searchProductsByName(query);

  // Get the number of products found
  const resultCount = products.length;

  // If no products are found, return a message indicating no results
  if (resultCount === 0) {
    return (
      <div className="">
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

  // If products are found, display the search results with the number of items
  return (
    <div>
      <Header />
      <h1 className="text-xl font-bold mb-10 mt-20 text-center">
        &ldquo;{query}&rdquo;({resultCount}
        {resultCount === 1 ? '' : ''})
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}

export default SearchPage;
