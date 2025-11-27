/**
 * Service Worker Registration
 * 
 * Registers the service worker for offline support and caching
 */

export async function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return null;
  }

  try {
    // Only register in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker disabled in development');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('✅ Service Worker registered:', registration.scope);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 1000 * 60 * 60); // Check every hour

    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // New service worker available
            console.log('🔄 New Service Worker available');
            
            // Optionally notify user
            if (window.confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Unregister service worker (useful for debugging)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('✅ Service Worker unregistered');
    }
  }
}

/**
 * Check if service worker is active
 */
export function isServiceWorkerActive() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller !== null
  );
}

/**
 * Send message to service worker
 */
export async function sendMessageToSW(message) {
  if (!isServiceWorkerActive()) {
    console.warn('Service Worker not active');
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };
    
    registration.active.postMessage(message, [messageChannel.port2]);
  });
}

/**
 * Clear service worker caches
 */
export async function clearServiceWorkerCaches() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return false;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
    console.log('✅ Service Worker caches cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear Service Worker caches:', error);
    return false;
  }
}

