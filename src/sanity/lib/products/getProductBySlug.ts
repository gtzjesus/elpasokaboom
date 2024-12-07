import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getProductBySlug = async (slug: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(`
      *[_type == 'product' && slug.current == $slug] | order(name asc)
    `);
  try {
    const result = await sanityFetch({
      query: PRODUCT_BY_ID_QUERY,
      params: { slug },
    });

    // Return the first product found or null if not found
    return result.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching product by slug', error);
    return null;
  }
};
