// تحديد ما إذا كان ينبغي تخزين الاستجابة مؤقتًا بناءً على المسار
export function defaultCache(url: string): boolean {
  const urlObj = new URL(url)

  // تخزين الصفحة الرئيسية
  if (urlObj.pathname === "/") return true

  // تخزين الصور
  if (urlObj.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) return true

  // تخزين JavaScript وCSS
  if (urlObj.pathname.match(/\.(js|css)$/)) return true

  // تخزين الأيقونات
  if (urlObj.pathname.includes("/icons/")) return true

  // تجاهل طلبات API
  if (urlObj.pathname.includes("/api/")) return false

  // تجاهل المسارات المؤقتة
  if (urlObj.pathname.includes("/_next/")) return false

  // افتراضيًا، تخزين معظم المسارات
  return true
}

// التحقق من حالة الاتصال
export function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine
}
