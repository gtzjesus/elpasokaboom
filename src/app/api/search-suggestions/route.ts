// app/api/search-suggestions/route.ts

import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { Product } from '@/types';

/**
 * GET /api/search-suggestions
 *
 * API Route to fetch product search suggestions based on a user's query.
 * This endpoint is designed to power autosuggestions in a search bar.
 *
 * Query Params:
 * - `query`: The partial or full product name entered by the user.
 *
 * Functionality:
 * - Fetches up to 6 products from Sanity CMS that match the query string.
 * - Filters products by name using a wildcard-style match (`query*`).
 * - Selects key fields from each matched product (id, name, slug, price, image, and categories).
 * - Returns an empty array if no query is provided.
 * - Returns a 500 response if an error occurs during the fetch process.
 *
 * Example Usage:
 * ```
 * /api/search-suggestions?query=shoes
 * ```
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {NextResponse} JSON array of matching products or empty array.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.toLowerCase();

  try {
    if (query) {
      // Fetch up to 6 matching products from Sanity
      const products = await client.fetch<Product[]>(
        `*[_type == "product" && name match $searchQuery]{
          _id,
          name,
          "slug": slug.current,
          price,
          "image": image.asset->url,
          "categories": categories[]->{
            _id,
            title
          }
        }[0..5]`,
        { searchQuery: `${query}*` } // Wildcard match for partial search
      );

      return NextResponse.json(products);
    }

    // If no query provided, return empty array
    return NextResponse.json([]);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
