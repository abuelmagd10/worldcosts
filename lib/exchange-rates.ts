import type { ExchangeRates } from "@/app/actions"

// تحديث القيم الافتراضية بأحدث أسعار الصرف
export const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  EGP: 49.28,
  AED: 3.67,
  EUR: 0.92,
  GBP: 0.79,
  SAR: 3.75,
  JPY: 151.72,
  CNY: 7.23,
  CAD: 1.36,
  AUD: 1.51,
  CHF: 0.9,
  INR: 83.5,
  RUB: 92.5,
  TRY: 32.15,
  BRL: 5.05,
  KWD: 0.31,
  QAR: 3.64,
  MYR: 4.7,
  // تحديث القيم الافتراضية للعملات المضافة
  ILS: 3.68,
  JOD: 0.71,
  LBP: 90000,
  MAD: 9.95,
  OMR: 0.385,
  BHD: 0.376,
  DZD: 134.5,
  TND: 3.12,
  lastUpdated: new Date().toISOString(),
}

// وظيفة للتحقق مما إذا كانت العملة تستخدم سعر صرف افتراضي
export function isUsingFallbackRate(currency: keyof ExchangeRates, rates: ExchangeRates): boolean {
  if (currency === "lastUpdated" || currency === "USD") return false
  return Math.abs(rates[currency] - FALLBACK_RATES[currency]) < 0.001
}

// وظيفة للحصول على أسعار الصرف المخصصة من التخزين المحلي
export function getCustomRates(): ExchangeRates | null {
  try {
    if (typeof window === "undefined") return null

    const storedRates = localStorage.getItem("custom_exchange_rates")
    if (storedRates) {
      return JSON.parse(storedRates) as ExchangeRates
    }
    return null
  } catch (e) {
    console.error("Error loading custom rates:", e)
    return null
  }
}

// وظيفة لحفظ أسعار الصرف المخصصة في التخزين المحلي
export function saveCustomRates(rates: ExchangeRates): boolean {
  try {
    if (typeof window === "undefined") return false

    localStorage.setItem("custom_exchange_rates", JSON.stringify(rates))
    return true
  } catch (e) {
    console.error("Error saving custom rates:", e)
    return false
  }
}
