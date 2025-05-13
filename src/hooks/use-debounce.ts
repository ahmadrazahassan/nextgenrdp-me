// src/hooks/use-debounce.ts
"use client"; // Custom hooks using useEffect need this

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update debounced value after specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear timeout if value/delay changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect only if value or delay changes

  return debouncedValue;
}