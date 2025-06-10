self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('calendario-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'styles.css',
        'scripts.js',
        'menu.json',
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