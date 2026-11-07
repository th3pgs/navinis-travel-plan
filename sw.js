// Self-destructing Service Worker to replace old Workbox sw.js (HTTP 200 OK)
// Preserves 100% of IndexedDB and localStorage while clearing stale JS/HTML bundle caches.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      )
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((clients) => {
        clients.forEach((client) => {
          if ('navigate' in client && client.url) {
            client.navigate(client.url);
          }
        });
      })
  );
});
