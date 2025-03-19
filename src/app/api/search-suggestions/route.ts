// For Next.js 13+ (app directory)

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query')?.toLowerCase();

  // Mocked suggestions (replace with real data or database queries)
  const allSuggestions = ['jewelry', 'pants', 'shirt'];

  if (query) {
    // Filter suggestions based on the query
    const filteredSuggestions = allSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(query)
    );

    return NextResponse.json({ suggestions: filteredSuggestions });
  }

  return NextResponse.json({ suggestions: allSuggestions });
}
