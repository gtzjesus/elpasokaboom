// app/(store)/search/page.tsx

import Header from '@/components/header';
import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';
import React from 'react';

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams; // Resolve the searchParams promise

  const products = await searchProductsByName(query);

  if (!products.length) {
    return (
      <div className="">
        <Header />
        <h1 className="text-xl font-bold mb-10 mt-16 text-center">
          no results were found for &ldquo;{query}&ldquo;
        </h1>
        <p className="text-gray-600 text-center">
          please try a different search.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h1 className="text-xl font-bold mb-10 mt-16 text-center">
        &ldquo;{query}&ldquo;
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}

export default SearchPage;
