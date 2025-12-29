/**
 * Fix for broken localStorage in Node.js environment
 * 
 * This file should be imported at the very top of layout.js or other entry points
 * to fix the issue where Node.js has a broken localStorage object
 * (e.g., when --localstorage-file flag is provided without a valid path)
 */

// Only run on server-side (no window)
if (typeof window === 'undefined') {
  try {
    // Check if localStorage exists directly and is broken
    if (typeof localStorage !== 'undefined' && localStorage !== null) {
      if (typeof localStorage.getItem !== 'function') {
        // Can't delete localStorage directly, but we can make it undefined
        globalThis.localStorage = undefined;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  try {
    // Check global.localStorage
    if (typeof global !== 'undefined' && global.localStorage !== undefined) {
      if (typeof global.localStorage.getItem !== 'function') {
        delete global.localStorage;
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  try {
    // Check globalThis.localStorage
    if (typeof globalThis !== 'undefined' && globalThis.localStorage !== undefined) {
      if (typeof globalThis.localStorage.getItem !== 'function') {
        delete globalThis.localStorage;
      }
    }
  } catch (e) {
    // Ignore errors
  }
}

export {};

