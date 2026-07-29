import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    BACKEND_URL: 'http://localhost:6500',
  },
  async rewrites() {
    return [
      {
        source: '/airport-l',
        destination: '/AirportL',
      },
      {
        source: '/airport-l/:id',
        destination: '/AirportL/:id',
      },
      {
        source: '/airport-l/new',
        destination: '/AirportL/new',
      },
    ];
  },
};

export default nextConfig;
