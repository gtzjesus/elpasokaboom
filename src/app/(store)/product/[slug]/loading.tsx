// app/(store)/search/loading.tsx

import Loader from '@/components/common/Loader';

/**
 *  Loading UI
 *
 * Displays a centered loading spinner
 *
 * This leverages the default loading UI support for server components.
 *
 * @returns {JSX.Element} A loading spinner component.
 */
export default function Loading() {
  return <Loader />;
}
