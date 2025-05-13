'use client';

import React, { useState, useEffect, memo, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  ServerIcon, 
  GlobeAltIcon, 
  ChartBarIcon, 
  SignalIcon,
  ArrowsPointingInIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import ReactCountryFlag from 'react-country-flag';

// Location data with coordinates
const locations = [
  { 
    name: 'USA (Dallas)', 
    coordinates: [-96.80, 32.77], 
    svgPosition: { x: 23, y: 40 },
    countryCode: 'US', 
    pingMs: 22,
    uptimePercent: 99.99,
    region: 'Americas',
    tier: 'premium',
    specs: {
      cores: '64 vCores',
      memory: '512 GB RAM',
      storage: '12 TB NVMe SSD',
      network: '40 Gbps'
    }
  },
  { 
    name: 'USA (New York)', 
    coordinates: [-74.01, 40.71], 
    svgPosition: { x: 27, y: 38 },
    countryCode: 'US', 
    pingMs: 19,
    uptimePercent: 99.98,
    region: 'Americas',
    tier: 'premium',
    specs: {
      cores: '128 vCores',
      memory: '768 GB RAM',
      storage: '24 TB NVMe SSD',
      network: '100 Gbps'
    }
  },
  { 
    name: 'UK (London)', 
    coordinates: [-0.12, 51.50], 
    svgPosition: { x: 46, y: 32 },
    countryCode: 'GB', 
    pingMs: 33,
    uptimePercent: 99.95,
    region: 'Europe',
    tier: 'premium',
    specs: {
      cores: '64 vCores',
      memory: '384 GB RAM',
      storage: '8 TB NVMe SSD',
      network: '25 Gbps'
    }
  },
  { 
    name: 'India (Mumbai)', 
    coordinates: [72.87, 19.07], 
    svgPosition: { x: 66, y: 46 },
    countryCode: 'IN', 
    pingMs: 48,
    uptimePercent: 99.90,
    region: 'Asia',
    tier: 'standard',
    specs: {
      cores: '48 vCores',
      memory: '256 GB RAM',
      storage: '6 TB NVMe SSD',
      network: '10 Gbps'
    }
  },
  { 
    name: 'Germany (Frankfurt)', 
    coordinates: [8.68, 50.11], 
    svgPosition: { x: 50, y: 33 },
    countryCode: 'DE', 
    pingMs: 31,
    uptimePercent: 99.97,
    region: 'Europe',
    tier: 'premium',
    specs: {
      cores: '96 vCores',
      memory: '512 GB RAM',
      storage: '16 TB NVMe SSD',
      network: '40 Gbps'
    }
  },
  { 
    name: 'France (Paris)', 
    coordinates: [2.35, 48.85], 
    svgPosition: { x: 48, y: 34 },
    countryCode: 'FR', 
    pingMs: 35,
    uptimePercent: 99.94,
    region: 'Europe',
    tier: 'standard',
    specs: {
      cores: '48 vCores',
      memory: '256 GB RAM',
      storage: '4 TB NVMe SSD',
      network: '20 Gbps'
    }
  },
  { 
    name: 'Singapore', 
    coordinates: [103.81, 1.35], 
    svgPosition: { x: 75, y: 53 },
    countryCode: 'SG', 
    pingMs: 45,
    uptimePercent: 99.98,
    region: 'Asia',
    tier: 'premium',
    specs: {
      cores: '96 vCores',
      memory: '512 GB RAM',
      storage: '18 TB NVMe SSD',
      network: '50 Gbps'
    }
  },
  { 
    name: 'Hong Kong', 
    coordinates: [114.17, 22.32], 
    svgPosition: { x: 78, y: 44 },
    countryCode: 'HK', 
    pingMs: 47,
    uptimePercent: 99.92,
    region: 'Asia',
    tier: 'premium',
    specs: {
      cores: '72 vCores',
      memory: '384 GB RAM',
      storage: '14 TB NVMe SSD',
      network: '30 Gbps'
    }
  },
  { 
    name: 'Saudi Arabia (Riyadh)', 
    coordinates: [46.72, 24.69], 
    svgPosition: { x: 59, y: 44 },
    countryCode: 'SA', 
    pingMs: 52,
    uptimePercent: 99.91,
    region: 'Middle East',
    tier: 'standard',
    specs: {
      cores: '64 vCores',
      memory: '320 GB RAM',
      storage: '10 TB NVMe SSD',
      network: '25 Gbps'
    }
  }
];

// Update animation keyframes for smaller, more subtle pulsing effect
const pulseKeyframes = `
@keyframes pulse-ring {
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0;
  }
}

@keyframes pulse-dot {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
`;

// Animation variants for components
const containerVariants = { 
  hidden: {}, 
  visible: { 
    transition: { staggerChildren: 0.07 } 
  } 
};

const itemVariants = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  } 
};

const markerVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1, 
    opacity: 1,
    transition: { 
      delay: 0.5 + i * 0.06, 
      type: 'spring', 
      stiffness: 180, 
      damping: 14 
    }
  })
};

const tooltipVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      duration: 0.2,
      type: 'spring',
      stiffness: 300,
      damping: 20
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 5, 
    transition: { duration: 0.15 } 
  }
};

// Update LocationMarker component for smaller, more subtle markers
const LocationMarker = memo(({ location, idx, isActive, isHovered, onSelect, onHover }) => {
  // Get region color
  const getRegionColor = useCallback((region) => {
    switch(region) {
      case 'Americas': return { fill: '#3b82f6', ring: 'rgba(59, 130, 246, 0.5)' };
      case 'Europe': return { fill: '#6366f1', ring: 'rgba(99, 102, 241, 0.5)' };
      case 'Asia': return { fill: '#a855f7', ring: 'rgba(168, 85, 247, 0.5)' };
      case 'Middle East': return { fill: '#f59e0b', ring: 'rgba(245, 158, 11, 0.5)' };
      default: return { fill: '#6b7280', ring: 'rgba(107, 114, 128, 0.5)' };
    }
  }, []);
  
  const { fill, ring } = getRegionColor(location.region);
  const isPremium = location.tier === 'premium';
  
  return (
    <g
      onClick={() => onSelect(location)}
      onMouseEnter={() => onHover(location)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer", transform: `translate(${location.svgPosition.x}%, ${location.svgPosition.y}%)` }}
    >
      {/* Outer pulse effect - smaller and more subtle */}
      <circle
        cx={0}
        cy={0}
        r={isPremium ? 4 : 3}
        fill="none"
        stroke={ring}
        strokeWidth={isPremium ? 1.5 : 1}
        style={{
          animation: `pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite`,
          animationDelay: `${idx * 0.2}s`,
          opacity: isActive || isHovered ? 0.7 : 0.3
        }}
      />
      
      {/* Main dot with pulse animation - smaller */}
      <motion.circle
        cx={0}
        cy={0}
        r={isPremium ? 2.5 : 2}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={isPremium ? 0.8 : 0.5}
        variants={markerVariants}
        initial="hidden"
        animate="visible"
        custom={idx}
        style={{
          animation: `pulse-dot 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite`,
          animationDelay: `${idx * 0.2}s`,
        }}
      />
      
      {/* Premium indicator for premium locations - smaller */}
      {isPremium && (
        <circle
          cx={0}
          cy={-4}
          r={0.8}
          fill="#fcd34d"
          stroke="#ffffff"
          strokeWidth={0.3}
        />
      )}
      
      {/* Location label for hovered/active state */}
      {(isActive || isHovered) && (
        <text
          textAnchor="middle"
          y={7}
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 6,
            fontWeight: "bold",
            fill: "#4b5563",
            stroke: "#ffffff",
            strokeWidth: 2,
            strokeLinejoin: "round",
            paintOrder: "stroke",
            pointerEvents: "none"
          }}
        >
          {location.name}
        </text>
      )}
    </g>
  );
});
LocationMarker.displayName = 'LocationMarker';

// Memoized Location List Item for performance
const LocationListItem = memo(({ location, isActive, onSelect, onHover }) => {
  // Use color based on region
  const getRegionColor = (region) => {
    switch(region) {
      case 'Americas': return 'blue';
      case 'Europe': return 'indigo';
      case 'Asia': return 'purple';
      case 'Middle East': return 'amber';
      default: return 'gray';
    }
  };
  
  const color = getRegionColor(location.region);
  
  // Calculate response time color
  const pingColor = location.pingMs < 30 
    ? 'text-green-600' 
    : location.pingMs < 50 
      ? 'text-yellow-600' 
      : 'text-orange-600';
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(location)}
      onMouseEnter={() => onHover(location)}
      onMouseLeave={() => onHover(null)}
      className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-150 ${
        isActive 
          ? `bg-${color}-50 border-${color}-200 shadow-sm` 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <ReactCountryFlag 
            countryCode={location.countryCode} 
            svg 
            style={{ width: '1.5em', height: '1.5em', borderRadius: '4px' }} 
          />
          
          {/* Premium tier indicator */}
          {location.tier === 'premium' && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white"></div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isActive ? `text-${color}-700` : 'text-gray-700'}`}>
              {location.name}
            </span>
            
            <div className={`flex items-center text-xs font-medium ${pingColor}`}>
              <SignalIcon className="h-3 w-3 mr-0.5" />
              {location.pingMs}ms
            </div>
          </div>
          
          <div className="mt-1 text-xs text-gray-500 flex items-center">
            <GlobeAltIcon className="h-3 w-3 mr-1" />
            <span>{location.region}</span>
            <span className="mx-1.5">•</span>
            <span>Uptime: {location.uptimePercent}%</span>
          </div>
        </div>
      </div>
      
      {/* Additional specs - only shown when active */}
      {isActive && (
        <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          <div className="flex items-center">
            <ServerIcon className="h-3 w-3 mr-1 text-gray-400" />
            {location.specs.cores}
          </div>
          <div className="flex items-center">
            <ChartBarIcon className="h-3 w-3 mr-1 text-gray-400" />
            {location.specs.memory}
          </div>
          <div className="flex items-center">
            <ServerIcon className="h-3 w-3 mr-1 text-gray-400" />
            {location.specs.storage}
          </div>
          <div className="flex items-center">
            <BoltIcon className="h-3 w-3 mr-1 text-gray-400" />
            {location.specs.network}
          </div>
        </div>
      )}
    </motion.div>
  );
});
LocationListItem.displayName = 'LocationListItem';

// Main MapSection component
const MapSection = () => {
  // State management
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [activeRegion, setActiveRegion] = useState('All');
  const mapContainerRef = useRef(null);
  
  // Handle location selection
  const handleSelectLocation = useCallback((location) => {
    setSelectedLocation(prev => prev?.name === location.name ? null : location);
  }, []);
  
  // Handle location hover
  const handleHoverLocation = useCallback((location) => {
    setHoveredLocation(location);
  }, []);
  
  // Reset selection
  const handleResetSelection = useCallback(() => {
    setSelectedLocation(null);
  }, []);
  
  // Filter locations by region
  const filteredLocations = useMemo(() => {
    if (activeRegion === 'All') return locations;
    return locations.filter(location => location.region === activeRegion);
  }, [activeRegion]);
  
  // Calculate global stats
  const globalStats = useMemo(() => {
    const totalLocations = filteredLocations.length;
    const avgPing = Math.round(filteredLocations.reduce((sum, loc) => sum + loc.pingMs, 0) / totalLocations);
    const premiumCount = filteredLocations.filter(loc => loc.tier === 'premium').length;
    const regions = [...new Set(filteredLocations.map(loc => loc.region))].length;
    
    return { totalLocations, avgPing, premiumCount, regions };
  }, [filteredLocations]);
  
  // Add pulse animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = pulseKeyframes;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Generate available regions from locations
  const availableRegions = useMemo(() => {
    return ['All', ...new Set(locations.map(loc => loc.region))];
  }, []);
  
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-gray-50 to-blue-50/20">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-blue-500/20">
              <GlobeAltIcon className="h-4 w-4 mr-1.5" />
              Global Network Infrastructure
            </span>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">High-Performance</span> Server Locations
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8">
            Strategically positioned data centers around the world ensure minimal latency
            and maximum reliability for your applications.
          </motion.p>
          
          {/* Stats Overview */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Data Centers</div>
              <div className="text-2xl font-bold text-blue-600">{globalStats.totalLocations}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Avg Response</div>
              <div className="text-2xl font-bold text-green-600">{globalStats.avgPing} ms</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Premium Tier</div>
              <div className="text-2xl font-bold text-yellow-600">{globalStats.premiumCount}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Global Regions</div>
              <div className="text-2xl font-bold text-indigo-600">{globalStats.regions}</div>
            </div>
          </motion.div>
          
          {/* Region Filter */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
            {availableRegions.map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  activeRegion === region
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {region}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content: Map + Location List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-10">
          {/* Location List (Mobile view - top) */}
          <div className="md:hidden">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <GlobeAltIcon className="w-5 h-5 text-blue-500 mr-2" />
                Server Locations
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <LocationListItem
                    key={location.name}
                    location={location}
                    isActive={selectedLocation?.name === location.name}
                    onSelect={handleSelectLocation}
                    onHover={handleHoverLocation}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Map Container */}
          <div 
            className="col-span-1 md:col-span-3 lg:h-[600px] h-[450px] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden relative" 
            ref={mapContainerRef}
          >
            <div className="absolute top-3 right-3 z-10">
              <button 
                onClick={handleResetSelection}
                className="p-2 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <ArrowsPointingInIcon className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            {/* World map using the image URL */}
            <div className="absolute inset-0 bg-white">
              {/* World map as image background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/BlankMap-World-162E.svg/1024px-BlankMap-World-162E.svg.png"
                  alt="World Map"
                  className="max-w-full max-h-full object-contain opacity-80"
                />
              </div>
              
              {/* SVG overlay for markers */}
              <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Location Markers */}
                {filteredLocations.map((location, idx) => (
                  <LocationMarker
                    key={location.name}
                    location={location}
                    idx={idx}
                    isActive={selectedLocation?.name === location.name}
                    isHovered={hoveredLocation?.name === location.name}
                    onSelect={handleSelectLocation}
                    onHover={handleHoverLocation}
                  />
                ))}
              </svg>
            </div>

            {/* Tooltip for selected location */}
            <AnimatePresence>
              {selectedLocation && (
                <motion.div
                  variants={tooltipVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-xs bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20"
                >
                  <div className={`h-1 w-full ${
                    selectedLocation.region === 'Americas' ? 'bg-blue-500' :
                    selectedLocation.region === 'Europe' ? 'bg-indigo-500' :
                    selectedLocation.region === 'Asia' ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`}></div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <ReactCountryFlag 
                        countryCode={selectedLocation.countryCode} 
                        svg 
                        style={{ width: '2em', height: '2em', borderRadius: '4px' }} 
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedLocation.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <GlobeAltIcon className="h-3.5 w-3.5 mr-1" />
                          <span>{selectedLocation.region}</span>
                          {selectedLocation.tier === 'premium' && (
                            <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Premium</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded p-2 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Response Time</div>
                        <div className={`text-base font-semibold ${
                          selectedLocation.pingMs < 30 
                            ? 'text-green-600' 
                            : selectedLocation.pingMs < 50 
                              ? 'text-yellow-600' 
                              : 'text-orange-600'
                        }`}>
                          {selectedLocation.pingMs} ms
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded p-2 border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Uptime</div>
                        <div className="text-base font-semibold text-blue-600">
                          {selectedLocation.uptimePercent}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Server Specifications</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center text-gray-600">
                          <ServerIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedLocation.specs.cores}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ChartBarIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedLocation.specs.memory}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ServerIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedLocation.specs.storage}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BoltIcon className="h-3.5 w-3.5 mr-1 text-gray-400" />
                          {selectedLocation.specs.network}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Location List (Desktop) */}
          <div className="hidden md:block md:col-span-1">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 h-full"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <GlobeAltIcon className="w-5 h-5 text-blue-500 mr-2" />
                Server Locations
              </h3>
              <div className="space-y-2 overflow-y-auto" style={{maxHeight: "calc(100% - 3rem)"}}>
                {filteredLocations.map((location) => (
                  <LocationListItem
                    key={location.name}
                    location={location}
                    isActive={selectedLocation?.name === location.name}
                    onSelect={handleSelectLocation}
                    onHover={handleHoverLocation}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
