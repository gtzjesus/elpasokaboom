'use client';

import { useDraftModeEnvironment } from 'next-sanity/hooks';
import { useRouter } from 'next/navigation';

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();
  const router = useRouter();

  // only show the disable draftmode button when outside of Presentation
  if (environment !== 'live' && environment !== 'unknown') {
    return null;
  }

  const handleClick = async () => {
    await fetch('/draft-mode/disable');
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-gray-50 px-4 py-2 z-50"
    >
      disable draft mode
    </button>
  );
}
