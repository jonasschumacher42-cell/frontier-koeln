// Service Worker: speichert die App beim ersten Öffnen und liefert sie danach ohne Netz aus.
// Bei Änderungen an den Dateien die Versionsnummer erhöhen.
const CACHE = 'frontier-koeln-v2';
const FILES = ['./', './index.html', './program.js', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Erst Cache, dann Netz: funktioniert auch ohne Empfang sofort.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request))
  );
});
