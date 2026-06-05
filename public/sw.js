const CACHE_NAME = "fithub-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png"
];

// Install Event - cache core shell files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching offline assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - cache-first for static files, network-first/only for API requests
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Exclude API requests and hot-reload WebSockets/dev-server assets
  if (
    event.request.url.includes("/api/") || 
    event.request.url.includes("/auth/") ||
    event.request.url.includes("/workout/") ||
    event.request.url.includes("/exercise/") ||
    requestUrl.pathname.startsWith("/ws") ||
    event.request.method !== "GET"
  ) {
    // Let API and WebSocket calls bypass the cache completely
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Cache new successful GET requests of static assets (like images, fonts)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic" &&
          (event.request.url.includes(".png") ||
           event.request.url.includes(".webp") ||
           event.request.url.includes(".css") ||
           event.request.url.includes(".js") ||
           event.request.url.includes("fonts.googleapis.com") ||
           event.request.url.includes("fonts.gstatic.com"))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for HTML routing
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/index.html");
        }
      });
    })
  );
});
