import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Category } from '@/types';

// GROQ: Fetch all categories ordered by title
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
 * Fetch all categories from Sanity.
 *
 * @returns {Promise<Category[]>} List of category objects
 */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const result = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    });

    // If result is already an array, return it; else fallback to empty
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
};
