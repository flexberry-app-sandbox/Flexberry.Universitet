import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    BACKEND_URL: 'http://localhost:6500',
  },
  async rewrites() {
    return [
      {
        source: '/aircraft-l',
        destination: '/AircraftL',
      },
      {
        source: '/aircraft-l/:id',
        destination: '/AircraftL/:id',
      },
      {
        source: '/aircraft-l/new',
        destination: '/AircraftL/new',
      },
      {
        source: '/airplane-l',
        destination: '/AirplaneL',
      },
      {
        source: '/airplane-l/:id',
        destination: '/AirplaneL/:id',
      },
      {
        source: '/airplane-l/new',
        destination: '/AirplaneL/new',
      },
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
      {
        source: '/flight-l',
        destination: '/FlightL',
      },
      {
        source: '/flight-l/:id',
        destination: '/FlightL/:id',
      },
      {
        source: '/flight-l/new',
        destination: '/FlightL/new',
      },
      {
        source: '/helicopter-l',
        destination: '/HelicopterL',
      },
      {
        source: '/helicopter-l/:id',
        destination: '/HelicopterL/:id',
      },
      {
        source: '/helicopter-l/new',
        destination: '/HelicopterL/new',
      },
      {
        source: '/passenger-l',
        destination: '/PassengerL',
      },
      {
        source: '/passenger-l/:id',
        destination: '/PassengerL/:id',
      },
      {
        source: '/passenger-l/new',
        destination: '/PassengerL/new',
      },
    ];
  },
};

export default nextConfig;
