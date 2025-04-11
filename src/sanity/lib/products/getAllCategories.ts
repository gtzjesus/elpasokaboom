import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Category } from '@/types'; // Adjust path if needed

// GROQ Query to fetch all categories
const ALL_CATEGORIES_QUERY = defineQuery(`
  *[_type == 'category'] | order(title asc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    description,
    image
  }
`);

/**
 * Fetches all categories from Sanity
 * @returns {Promise<Category[]>} List of categories
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const result = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    });

    // Ensure we're accessing the correct part of the response (the 'data' field)
    return result?.data ?? []; // Fallback to empty array if no categories found
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
};
