// Service Worker básico para PWA
self.addEventListener("install", (event) => {
  console.log("Service Worker installed")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated")
  return self.clients.claim()
})

// Estrategia simple de caché
const CACHE_NAME = "currency-calculator-v1"
const URLS_TO_CACHE = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  // Ignorar solicitudes a dominios externos que no están en la lista de permitidos
  const allowedDomains = [
    self.location.origin,
    "api.exchangerate-api.com",
    "mhrgktbewfojpspigkkg.supabase.co",
    "supabase.co",
    "supabase.in"
  ];

  // Verificar si la URL es de un dominio permitido
  const url = new URL(event.request.url);
  const isAllowedDomain = allowedDomains.some(domain => url.hostname.includes(domain));

  // Si no es un dominio permitido, pasar directamente a la red sin intentar cachear
  if (!isAllowedDomain) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver desde caché si está disponible
      if (response) {
        return response;
      }

      // Si no está en caché, intentar obtenerlo de la red
      return fetch(event.request)
        .then((response) => {
          // No almacenar en caché si la respuesta no es válida
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          try {
            // Clonar la respuesta para almacenarla en caché
            const responseToCache = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              // Verificar que la solicitud es válida para almacenar en caché
              if (event.request.method === 'GET' &&
                  event.request.url.startsWith('http') &&
                  !event.request.url.startsWith('chrome-extension')) {
                cache.put(event.request, responseToCache);
              }
            }).catch(err => {
              console.warn('Error caching resource:', err);
            });
          } catch (err) {
            console.warn('Error processing response for cache:', err);
          }

          return response;
        })
        .catch(() => {
          // Si falla la red y es una solicitud de página, mostrar página offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline");
          }

          // Para otros recursos, simplemente devolver un error
          return new Response("Network error", {
            status: 408,
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    }),
  );
});
