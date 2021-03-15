self.addEventListener('install', event => {  
  
  event.waitUntil(
    caches.open('test')
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(['/offline/']);
      })
  );

  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match('/offline/'))
  );
})