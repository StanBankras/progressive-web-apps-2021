const cacheName = 'pages_v1';

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
  if (!isHtmlGetRequest(event.request)) {
    event.respondWith(fetch(event.request.url).catch(() => caches.match('/offline/')));
  } else {
    event.respondWith(
      caches.match(event.request).then(cache => {
        if (cache && isValid(cache)) {
          console.log('Served from cache!');
          return cache;
        } else {
          event.waitUntil(fetch(event.request).then(response => {
            if (!response) {
              return caches.match('/offline/');
            }
            const copy = response.clone();

            caches.open(cacheName).then(cache => {
              const headers = new Headers(copy.headers);
              headers.append('sw-fetched-on', new Date());

              return copy.blob().then(body => {
                return cache.put(event.request, new Response(body, {
                  status: copy.status,
                  statusText: copy.statusText,
                  headers: headers
                }));
              });
            });

            console.log('Served from server!');
            return response;
          }));
        }
      }).catch(() => caches.match('/offline/'))
    );
  }
})

function isValid(response) {
  if (!response) return false;
  const fetched = response.headers.get('sw-fetched-on');
  if (fetched && (new Date(fetched).getTime() + (1000 * 60 * 60 * 2)) > Date.now()) return true;
  return false;
}

function isHtmlGetRequest(request) {
  return request.method === 'GET' && request.destination === 'document';
}