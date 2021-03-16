const cacheVersion = '1.1';
const coreCache = `core-cache-${cacheVersion}`;
const htmlCache = `html-cache-${cacheVersion}`;
const otherCache = `other-cache-${cacheVersion}`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(coreCache)
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
          if(![coreCache, htmlCache, otherCache].includes(cache)) {
            console.log('Service Worked: Clearing Old Cache: ' + cache);
            return caches.delete(cache);
          }
        })
      )
    })
  );
});

self.addEventListener('fetch', event => {
  if (isHtmlGetRequest(event.request)) {
    event.respondWith(
      caches.open(htmlCache)
        .then(cache => cache.match(event.request))
        .then(response => response ? response : fetchAndCache(event.request, htmlCache))
        .catch(() => caches.match('/offline/'))
    );
  } else if(isMainResourceGetRequest(event.request)) {
    event.respondWith(
      caches.open(otherCache)
        .then(cache => cache.match(event.request))
        .then(response => response ? response : fetchAndCache(event.request, otherCache))
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
  });
}

function isHtmlGetRequest(request) {
  return request.method === 'GET' && request.destination === 'document';
}

function isMainResourceGetRequest(request) {
  return request.method === 'GET' && (request.destination === 'style' || request.destination === 'image' || request.url.includes('manifest'));
}