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

    // Check if the result exists and has the data field
    if (!result?.data || result.data.length === 0) {
      console.warn('No categories found or empty response from Sanity.');
      return []; // Return an empty array if no data is found
    }

    // Return the categories data
    if (!Array.isArray(result)) {
      console.warn('Unexpected response format from Sanity:', result);
      return [];
    }
    return result;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return []; // Fallback to an empty array if an error occurs
  }
};
