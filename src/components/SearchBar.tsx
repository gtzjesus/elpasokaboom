import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  scrolled: boolean;
  isSearchMenuOpen: boolean; // Pass this prop to control when to focus the input
}

const SearchBar: React.FC<SearchBarProps> = ({
  scrolled,
  isSearchMenuOpen,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null); // Create a reference for the input field

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

  // Clear the input
  const handleClear = () => {
    setQuery('');
  };

  // Focus input when search menu opens
  useEffect(() => {
    if (isSearchMenuOpen && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input when the search menu opens
    }
  }, [isSearchMenuOpen]); // Runs when the search menu opens

  return (
    <div className="w-full max-w-xl mx-auto ">
      <form onSubmit={handleSearchSubmit} className="flex flex-col w-full">
        <h1
          className={`text-sm font-semibold mb-2 ${scrolled ? 'text-black' : 'text-black'}`}
        >
          What are you looking for?
        </h1>
        <div className="relative flex items-center w-full bg-white shadow-md">
          <input
            ref={inputRef}
            type="text"
            placeholder=""
            value={query}
            onChange={handleChange}
            className="w-full p-4 text-gray-800 border-b-2 border-white focus:border-white focus:outline-none transition-all duration-300 pr-10 text-base" // text-base ensures font size is >= 16px
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round" // Corrected here
                  strokeLinejoin="round" // Corrected here
                  strokeWidth="2" // Corrected here
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
