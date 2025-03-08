import type { NextConfig } from 'next';
import path from 'path'; // Import path module

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**', // Optional: If you need to restrict the path pattern
      },
    ],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src'); // Add alias for @ to resolve to the src directory
    return config;
  },
};

export default nextConfig;
