import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Product } from '@/types'; // ✅ Make sure you're importing from your updated types

export const getProductsByCategory = async (
  categorySlug: string
): Promise<Product[]> => {
  const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
    *[_type == 'product' && references(*[_type == 'category' && slug.current == $categorySlug]._id)] | order(name asc)
  `);

  try {
    const result = await sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: { categorySlug },
    });

    // ✅ Ensure we return a properly typed array
    return (result.data ?? []) as Product[];
  } catch (error) {
    console.error('Error fetching products by category', error);
    return [];
  }
};
