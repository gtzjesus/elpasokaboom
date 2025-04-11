// components/search/SearchPageWrapper.tsx

import SearchPage from '@/components/search/SearchPage'; // ✅ not from the route file

/**
 * SearchPageWrapper Component
 *
 * This component serves as a wrapper for the `SearchPage` component. It is responsible for resolving
 * the `searchParams` (which is a `Promise`) and passing the resolved value to the `SearchPage` component
 * once the promise has been fulfilled.
 *
 * It ensures that the `SearchPage` component receives the necessary search parameters asynchronously,
 * handling the potential delay before the data is available. By using a wrapper, we can manage async data
 * resolution and keep the `SearchPage` focused solely on rendering.
 *
 * The main purpose of this wrapper is to manage the async flow of the search query parameters (`q`),
 * resolving the promise before passing the data to the `SearchPage` for rendering.
 *
 * @param {Object} props The props passed to the wrapper component.
 * @param {Promise<{ q: string }>} props.searchParams A promise that resolves with the search query parameter.
 *
 * @returns {JSX.Element} The rendered `SearchPage` component, with resolved search parameters.
 */
const SearchPageWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) => {
  // Resolving the searchParams promise to get the actual search query
  const resolvedSearchParams = await searchParams;

  // Passing the resolved searchParams to the SearchPage component for rendering
  return <SearchPage searchParams={resolvedSearchParams} />;
};

export default SearchPageWrapper;
