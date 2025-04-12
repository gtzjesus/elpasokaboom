'use client';

import { useDraftModeEnvironment } from 'next-sanity/hooks';
import { useRouter } from 'next/navigation';

/**
 * DisableDraftMode component displays a fixed button that, when clicked,
 * disables Sanity's draft mode and refreshes the current route.
 *
 * This button is only rendered when the environment is either `live` or `unknown`.
 *
 * @component
 * @example
 * <DisableDraftMode />
 */
export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();
  const router = useRouter();

  // Don't render the button inside the Presentation environment
  if (environment !== 'live' && environment !== 'unknown') {
    return null;
  }

  /**
   * Handles disabling draft mode by calling the API
   * and refreshing the route.
   */
  const handleClick = async () => {
    try {
      await fetch('/draft-mode/disable');
      router.refresh();
    } catch (error) {
      console.error('Failed to disable draft mode:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-gray-50 px-4 py-2 z-50 border rounded shadow text-sm font-semibold lowercase hover:bg-gray-100 transition"
    >
      disable draft mode
    </button>
  );
}
