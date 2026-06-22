const CACHE_NAME = "willztech-cache-v3";

// Files to cache
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.jpg"
];

// INSTALL → cache files + activate immediately
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE → remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// FETCH → always check network first (IMPORTANT CHANGE)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});