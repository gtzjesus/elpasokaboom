// app/(store)/categories/[slug]/page.tsx

import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/ProductsView';
import { notFound } from 'next/navigation';

// Fetching static params for dynamic pages
export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug.current, // Use slug for each category
  }));
}

// CategoryPage component handling dynamic page rendering
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Returning Promise here
}) {
  const { slug } = await params; // Wait for params to resolve

  // Fetch the category products based on the slug
  const products = await getProductsByCategory(slug);

  // Fetch all categories for displaying category information
  const categories = await getAllCategories();

  // If no products found for the category, show 404 page
  if (!products || products.length === 0) {
    return notFound(); // Use built-in Next.js method for 404
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
        {/* Display products for this category */}
        <ProductsView products={products} categories={categories} />
      </div>
    </div>
  );
}
