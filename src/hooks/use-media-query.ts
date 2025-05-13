"use client"

import { useState, useEffect } from 'react';

/**
 * Custom hook that returns true if the specified media query matches
 * @param query The media query to match
 * @param defaultValue Default value to return if window is not available (SSR)
 */
export function useMediaQuery(query: string, defaultValue: boolean = false): boolean {
  // Initialize with defaultValue for SSR
  // Use lazy initialization to avoid unnecessary calculations
  const [matches, setMatches] = useState<boolean>(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return defaultValue;
  });

  useEffect(() => {
    // Skip effect on server
    if (typeof window === 'undefined') return;
    
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Update state based on current match
    setMatches(mediaQuery.matches);
    
    // Create handler function with proper type annotations
    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };
    
    // Add event listener (with browser compatibility check)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }
    
    // Cleanup when component unmounts
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]); // Only re-run effect if query changes

  return matches;
}

// Additional utility hooks for common breakpoints
export function useIsSmallScreen(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

export function useIsMediumScreen(): boolean {
  return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsLargeScreen(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}

export default useMediaQuery;