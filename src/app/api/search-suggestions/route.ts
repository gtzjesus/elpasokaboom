// app/api/search-suggestions/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.toLowerCase();
  const isDefault = url.searchParams.get('default') === 'true';

  try {
    if (isDefault) {
      // Return trending/popular products (adjust the query as needed)
      const trendingProducts = await client.fetch(
        `*[_type == "product"] | order(_createdAt desc)[0..5] {
          _id,
          name,
          "slug": slug.current,
          price,
          "image": image.asset->url
        }`
      );
      return NextResponse.json(trendingProducts);
    }

    if (query) {
      const products = await client.fetch(
        `*[_type == "product" && name match $query] {
          _id,
          name,
          "slug": slug.current,
          price,
          "image": image.asset->url
        }[0..5]`, // Limit to 5 suggestions
        { query: `${query}*` }
      );
      return NextResponse.json(products);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json([], { status: 500 });
  }
}
