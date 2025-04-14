import Image from 'next/image';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

/**
 * `SearchButton` is a component that toggles the visibility of a search menu when clicked.
 * The search menu is a sliding panel that includes a search bar for searching products.
 * This component also manages scroll lock when the search menu is open.
 *
 * @param {boolean} scrolled - A flag indicating whether the page has been scrolled or not.
 * Used to adjust the search icon appearance.
 *
 * @returns {JSX.Element} The SearchButton component, which includes a button to toggle the search menu.
 */
interface SearchButtonProps {
  scrolled: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ scrolled }) => {
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);

  /**
   * Toggles the visibility of the search menu when the button is clicked.
   */
  const handleSearchMenuToggle = () => {
    setIsSearchMenuOpen((prev) => !prev);
  };

  /**
   * Manages the scrolling behavior of the page when the search menu is open or closed.
   * When the search menu is open, it disables scrolling. When the menu is closed, scrolling is enabled.
   */
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
    <div className="max-w-xl mx-auto relative">
      {/* Search Button */}
      <button
        onClick={handleSearchMenuToggle}
        className="relative flex justify-center items-center font-bold rounded"
        style={{ padding: 0 }}
      >
        <Image
          src={scrolled ? '/icons/search.webp' : '/icons/search.webp'} // Can be adjusted for different icons if needed
          alt="Search"
          width={50}
          height={50}
          className="w-5 h-5"
          priority
        />
      </button>

      {/* Search Menu (Popup) */}
      {isSearchMenuOpen && (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 transition-opacity duration-500"
          onClick={handleSearchMenuToggle}
        >
          {/* Sliding search menu */}
          <div
            className={`absolute bottom-0 left-0 w-full h-full p-6 bg-white shadow-xl transform transition-all duration-500 ease-in-out ${
              isSearchMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the menu
          >
            {/* Search Bar inside the Menu */}
            <SearchBar
              scrolled={scrolled}
              isSearchMenuOpen={isSearchMenuOpen}
            />
            {/* Close Button */}
            <button
              onClick={handleSearchMenuToggle}
              className="absolute top-5 right-8 text-sm text-black underline"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchButton;
