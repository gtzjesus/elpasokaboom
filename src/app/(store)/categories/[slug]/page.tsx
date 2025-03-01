// app/(store)/categories/[slug]/page.tsx

import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/ProductsView';
import { notFound } from 'next/navigation';

// Fetch static parameters for pre-rendering dynamic routes
export async function generateStaticParams() {
  const categories = await getAllCategories(); // Ensure you fetch your categories dynamically

  return categories
    .filter((category) => category.slug?.current) // Only include categories with a valid slug
    .map((category) => ({
      slug: category.slug.current, // Now we are sure slug is defined
    }));
}

// Default function to handle the page rendering
export default async function CategoryPage({
  params,
}: {
  params: { slug: string }; // no Promise wrapper here
}) {
  const { slug } = params;

  // Fetch the category products based on slug
  const products = await getProductsByCategory(slug);

  // Fetch all categories for displaying the category details or fallback info
  const categories = await getAllCategories();

  // If no products found for the category, show a 404 page
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
