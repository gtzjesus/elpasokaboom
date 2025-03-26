'use client';

import { useState } from 'react';

interface DescriptionDropdownProps {
  description: string; // The product description to display
}

const DescriptionDropdown: React.FC<DescriptionDropdownProps> = ({
  description,
}) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionOpen((prev) => !prev);
  };

  return (
    <div
      className="p-4 mt-6 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer"
      onClick={toggleDescription} // Make the entire container clickable
    >
      <div className="flex items-center justify-between">
        <h3 className="uppercase text-md font-semibold text-center  text-gray-800">
          Details
        </h3>
        <button
          className="flex items-center justify-center text-lg font-semibold text-black rounded-full p-2 hover:bg-gray-100 transition-all duration-300"
          aria-hidden="true" // Hide the button's icon from screen readers
        >
          {isDescriptionOpen ? (
            <span className="text-xl">-</span>
          ) : (
            <span className="text-xl">+</span>
          )}
        </button>
      </div>

      {/* Transitioning description */}
      <div
        className={`mt-3 overflow-hidden transition-all duration-500 ${
          isDescriptionOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <p className=" text-xs font-light text-gray-800">{description}</p>
      </div>
    </div>
  );
};

export default DescriptionDropdown;
