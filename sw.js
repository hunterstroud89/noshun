const CACHE_NAME = 'notion-clone-v42';
const ASSETS = [
    './',
    './index.html',
    './core/css/style.css',
    './core/js/icons.js',
    './core/js/storage.js',
    './core/js/blocks.js',
    './core/js/editor.js',
    './core/js/features.js',
    './core/js/history.js',
    './core/js/app.js',
    './manifest.json'
];

// Install - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching app assets');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Only cache GET requests for static assets
    if (event.request.method !== 'GET') return;
    
    const url = new URL(event.request.url);
    
    // Let API calls and data requests go straight to the server
    if (url.pathname.includes('core/php/api.php') || url.pathname.includes('/data/')) {
        return;
    }
    
    // For app assets, try cache first then network (and cache new fetches)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((response) => {
                // Cache emoji SVGs and images for offline use
                if (response.ok && (url.pathname.includes('/lib/emojis/') || url.pathname.includes('/images/'))) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            });
        }).catch(() => {
            // Return offline page for navigation requests, empty response for others
            if (event.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
            return new Response('', { status: 503, statusText: 'Offline' });
        })
    );
});
