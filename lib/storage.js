/**
 * Safe localStorage utilities that handle SSR and malformed localStorage mocks
 * 
 * This handles the edge case where Node.js has a malformed localStorage polyfill
 * (e.g., when --localstorage-file flag is provided without a valid path)
 */

// Cache the check result to avoid repeated testing
let storageAvailable = null;

/**
 * Internal helper to check if localStorage is properly available
 */
function isLocalStorageAvailable() {
  // Server-side - definitely no localStorage
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Return cached result if we've already checked
  if (storageAvailable !== null) {
    return storageAvailable;
  }
  
  // Wrap everything in try-catch to handle all edge cases
  try {
    // Check if localStorage exists at all
    if (typeof localStorage === 'undefined' || localStorage === null) {
      storageAvailable = false;
      return false;
    }
    
    // Try to access and use the methods - wrap each in its own try
    let getItemWorks = false;
    let setItemWorks = false;
    let removeItemWorks = false;
    
    try {
      getItemWorks = typeof localStorage.getItem === 'function';
    } catch (e) {
      getItemWorks = false;
    }
    
    try {
      setItemWorks = typeof localStorage.setItem === 'function';
    } catch (e) {
      setItemWorks = false;
    }
    
    try {
      removeItemWorks = typeof localStorage.removeItem === 'function';
    } catch (e) {
      removeItemWorks = false;
    }
    
    if (!getItemWorks || !setItemWorks || !removeItemWorks) {
      storageAvailable = false;
      return false;
    }
    
    // Test that it actually works with a real test
    const testKey = '__storage_test__' + Date.now();
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    storageAvailable = result === 'test';
    return storageAvailable;
  } catch (e) {
    // Any error means we can't use localStorage
    storageAvailable = false;
    return false;
  }
}

/**
 * Check if we can safely use localStorage
 */
export function canUseLocalStorage() {
  return isLocalStorageAvailable();
}

/**
 * Safely get an item from localStorage
 */
export function safeGetItem(key, defaultValue = null) {
  // Explicit server-side check first
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    // Quick check for localStorage existence
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return defaultValue;
    }
    
    // Check if getItem is a function
    if (typeof localStorage.getItem !== 'function') {
      return defaultValue;
    }
    
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (e) {
    // Silently return default on any error
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage
 */
export function safeSetItem(key, value) {
  // Explicit server-side check first
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Quick check for localStorage existence
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return false;
    }
    
    // Check if setItem is a function
    if (typeof localStorage.setItem !== 'function') {
      return false;
    }
    
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    // Silently fail on any error
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function safeRemoveItem(key) {
  // Explicit server-side check first
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    // Quick check for localStorage existence
    if (typeof localStorage === 'undefined' || localStorage === null) {
      return false;
    }
    
    // Check if removeItem is a function
    if (typeof localStorage.removeItem !== 'function') {
      return false;
    }
    
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    // Silently fail on any error
    return false;
  }
}

/**
 * Reset the storage availability cache (useful for testing)
 */
export function resetStorageCache() {
  storageAvailable = null;
}

