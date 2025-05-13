// src/hooks/use-local-storage.ts
"use client"; // Custom hooks using useState/useEffect need this

import { useState, useEffect } from 'react';

function getValueFromLocalStorage<T>(key: string, initialValue: T | (() => T)): T {
  // Check if running on the client side
  if (typeof window === 'undefined') {
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : (typeof initialValue === 'function' ? (initialValue as () => T)() : initialValue);
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => getValueFromLocalStorage(key, initialValue));

  // Update localStorage when the state changes
  useEffect(() => {
    // Check if running on the client side
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, storedValue]);

  // Optional: Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
         try {
             setStoredValue(JSON.parse(event.newValue) as T);
         } catch (error) {
             console.warn(`Error parsing localStorage change for key “${key}”:`, error);
         }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);


  return [storedValue, setStoredValue];
}

// Optional: Export the type for better usage if needed elsewhere
export type UseLocalStorageReturn<T> = [T, React.Dispatch<React.SetStateAction<T>>];