// components/common/Loader.tsx

/**
 * Loader Component
 *
 * Displays a centered loading spinner. Can be reused across pages or components.
 *
 * @returns {JSX.Element} A full-screen spinner UI.
 */
export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
    </div>
  );
}
