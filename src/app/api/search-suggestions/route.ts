// app/api/search-suggestions/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { Product, ProductSearchParams } from '@/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.toLowerCase();

  try {
    if (query) {
      // Create params with proper typing
      const params: ProductSearchParams = {
        query: `${query}*`,
      };

      // Use direct type annotation instead of 'as'
      const products = await client.fetch<Product[]>(
        `*[_type == "product" && name match $query] {
          _id,
          _type,
          name,
          "slug": slug.current,
          price,
          "image": image.asset->url
        }[0..5]`,
        params // No type assertion needed
      );

      return NextResponse.json(products);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
