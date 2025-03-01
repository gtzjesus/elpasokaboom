// app/(store)/categories/[slug]/page.tsx

import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/ProductsView';
import { notFound } from 'next/navigation';

// Default function to handle page rendering
export default async function CategoryPage({
  params,
}: {
  params: { slug: string }; // This is now no longer wrapped in a Promise
}) {
  const { slug } = params; // Directly destructure slug from params

  // Fetch the products based on the slug
  const products = await getProductsByCategory(slug);

  // Fetch all categories to show fallback information
  const categories = await getAllCategories();

  // If no products are found, return a 404 page
  if (!products || products.length === 0) {
    return notFound(); // Built-in method to handle 404 page in Next.js
  }

  return (
    <div className="flex flex-col items-center justify-top min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {slug
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}{' '}
          Collection
        </h1>
        {/* Display the products for this category */}
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
