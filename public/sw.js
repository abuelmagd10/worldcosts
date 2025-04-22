// Service Worker أساسي لـ PWA
self.addEventListener("install", (event) => {
  console.log("Service Worker installed")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated")
  return self.clients.claim()
})

// استراتيجية التخزين المؤقت
const CACHE_NAME = "currency-calculator-v2" // تحديث رقم الإصدار
const URLS_TO_CACHE = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  "/fonts/Amiri-Regular.ttf",
  "/fonts/Amiri-Bold.ttf",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  // تحسين استراتيجية التخزين المؤقت
  const requestUrl = new URL(event.request.url)

  // تجاهل طلبات التحليلات وطلبات الإعلانات
  if (
    requestUrl.pathname.includes("/api/") ||
    requestUrl.hostname.includes("google-analytics") ||
    requestUrl.hostname.includes("googletagmanager") ||
    requestUrl.hostname.includes("googlesyndication") ||
    requestUrl.hostname.includes("pagead2.googlesyndication")
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // إذا كان موجودًا في التخزين المؤقت، أعد الاستجابة
      if (response) {
        return response
      }

      // إذا لم يكن موجودًا، حاول الحصول عليه من الشبكة
      return fetch(event.request)
        .then((response) => {
          // لا تخزن الاستجابة إذا لم تكن صالحة
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // استنساخ الاستجابة للتخزين المؤقت
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // إذا فشلت الشبكة وكان طلب صفحة، أظهر صفحة عدم الاتصال
          if (event.request.mode === "navigate") {
            return caches.match("/offline")
          }

          // بالنسبة للموارد الأخرى، أعد خطأ الشبكة
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

// إضافة حدث تنظيف التخزين المؤقت
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
