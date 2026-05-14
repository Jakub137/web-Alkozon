// Minimal service worker required by Firebase Cloud Messaging (Web).
// Full background notification handling can be added later if needed.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
