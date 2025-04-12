import Header from '../common/header';

/**
 * NoResults component displays a message when no search results are found.
 * It shows a prompt to the user to try a different search query.
 *
 * @param {Object} props
 * @param {string} props.query - The search query that was used.
 *
 * @returns {JSX.Element} The rendered NoResults component.
 */
const NoResults = ({ query }: { query: string }) => {
  return (
    <div>
      {/* Header component for consistent layout */}
      <Header />

      {/* No results message */}
      <h1 className="text-xl font-bold mb-10 mt-20 text-center">
        No results were found for &ldquo;{query}&rdquo;
      </h1>

      {/* Suggestion to try a different search */}
      <p className="text-gray-600 text-center">
        Please try a different search.
      </p>
    </div>
  );
};

export default NoResults;
