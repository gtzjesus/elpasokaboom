// app/(store)/categories/[slug]/page.tsx

import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/ProductsView';
import { notFound } from 'next/navigation';
import Header from '@/components/header';

// Default function to handle page rendering
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Return 'Promise' wrapped params
}) {
  const { slug } = await params; // Await the resolved 'params'

  // Fetch the products based on the slug
  const products = await getProductsByCategory(slug);

  // Fetch all categories to show fallback information
  const categories = await getAllCategories();

  // If no products are found, return a 404 page
  if (!products || products.length === 0) {
    return notFound(); // Built-in method to handle 404 page in Next.js
  }

  return (
    <div>
      <Header />

      <div className="">
        <div className="">
          <h1 className="text-2xl font-bold mb-6 mt-14 text-center">
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
    </div>
  );
}
