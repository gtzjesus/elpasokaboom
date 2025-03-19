// components/VideoBackground.tsx
import React from 'react';

const VideoBackground: React.FC = () => (
  <div className="relative w-full h-screen">
    {/* Mobile Video */}
    <video
      className="absolute inset-0 w-full h-full object-cover md:hidden z-0"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/videos/background-vertical.mp4" type="video/mp4" />
      {/* Add additional source elements for other formats if needed */}
      Your browser does not support the video tag.
    </video>

    {/* Desktop Video */}
    <video
      className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/videos/background-horizontal.mp4" type="video/mp4" />
      {/* Add additional source elements for other formats if needed */}
      Your browser does not support the video tag.
    </video>

    {/* Overlay */}
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>
);

export default VideoBackground;
