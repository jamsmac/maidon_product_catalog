/**
 * Service Worker for MYDON Product Catalog PWA
 * Provides offline functionality and caching
 */

// Cache names
const CACHE_NAME = 'mydon-cache-v1';
const API_CACHE_NAME = 'mydon-api-cache-v1';
const IMAGE_CACHE_NAME = 'mydon-images-cache-v1';

// Files to cache immediately on install
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sitemap.xml',
  '/robots.txt'
];

// API routes to cache
const API_ROUTES_TO_CACHE = [
  '/api/products',
  '/api/equipment'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_FILES);
      })
      .then(() => {
        // Force activation to skip waiting
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches and take control
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return cacheNames.filter(cacheName =>
          cacheName !== CACHE_NAME &&
          cacheName !== API_CACHE_NAME &&
          cacheName !== IMAGE_CACHE_NAME
        ).map(cacheName => {
          console.log('Service Worker: Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        });
      }),

      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle images with cache-first strategy
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Default network-first for everything else
  event.respondWith(handleNetworkFirst(request));
});

/**
 * Handle API requests with Network-First strategy
 * Try network first, fallback to cache if offline
 */
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('API network failed, trying cache:', request.url);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for GET requests
    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        error: 'Offline mode',
        message: 'Данные недоступны в автономном режиме'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // For non-GET requests, return error
    return new Response(JSON.stringify({
      error: 'Network Error',
      message: 'Проверьте интернет-соединение'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle image requests with Cache-First strategy
 * Check cache first, then network
 */
async function handleImageRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Try network
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Return fallback image
    return new Response('', {
      status: 404,
      headers: { 'Content-Type': 'image/png' }
    });
  }
}

/**
 * Handle static asset requests with Cache-First strategy
 */
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return basic error page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Offline - MYDON</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 2rem; }
              .offline-message { max-width: 600px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="offline-message">
              <h1>Вы находитесь в автономном режиме</h1>
              <p>Соединение с интернетом недоступно. Попробуйте позже.</p>
              <button onclick="window.location.reload()">Повторить</button>
            </div>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

/**
 * Handle other requests with Network-First strategy
 */
async function handleNetworkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // For navigation requests, return offline page
    if (request.destination === 'document') {
      return new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Offline - MYDON</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 2rem;">
            <h1>Нет соединения</h1>
            <p>Приложение работает в автономном режиме</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Offline', { status: 503 });
  }
}

/**
 * Check if request is for an image
 */
function isImageRequest(request) {
  return request.destination === 'image' ||
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i);
}

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         request.url.includes('/assets/') ||
         request.url.match(/\.(js|css|woff|woff2|ttf|eot)(\?.*)?$/i);
}

/**
 * Background sync for failed requests (when back online)
 */
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Handle background sync
 */
async function doBackgroundSync() {
  console.log('Service Worker: Performing background sync');

  // Get pending requests from indexedDB or similar storage
  // In a real implementation, you'd implement persistent storage for failed requests

  // For now, just log
  console.log('Background sync completed');
}

/**
 * Handle push notifications
 */
self.addEventListener('push', event => {
  console.log('Service Worker: Push message received', event);

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.url || '/',
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'MYDON', options)
    );
  }
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received', event);

  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data || '/')
  );
});

/**
 * Handle periodic background sync (optional)
 */
self.addEventListener('periodicsync', event => {
  console.log('Service Worker: Periodic sync', event.tag);

  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

/**
 * Sync content in background
 */
async function syncContent() {
  console.log('Service Worker: Syncing content');

  try {
    // Prefetch important API data
    const apiUrls = [
      '/api/products?limit=10',
      '/api/equipment?status=active'
    ];

    const cache = await caches.open(API_CACHE_NAME);

    for (const url of apiUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
          console.log('Service Worker: Prefetched', url);
        }
      } catch (error) {
        console.log('Service Worker: Failed to prefetch', url, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Content sync failed', error);
  }
}

// Add type definitions for better IDE support
/**
 * @typedef {Object} PushMessageData
 * @property {string} title
 * @property {string} body
 * @property {string} [url]
 */
