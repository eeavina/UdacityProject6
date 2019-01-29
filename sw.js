const staticCacheName = 'restaurant-reviews-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    console.log('Filtered cache');
                    return cacheName.startsWith('restaurant-reviews-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    console.log('Delete cache');
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    console.log('Cache hit');
                    return response;
                }
                else {
                    console.log('Could not find ', event.request, ' in cache fetching');
                    return fetch(event.request);
                }

                return fetch(event.request).then(
                    function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            console.log('Valid response received');
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(staticCacheName)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });
                        console.log('Response to cache');
                        return response;
                    }
                );
            })
    );
});