// Service Worker para inFusion PWA
const CACHE_NAME = 'infusion-v1.0';
const DYNAMIC_CACHE = 'infusion-dynamic-v1.0';

// Archivos críticos para cachear
const STATIC_ASSETS = [
    '/index.html',
    '/styles.css',
    '/styles-optimized.css',
    '/script-optimized.js',
    '/manifest.json',
    '/Logo/in Fusion.png',
    '/Logo/in Fusion.svg',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {cache: 'reload'})));
            })
            .catch((error) => {
                console.error('Error al cachear archivos estáticos:', error);
            })
    );
    
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Eliminando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    
    return self.clients.claim();
});

// Estrategia de caché: Network First con fallback a Cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Ignorar requests que no sean GET
    if (request.method !== 'GET') return;
    
    // Ignorar requests a dominios externos (excepto fonts y CDN)
    if (!request.url.startsWith(self.location.origin) && 
        !request.url.includes('googleapis.com') &&
        !request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(
        // Estrategia Network First
        fetch(request)
            .then((response) => {
                // Clonar la respuesta
                const responseClone = response.clone();
                
                // Cachear la nueva respuesta
                if (response.status === 200) {
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                
                return response;
            })
            .catch(() => {
                // Si la red falla, intentar con la caché
                return caches.match(request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Si no está en caché, devolver página offline para HTML
                        if (request.headers.get('Accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// Notificaciones Push (para futuras implementaciones)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nueva notificación de inFusion',
        icon: '/Logo/in Fusion.png',
        badge: '/Logo/in Fusion.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver productos',
                icon: '/Logo/in Fusion.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/Logo/in Fusion.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('inFusion', options)
    );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('Service Worker de inFusion cargado correctamente');

