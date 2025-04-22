// أنواع ملفات تعريف الارتباط
export enum CookieType {
  NECESSARY = "necessary",
  PREFERENCES = "preferences",
  ANALYTICS = "analytics",
  MARKETING = "marketing",
}

// حالة موافقة المستخدم
export type ConsentState = {
  [CookieType.NECESSARY]: boolean // دائمًا صحيح
  [CookieType.PREFERENCES]: boolean
  [CookieType.ANALYTICS]: boolean
  [CookieType.MARKETING]: boolean
  timestamp: number
}

// الحالة الافتراضية
const DEFAULT_CONSENT: ConsentState = {
  [CookieType.NECESSARY]: true,
  [CookieType.PREFERENCES]: false,
  [CookieType.ANALYTICS]: false,
  [CookieType.MARKETING]: false,
  timestamp: 0,
}

// مفتاح التخزين
const CONSENT_STORAGE_KEY = "cookie_consent"

// الحصول على حالة الموافقة الحالية
export const getConsent = (): ConsentState => {
  try {
    // استخدام localStorage مباشرة لتجنب مشاكل SSR
    if (typeof window !== "undefined" && window.localStorage) {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (storedConsent) {
        return JSON.parse(storedConsent) as ConsentState
      }
    }
    return DEFAULT_CONSENT
  } catch (e) {
    console.error("Error getting consent:", e)
    return DEFAULT_CONSENT
  }
}

// تحديث موافقة المستخدم
export const updateConsent = (consent: Partial<ConsentState>): ConsentState => {
  try {
    const currentConsent = getConsent()
    const newConsent: ConsentState = {
      ...currentConsent,
      ...consent,
      [CookieType.NECESSARY]: true, // دائمًا صحيح
      timestamp: Date.now(),
    }

    // استخدام localStorage مباشرة
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(newConsent))
    }

    return newConsent
  } catch (e) {
    console.error("Error updating consent:", e)
    return getConsent()
  }
}

// قبول جميع ملفات تعريف الارتباط
export const acceptAllCookies = (): ConsentState => {
  return updateConsent({
    [CookieType.PREFERENCES]: true,
    [CookieType.ANALYTICS]: true,
    [CookieType.MARKETING]: true,
  })
}

// رفض جميع ملفات تعريف الارتباط (باستثناء الضرورية)
export const rejectAllCookies = (): ConsentState => {
  return updateConsent({
    [CookieType.PREFERENCES]: false,
    [CookieType.ANALYTICS]: false,
    [CookieType.MARKETING]: false,
  })
}

// التحقق مما إذا كان المستخدم قد وافق على نوع معين من ملفات تعريف الارتباط
export const hasConsent = (type: CookieType): boolean => {
  const consent = getConsent()
  return consent[type]
}

// التحقق مما إذا كان المستخدم قد قدم موافقته
export const hasProvidedConsent = (): boolean => {
  const consent = getConsent()
  return consent.timestamp > 0
}
