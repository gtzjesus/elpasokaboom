// components/SearchBar.tsx
import { useState } from 'react';

interface SearchBarProps {
  scrolled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ scrolled }) => {
  const [query, setQuery] = useState('');

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to the search results page or trigger an API search
      window.location.href = `/search?q=${query}`;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col items-center w-full"
      >
        <h1
          className={`text-2xl font-semibold mb-4 ${scrolled ? 'text-black' : 'text-white'}`}
        >
          What are you looking for?
        </h1>
        <div className="flex items-center w-full bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={handleChange}
            className="w-full p-4 text-lg text-gray-800 border-2 border-transparent rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className={`p-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none ${scrolled ? 'text-black' : 'text-white'}`}
          >
            <span className="sr-only">Search</span>
            {/* You can place an icon here for better UX */}
            🔍
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
