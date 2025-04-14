import React from 'react';

const VideoBackground: React.FC = () => (
  <div className="relative w-full h-screen">
    {/* Video: Mobile */}
    <video
      className="absolute inset-0 w-full h-full object-cover md:hidden z-0"
      autoPlay
      muted={true}
      loop
      playsInline
      preload="auto"
      disableRemotePlayback
    >
      <source src="/videos/background-vertical.mp4" type="video/mp4" />
      <source src="/videos/background-vertical.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>

    {/* Video: Desktop */}
    <video
      className="absolute inset-0 w-full h-full object-cover hidden md:block z-0"
      autoPlay
      muted={true}
      loop
      playsInline
      preload="auto"
      disableRemotePlayback
    >
      <source src="/videos/background-horizontal.mp4" type="video/mp4" />
      <source src="/videos/background-horizontal.webm" type="video/webm" />
      Your browser does not support the video tag.
    </video>

    {/* Overlay */}
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>
);

export default VideoBackground;
