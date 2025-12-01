// Polyfill for 'self' in Node.js/server environment - MUST run first
(function() {
  'use strict';
  if (typeof global !== 'undefined' && typeof self === 'undefined') {
    global.self = globalThis || global || {};
  }
  if (typeof window === 'undefined' && typeof self === 'undefined') {
    if (typeof global !== 'undefined') {
      global.self = globalThis || global || {};
    }
  }
})();
