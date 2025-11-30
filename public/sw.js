/**
 * Service Worker for Offline Translation Support
 * 
 * Caches translations for offline use and faster load times
 */

const CACHE_NAME = 'aquamundi-translations-v1';
const API_CACHE_NAME = 'aquamundi-api-v1';
const STATIC_CACHE_NAME = 'aquamundi-static-v1';

// Cache these URLs immediately on install
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/logo1.png',
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith('aquamundi-') &&
              name !== CACHE_NAME &&
              name !== API_CACHE_NAME &&
              name !== STATIC_CACHE_NAME
            );
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle translation API requests
  if (url.pathname.startsWith('/api/translations')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached response if available
          if (cachedResponse) {
            // Update cache in background
            fetch(request)
              .then((response) => {
                if (response.ok) {
                  cache.put(request, response.clone());
                }
              })
              .catch(() => {
                // Offline - use cached version
              });
            
            return cachedResponse;
          }

          // Fetch from network and cache
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              // Return offline fallback if available
              return new Response(
                JSON.stringify({
                  success: false,
                  error: 'Offline - no cached data available',
                  offline: true,
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' },
                }
              );
            });
        });
      })
    );
    return;
  }

  // Handle static assets
  if (
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|avif|ico|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/') || new Response('Offline');
      })
    );
    return;
  }

  // Default: network first, fall back to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-translations') {
    event.waitUntil(syncTranslations());
  }
});

async function syncTranslations() {
  // Implement background sync logic if needed
  console.log('Background sync: translations');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'AquaMundi', {
        body: data.body || 'New content available',
        icon: '/logo1.png',
        badge: '/logo1.png',
        tag: 'aquamundi-notification',
        requireInteraction: false,
      })
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});


