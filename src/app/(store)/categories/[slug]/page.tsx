// app/(store)/categories/[slug]/page.tsx

import { getProductsByCategory } from '@/sanity/lib/products/getProductsByCategory';
import { getAllCategories } from '@/sanity/lib/products/getAllCategories';
import ProductsView from '@/components/products/ProductsView';
import { notFound } from 'next/navigation';
import Header from '@/components/common/header';
import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/sanity/lib/products/getCategoryBySlug';
/**
 * CategoryPage Component
 * Displays products for a specific category based on the 'slug' in the URL.
 * If no products are found, a 404 page is shown.
 *
 * @param {Object} params - The category slug from the URL
 * @returns {JSX.Element} The rendered page showing the category's products.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Await params before destructuring
  const { slug } = await params;

  // Fetch category data by slug
  const category = await getCategoryBySlug(slug);

  const categoryTitle =
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Fireworks';

  const title = category?.title || categoryTitle;
  const description =
    category?.description || 'Fireworks and party supplies category.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://elpasokaboom.com/categories/${slug}`,
      siteName: 'ElPasoKaBoom',
      type: 'website',
    },
    alternates: {
      canonical: `https://elpasokaboom.com/categories/${slug}`,
    },
  };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Resolving the 'params' promise to get the category slug
  const { slug } = await params;

  // Fetch products associated with the category slug
  const products = await getProductsByCategory(slug);

  // Fetch all categories for fallback or additional use in the view
  const categories = await getAllCategories();

  // If no products are found for the category, show a 404 page
  if (!products || products.length === 0) {
    return notFound(); // Built-in method to handle 404 page in Next.js
  }

  // Render the category page with a header, category title, and product grid
  return (
    <div className="container bg-flag-red">
      <Header />
      <h1 className="uppercase text-sm font-light text-center p-5 text-white">
        {/* Format the category title by capitalizing words in the slug */}
        {slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}{' '}
      </h1>

      {/* Display the products for this category using the ProductsView component */}
      <ProductsView products={products} categories={categories} />
    </div>
  );
}
