const cacheName = 'v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(['/offline/']))
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worked: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      )
    })
  )
});

self.addEventListener('fetch', event => {
  if (isHtmlGetRequest(event.request) || isMainResourceGetRequest(event.request)) {
    event.respondWith(
      caches.open(cacheName)
        .then(cache => cache.match(event.request))
        .then(response => response ? response : fetchAndCache(event.request, cacheName))
        .catch(() => caches.match('/offline/'))
    );
  } else {
    event.respondWith(
      fetch(event.request.url).catch(() => caches.match('/offline/'))
    );
  }
});

function fetchAndCache(request, cacheName) {
  return fetch(request).then(response => {
    const copy = response.clone();
    caches.open(cacheName).then(cache => {
      cache.put(request, copy);
    });

    return response;
  }).catch(() => caches.match('/offline/'));
}

function isHtmlGetRequest(request) {
  return request.method === 'GET' && request.destination === 'document';
}

function isMainResourceGetRequest(request) {
  return request.method === 'GET' && (request.destination === 'style' || request.destination === 'image' || request.url.includes('manifest'));
}