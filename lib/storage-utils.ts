/**
 * مكتبة مساعدة للتعامل مع التخزين المحلي وملفات تعريف الارتباط
 */

// التحقق من دعم التخزين المحلي
export const isLocalStorageSupported = (): boolean => {
  if (typeof window === "undefined") return false

  try {
    const testKey = "__test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

// التحقق من دعم ملفات تعريف الارتباط
export const isCookieSupported = (): boolean => {
  if (typeof document === "undefined") return false

  try {
    const testKey = "__test__"
    document.cookie = `${testKey}=${testKey}; max-age=10; path=/; SameSite=Lax`
    return document.cookie.indexOf(testKey) !== -1
  } catch (e) {
    return false
  }
}

// حفظ البيانات مع التحقق من الدعم
export function saveData(key: string, value: any): boolean {
  if (typeof window === "undefined") return false

  try {
    // محاولة استخدام التخزين المحلي أولاً
    if (isLocalStorageSupported()) {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    }

    // استخدام ملفات تعريف الارتباط كبديل
    if (isCookieSupported()) {
      const encodedValue = encodeURIComponent(JSON.stringify(value))
      document.cookie = `${key}=${encodedValue}; max-age=31536000; path=/; SameSite=Lax`
      return true
    }

    return false
  } catch (e) {
    console.error("Error saving data:", e)
    return false
  }
}

// استرجاع البيانات مع التحقق من الدعم
export function loadData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    // محاولة استخدام التخزين المحلي أولاً
    if (isLocalStorageSupported()) {
      const item = localStorage.getItem(key)
      if (item) {
        return JSON.parse(item) as T
      }
    }

    // محاولة استخدام ملفات تعريف الارتباط
    if (isCookieSupported()) {
      const cookies = document.cookie.split(";")
      for (const cookie of cookies) {
        const [cookieKey, cookieValue] = cookie.trim().split("=")
        if (cookieKey === key && cookieValue) {
          return JSON.parse(decodeURIComponent(cookieValue)) as T
        }
      }
    }

    return defaultValue
  } catch (e) {
    console.error("Error loading data:", e)
    return defaultValue
  }
}

// حذف البيانات
export function removeData(key: string): boolean {
  if (typeof window === "undefined") return false

  try {
    let success = false

    // محاولة حذف من التخزين المحلي
    if (isLocalStorageSupported()) {
      localStorage.removeItem(key)
      success = true
    }

    // محاولة حذف من ملفات تعريف الارتباط
    if (isCookieSupported()) {
      document.cookie = `${key}=; max-age=0; path=/; SameSite=Lax`
      success = true
    }

    return success
  } catch (e) {
    console.error("Error removing data:", e)
    return false
  }
}

// التحقق من دعم المحتوى المختلط
export function isMixedContentSupported(): boolean {
  if (typeof window === "undefined") return false
  return window.location.protocol === "https:"
}

// تحويل URL غير آمن إلى آمن
export function upgradeToHttps(url: string): string {
  if (url.startsWith("http:")) {
    return url.replace("http:", "https:")
  }
  return url
}
