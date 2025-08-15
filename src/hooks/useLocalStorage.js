/**
 * Custom hook for localStorage operations with React state synchronization
 */

import { useState } from "react";

/**
 * Hook to manage localStorage values with React state
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {Array} [value, setValue] tuple
 */
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue; // fallback gracefully
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Swallow to keep hook pure; consider surfacing via optional onError
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook to remove an item from localStorage
 * @param {string} key - localStorage key to remove
 * @returns {Function} Function to remove the item
 */
export const useRemoveFromLocalStorage = (key) => {
  return () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      // No-op
    }
  };
};

/**
 * Hook to clear all localStorage items
 * @returns {Function} Function to clear all localStorage
 */
export const useClearLocalStorage = () => {
  return () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      // No-op
    }
  };
};

export default useLocalStorage;
