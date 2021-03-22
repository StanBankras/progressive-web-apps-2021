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

    event.waitUntil(
      updateItem(event.request, htmlCache).then(response => refreshClient(response))
    );
  } else if(isMainResourceGetRequest(event.request) || event.request.url.includes('manifest')) {
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

async function updateItem(request, cacheName) {
  try {
    const match = await caches.match(request);
    if(!match) return null;

    const hash = match.headers.get('ETag');
    if(!hash) return null;

    const response = await fetch(request.url, {
      method: 'GET',
      headers: {
        'ETag': hash
      }
    });

    if(response.status === 304) return null;

    setTimeout(() => {
      const copy = response.clone();
  
      return caches.open(cacheName).then(cache => {
        return cache.put(request, copy).then(() => {
          return response;
        })
      });
    }, 50);

  } catch {
    return caches.match('/offline/');
  }
}

function refreshClient(response) {
  if(!response || !response.url) return;
  
  return setTimeout(() => {
    return self.clients.matchAll().then(clients => {
      const message = {
        type: 'refresh',
        url: response.url
      };
  
      clients.forEach(client => {
        client.postMessage(JSON.stringify(message));
      });
    });
  }, 50)
}

function isHtmlGetRequest(request) {
  return request.method === 'GET' && request.destination === 'document';
}

function isMainResourceGetRequest(request) {
  return request.method === 'GET' && (request.destination === 'style' || request.destination === 'image' || request.url.includes('manifest'));
}