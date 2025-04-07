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
  categories?: {
    _id: string;
    title: string;
  }[];
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
    debouncedFetchSuggestions(value);
    setSelectedIndex(-1);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${query}`;
    }
  };

  // Clear the input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setNoResults(false);
  };

  // Handle selection of suggestion
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
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    }
  };

  // Focus input when search menu opens
  useEffect(() => {
    if (isSearchMenuOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchMenuOpen]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 relative">
      <form onSubmit={handleSearchSubmit} className="flex flex-col w-full">
        <h1
          className={`text-sm font-semibold mb-2 ${scrolled ? 'text-black' : 'text-black'}`}
        >
          what are you looking for?
        </h1>
        <div className="relative flex items-center w-full bg-white shadow-md rounded-lg">
          <input
            ref={inputRef}
            type="text"
            placeholder=""
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full p-4 text-gray-800 pr-10 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
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
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Loader */}
      {loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white p-4 rounded-b-lg shadow-lg">
          <Loader />
        </div>
      )}

      {/* Suggestions Dropdown */}
      {(suggestions.length > 0 || loading) && (
        <ul className="mt-4 z-20 overflow-auto shadow-lg border">
          {loading ? (
            <li className="p-4 flex justify-center">
              <Loader />
            </li>
          ) : (
            suggestions.map((product, index) => (
              <li
                key={product._id}
                onClick={() => handleSelectSuggestion(product)}
                className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer gap-3 ${
                  selectedIndex === index ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  {product.image && (
                    <div className="relative h-20 w-20">
                      <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill" // Ensure the image fills the parent container
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="flex ml-4">
                    <p className="uppercase text-xs font-semibold ">
                      {product.name}
                    </p>
                    {product.categories && product.categories.length > 0 && (
                      <p className="text-xs text-gray-300 ml-10 ">
                        {product.categories.map((c) => c.title).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {/* No Results Message */}
      {noResults && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-white rounded-b-lg shadow-lg text-sm">
          No products found. Try different keywords.
        </div>
      )}
    </div>
  );
};

export default SearchBar;
