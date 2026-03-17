const CACHE_NAME = 'notion-clone-v39';
const ASSETS = [
    './',
    './index.php',
    './ui/style.css',
    './core/icons.js',
    './core/storage.js',
    './core/blocks.js',
    './core/editor.js',
    './core/features.js',
    './core/history.js',
    './core/app.js',
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
    const url = new URL(event.request.url);
    
    // Skip API calls and data directory — always go to network
    if (url.pathname.includes('api.php') || url.pathname.includes('/data/')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(JSON.stringify({ error: 'Offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }
    
    // For app assets, try cache first
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }).catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
                return caches.match('./index.php');
            }
        })
    );
});
