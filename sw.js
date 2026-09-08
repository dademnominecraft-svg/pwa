// Unique cache name (increment the version number when updating your app assets)
const CACHE_NAME = 'my-pwa-cache-v1';

// Exact list of files to save locally for offline use (no folder prefixes)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './youtubeLo.png',  // Change to match your custom icon names
  './youtubeGo.png'   // Change to match your custom icon names
];

// 1. INSTALL EVENT: Triggered when the browser first discovers this script
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching baseline PWA assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Forces the waiting service worker to become active instantly
  self.skipWaiting(); 
});

// 2. ACTIVATE EVENT: Cleans up obsolete cache storage containers from older versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Ensures that updates to the service worker take effect immediately across all tabs
  self.clients.claim();
});

// 3. FETCH EVENT: Intercepts network calls to deliver stored assets while offline
self.addEventListener('fetch', (event) => {
  // Only handle standard HTTP/HTTPS requests (ignores internal browser schemes)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached file if found; otherwise pull it fresh from the internet
      return cachedResponse || fetch(event.request);
    })
  );
});
