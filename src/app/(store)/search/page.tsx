// app/(store)/search/page.tsx

import Header from '@/components/header';
import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';
  return {
    title: `Search results for "${query}"`,
    description: `Results for "${query}" search in Nextcommerce.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q || '';
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
        Results for &ldquo;{query}&rdquo; ({resultCount} results)
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}
