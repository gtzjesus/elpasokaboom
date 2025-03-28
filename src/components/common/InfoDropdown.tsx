'use client';

import { useState } from 'react';

interface InfoDropdownProps {
  title: string; // The title for the dropdown (e.g., "Size", "Care", "Shipping")
  info: string; // The product info to display
}

const InfoDropdown: React.FC<InfoDropdownProps> = ({ title, info }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleInfo = () => {
    setIsInfoOpen((prev) => !prev);
  };

  return (
    <div
      className="my-4 p-4  bg-white border-b  cursor-pointer"
      onClick={toggleInfo} // Make the entire container clickable
    >
      <div className="flex items-center justify-between">
        <h3 className="uppercase text-sm font-semibold text-center text-gray-800">
          {title} {/* Use the title prop here */}
        </h3>
        <button
          className="flex items-center justify-center text-xs font-semibold text-black rounded-full hover:bg-gray-100 transition-all duration-300"
          aria-hidden="true" // Hide the button's icon from screen readers
        >
          {isInfoOpen ? (
            <span className="text-xs">-</span>
          ) : (
            <span className="text-xs">+</span>
          )}
        </button>
      </div>

      {/* Transitioning info */}
      <div
        className={`mt-3 overflow-hidden transition-all duration-500 ${
          isInfoOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <p className="text-xs font-light text-gray-800">{info}</p>
      </div>
    </div>
  );
};

export default InfoDropdown;
