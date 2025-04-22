/**
 * وظائف لإدارة ملفات تعريف الارتباط
 */

// تعيين ملف تعريف الارتباط
export function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

// الحصول على قيمة ملف تعريف الارتباط
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined

  const nameEQ = `${name}=`
  const ca = document.cookie.split(";")

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }

  return undefined
}

// حذف ملف تعريف الارتباط
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`
}
