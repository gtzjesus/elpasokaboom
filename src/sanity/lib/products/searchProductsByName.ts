import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const searchProductsByName = async (searchParam: string) => {
  let query;

  if (searchParam === '*') {
    // Fetch all products if the search parameter is '*'
    console.log('Fetching all products...');
    query = defineQuery(`
      *[_type == 'product'] | order(name asc)
    `);
  } else {
    // Search products by name if the search parameter is a specific term
    console.log('Fetching products for:', searchParam);
    query = defineQuery(`
      *[
        _type == 'product' && name match $searchParam
      ] | order(name asc)
    `);
  }

  try {
    console.log('Sanity query:', query);
    const products = await sanityFetch({
      query,
      params: searchParam === '*' ? {} : { searchParam: `${searchParam}*` }, // Only append wildcard for non '*' queries
    });

    console.log('Fetched products:', products.data);
    // Return list of products (empty array if none)
    return products.data || [];
  } catch (error) {
    console.error('Error fetching products by name', error);
    return [];
  }
};
