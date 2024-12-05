import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getAllCategories = async () => {
  const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == 'category'] | order(name asc)
  `);
  try {
    // use sanityFetch to send the query
    const categories = await sanityFetch({ query: ALL_CATEGORIES_QUERY });

    // return list of categories (empty array if none)
    return categories.data || [];
  } catch (error) {
    console.error('Error fetching all products', error);
    return [];
  }
};
