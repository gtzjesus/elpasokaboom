// app/(store)/search/page.tsx

import SearchPageWrapper from '@/components/search/SearchPageWrapper';

/**
 * SearchPage Component
 *
 * This is the main entry point for the `/search` route. It receives the search query parameters
 * as a `Promise` and passes them to the `SearchPageWrapper` component, which handles the
 * logic of fetching products based on the query and rendering the results.
 *
 * The `SearchPageWrapper` is used to resolve the query parameters asynchronously and ensures that
 * the search page is rendered with the correct data once the promise resolves.
 *
 * This approach separates the data-fetching logic from the page itself and ensures that the page
 * is rendered with the proper state once the search parameters are resolved.
 *
 * @param {Object} props The props passed to the page component.
 * @param {Promise<{ q: string }>} props.searchParams A promise that resolves with the search query parameter.
 *
 * @returns {JSX.Element} The rendered SearchPageWrapper component, which displays the search results.
 */
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  return <SearchPageWrapper searchParams={searchParams} />;
}
