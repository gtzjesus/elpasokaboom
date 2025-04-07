// app/api/search-suggestions/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { Product } from '@/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.toLowerCase();

  try {
    if (query) {
      // Use direct type annotation instead of 'as'
      const products = await client.fetch<Product[]>(
        `*[_type == "product" && name match $searchQuery] {
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
        { searchQuery: `${query}*` } as { searchQuery: string } // Different param name
      );

      return NextResponse.json(products);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
