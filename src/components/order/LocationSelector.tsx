'use client';

import React from 'react';
// Assuming you have flags as separate components or images later
// Using emoji flags for now

interface Location {
  id: string;
  name: string;
  flag: string; 
  city?: string;
}

export const locations: Location[] = [
  { id: 'us-dal', name: 'USA', city: 'Dallas', flag: '🇺🇸' },
  { id: 'us-nyc', name: 'USA', city: 'New York', flag: '🇺🇸' },
  { id: 'uk-lon', name: 'UK', city: 'London', flag: '🇬🇧' },
  { id: 'in', name: 'India', flag: '🇮🇳' },
  { id: 'de', name: 'Germany', flag: '🇩🇪' },
  { id: 'fr', name: 'France', flag: '🇫🇷' },
  { id: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { id: 'hk', name: 'Hong Kong', flag: '🇭🇰' },
  { id: 'sa', name: 'Saudi Arabia', flag: '🇸🇦' },
];

interface LocationSelectorProps {
  selectedLocation: string | null;
  onLocationChange: (locationId: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ selectedLocation, onLocationChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Server Location</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {locations.map((location) => (
          <button
            key={location.id}
            type="button" // Ensure it's not treated as submit
            onClick={() => onLocationChange(location.id)}
            className={`
              p-3 sm:p-4 rounded-lg border transition-all duration-200 ease-in-out 
              flex flex-col items-center justify-center space-y-2 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${selectedLocation === location.id 
                ? 'bg-indigo-50 border-indigo-500 shadow-md scale-105 ring-1 ring-indigo-500' 
                : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }
            `}
          >
            <span className="text-3xl md:text-4xl" role="img" aria-label={location.name}>{location.flag}</span>
            <span className="text-xs sm:text-sm font-medium text-center text-gray-700">
              {location.name}
              {location.city && <span className="block text-xs text-gray-500">({location.city})</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector; 