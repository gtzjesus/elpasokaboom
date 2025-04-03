import { Product } from 'sanity.types';
import { client } from '../client';

export const searchProductsByName = async (
  searchParam: string
): Promise<Product[]> => {
  try {
    const products = await client.fetch(
      `
      *[_type == "product" && name match $searchParam] {
        _id,
        _type,
        _createdAt,
        _updatedAt,
        _rev,
        name,
        slug,
        price,
        stock,
        image
      }
    `,
      { searchParam: `${searchParam}*` }
    );

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
