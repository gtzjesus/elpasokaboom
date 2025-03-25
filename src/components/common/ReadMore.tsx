'use client'; // Make sure this is a client-side component

import { useState } from 'react';

interface ReadMore {
  description?: string; // Optional description prop
}

const ReadMore: React.FC<ReadMore> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // If there's no description, don't render anything
  if (!description) return null;

  // Truncate the description to 120 characters by default
  const truncatedDescription =
    description.length > 80
      ? `${description.substring(0, 80)}...`
      : description;

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <h2 className=" text-xs font-light text-gray-600 w-[70vw]">
        {isExpanded ? description : truncatedDescription}
        {/* Only show 'Read More' if the description is longer than 120 characters */}
        {description.length > 80 && (
          <button className="text-gray-800 text-xs" onClick={toggleDescription}>
            {isExpanded ? '-' : '+'}
          </button>
        )}
      </h2>
    </div>
  );
};

export default ReadMore;
