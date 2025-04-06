import { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import Loader from '../common/Loader';
import Image from 'next/image';

interface ProductSuggestion {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
}

interface SearchBarProps {
  scrolled: boolean;
  isSearchMenuOpen: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  scrolled,
  isSearchMenuOpen,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update fetchSuggestions
  const fetchSuggestions = async (query: string) => {
    try {
      if (query.trim()) {
        setLoading(true);
        const response = await axios.get('/api/search-suggestions', {
          params: { query },
        });

        setSuggestions(response.data || []);
        setNoResults(response.data.length === 0);
      } else {
        // Fetch default suggestions when query is empty
        const response = await axios.get('/api/search-suggestions', {
          params: { default: 'true' },
        });
        setSuggestions(response.data || []);
        setNoResults(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setNoResults(false);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the API call function
  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    []
  );

  useEffect(() => {
    return () => debouncedFetchSuggestions.cancel();
  }, [debouncedFetchSuggestions]);

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Call the debounced fetchSuggestions function
    debouncedFetchSuggestions(value);

    setSelectedIndex(-1); // Reset selected index when typing
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
    setSuggestions([]);
    setNoResults(false); // Reset noResults state when clearing input
  };

  // Handle selection of suggestion
  // Change the parameter type to accept ProductSuggestion
  const handleSelectSuggestion = (suggestion: ProductSuggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]);
    window.location.href = `/product/${suggestion.slug}`;
  };

  // Handle key navigation through suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(suggestions.length - 1, prevIndex + 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (query.trim()) {
        // Submit the current query if no suggestion is selected
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  // Focus input when search menu opens
  useEffect(() => {
    if (isSearchMenuOpen && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input when the search menu opens
    }
  }, [isSearchMenuOpen]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="flex flex-col w-full">
        <h1
          className={`text-sm font-semibold mb-2 ${scrolled ? 'text-black' : 'text-black'}`}
        >
          what are you looking for?
        </h1>
        <div className="relative flex items-center w-full bg-white shadow-md">
          <input
            ref={inputRef}
            type="text"
            placeholder=""
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Listen for key events
            className="w-full p-4 text-gray-800 border-b-2 border-white focus:border-white focus:outline-none transition-all duration-300 pr-10 text-base"
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Loader */}
      {loading && <Loader />}

      {/* Display No Results Message */}
      {noResults && !loading && (
        <div className="uppercase text-xs font-semibold mb-2 mt-4 ${scrolled ? 'text-black' : 'text-black '">
          sorry, we couldn&lsquo;t find any matching results for your query.
        </div>
      )}

      {/* Suggestions Dropdown */}
      {(suggestions.length > 0 || loading) && (
        <ul className="absolute w-full mt-4 z-20 max-h-60 overflow-auto bg-white shadow-lg">
          {loading ? (
            <li className="p-2 text-sm">Loading...</li>
          ) : (
            suggestions.map((product, index) => (
              <li
                key={product._id}
                onClick={() => handleSelectSuggestion(product)}
                className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedIndex === index ? 'bg-gray-200' : ''
                }`}
              >
                {product.image && (
                  <Image
                    className="object-cover"
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 728px) 90vw, (max-width: 1200px) 40vw, 23vw"
                    onError={(e) => {
                      console.error('Image load error:', e);
                      // Consider adding a fallback image here
                    }}
                  />
                )}
                {noResults && !loading && query.trim() && (
                  <div className="text-sm p-2">
                    No products found. Try different keywords.
                  </div>
                )}
                <div>
                  <p className="text-md font-light uppercase">{product.name}</p>
                  {/* <p className="text-xs text-gray-500">
                    ${product.price.toFixed(2)}
                  </p> */}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
