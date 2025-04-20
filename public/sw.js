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
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devolver desde caché si está disponible
      if (response) {
        return response
      }

      // Si no está en caché, intentar obtenerlo de la red
      return fetch(event.request)
        .then((response) => {
          // No almacenar en caché si la respuesta no es válida
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clonar la respuesta para almacenarla en caché
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Si falla la red y es una solicitud de página, mostrar página offline
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }

          // Para otros recursos, simplemente devolver un error
          return new Response("Network error", {
            status: 408,
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          })
        })
    }),
  )
})
