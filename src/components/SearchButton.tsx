import Image from 'next/image';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

interface SearchButtonProps {
  scrolled: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ scrolled }) => {
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);

  // Toggle search menu visibility
  const handleSearchMenuToggle = () => {
    setIsSearchMenuOpen((prev) => !prev);
  };

  // Disable scrolling when the search menu is open
  useEffect(() => {
    if (isSearchMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    // Cleanup on unmount or when closing the menu
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isSearchMenuOpen]);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={handleSearchMenuToggle}
        className="relative flex justify-center items-center space-x-2 font-bold py-2 px-4 rounded"
      >
        <Image
          src={scrolled ? '/icons/search.webp' : '/icons/search-white.webp'}
          alt="Search"
          width={50}
          height={50}
          className="w-6 h-6"
        />
      </button>

      {/* Search Menu (Popup) */}
      {isSearchMenuOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
            isSearchMenuOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          onClick={handleSearchMenuToggle}
        >
          {/* Sliding search menu */}
          <div
            className={`absolute bottom-0 left-0 w-full h-full p-6 bg-white rounded-tl-lg rounded-tr-lg shadow-xl transform transition-all duration-500 ease-in-out ${
              isSearchMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the menu
          >
            {/* Search Bar inside the Menu */}
            <SearchBar scrolled={scrolled} />
            {/* Close Button */}
            <button
              onClick={handleSearchMenuToggle}
              className="absolute top-3.5 right-8 text-lg text-black"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchButton;
