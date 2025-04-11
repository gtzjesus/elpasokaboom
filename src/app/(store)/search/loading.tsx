// app/(store)/search/loading.tsx

import Loader from '@/components/common/Loader';

/**
 * SearchPage Loading UI
 *
 * Displays a centered loading spinner while the search results are being fetched.
 * Automatically shown by Next.js App Router when the `SearchPage` is loading asynchronously.
 *
 * This leverages the default loading UI support for server components.
 *
 * @returns {JSX.Element} A loading spinner component.
 */
export default function Loading() {
  return <Loader />;
}
