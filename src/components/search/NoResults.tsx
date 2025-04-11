import Header from '../common/header';

// components/search/NoResults.tsx
const NoResults = ({ query }: { query: string }) => {
  return (
    <div>
      <Header />
      <h1 className="text-xl font-bold mb-10 mt-20 text-center">
        No results were found for &ldquo;{query}&rdquo;
      </h1>
      <p className="text-gray-600 text-center">
        Please try a different search.
      </p>
    </div>
  );
};

export default NoResults;
