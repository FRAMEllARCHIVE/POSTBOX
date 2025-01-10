const CACHE_NAME = "postbox-cache-v1";
const OFFLINE_URL = "/POSTBOX/offline.html";

const FILES_TO_CACHE = [
  "/POSTBOX/",
  "/POSTBOX/1024x1024.png",
  "/POSTBOX/512x512.png",
  "/POSTBOX/index.html",
  OFFLINE_URL
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).catch((error) => {
      console.error("Error during service worker installation:", error);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).catch((error) => {
      console.error("Error during service worker activation:", error);
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }
      });
    }).catch((error) => {
      console.error("Error during service worker fetch event:", error);
    })
  );
});
