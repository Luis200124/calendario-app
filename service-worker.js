self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('calendario-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'scripts.js',
        'manifest.json',
        'recetas.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});