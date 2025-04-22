"use server"

import { unstable_cache } from "next/cache"
import { FALLBACK_RATES } from "@/lib/exchange-rates"

// Añadir más divisas a la estructura ExchangeRates
export type ExchangeRates = {
  USD: number
  EGP: number
  AED: number
  EUR: number
  GBP: number
  SAR: number
  JPY: number
  CNY: number
  CAD: number
  AUD: number
  CHF: number
  INR: number
  RUB: number
  TRY: number
  BRL: number
  KWD: number
  QAR: number
  MYR: number
  // Nuevas divisas añadidas
  ILS: number // Shekel israelí
  JOD: number // Dinar jordano
  LBP: number // Libra libanesa
  MAD: number // Dirham marroquí
  OMR: number // Rial omaní
  BHD: number // Dinar bareiní
  DZD: number // Dinar argelino
  TND: number // Dinar tunecino
  lastUpdated: string
}

// تحديث وظيفة fetchExchangeRates لتحسين عملية الحصول على أسعار الصرف
// تعديل وظيفة fetchExchangeRates لاستخدام مصادر إضافية وتحسين معالجة الأخطاء
async function fetchExchangeRates(forceRefresh = false): Promise<ExchangeRates> {
  // قائمة بمصادر API لأسعار الصرف
  const apiSources = [
    {
      name: "ExchangeRate-API",
      url: "https://open.er-api.com/v6/latest/USD",
      extractRates: (data: any) => data.rates,
    },
    {
      name: "ExchangeRate.host",
      url: "https://api.exchangerate.host/latest?base=USD",
      extractRates: (data: any) => data.rates,
    },
    {
      name: "Frankfurter",
      url: "https://api.frankfurter.app/latest?from=USD",
      extractRates: (data: any) => data.rates,
    },
    {
      name: "CurrencyFreaks",
      url: "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=e8b2e1c5a3f44e2c9f8d7b6a5c4b3e2d1&base=USD",
      extractRates: (data: any) => data.rates,
    },
  ]

  // نتيجة نهائية مع دمج البيانات من جميع المصادر
  const result: ExchangeRates = { ...FALLBACK_RATES, lastUpdated: new Date().toISOString() }
  let successfulSources = 0

  // تجربة كل مصدر API
  for (const source of apiSources) {
    try {
      const cacheBuster = forceRefresh ? `&_=${Date.now()}` : ""
      const response = await fetch(`${source.url}${cacheBuster}`, {
        next: { revalidate: forceRefresh ? 0 : 86400 },
        cache: forceRefresh ? "no-store" : "default",
      })

      if (!response.ok) {
        console.warn(`${source.name} failed with status: ${response.status}`)
        continue
      }

      const data = await response.json()
      const rates = source.extractRates(data)

      if (!rates) {
        console.warn(`Invalid data format from ${source.name}`)
        continue
      }

      console.log(`Exchange rates fetched successfully from ${source.name}`)
      successfulSources++

      // دمج البيانات من هذا المصدر مع النتيجة
      for (const [key, value] of Object.entries(result)) {
        if (key !== "lastUpdated" && key !== "USD") {
          const currencyKey = key as keyof ExchangeRates
          // إذا كان المصدر يوفر سعر صرف لهذه العملة، استخدمه
          if (rates[currencyKey] && typeof rates[currencyKey] === "number" && rates[currencyKey] > 0) {
            result[currencyKey] = rates[currencyKey]
          }
        }
      }
    } catch (error) {
      console.error(`Error with ${source.name}:`, error)
    }
  }

  // التحقق من صحة البيانات قبل إرجاعها
  for (const [key, value] of Object.entries(result)) {
    if (key !== "lastUpdated" && (typeof value !== "number" || isNaN(value) || value <= 0)) {
      console.warn(`Invalid exchange rate for ${key}: ${value}, using fallback value`)
      result[key as keyof ExchangeRates] = FALLBACK_RATES[key as keyof ExchangeRates]
    }
  }

  // إضافة معلومات عن مصادر البيانات
  console.log(`Successfully fetched data from ${successfulSources} out of ${apiSources.length} sources`)

  return result
}

// Function to get exchange rates (without caching for force refresh)
export async function getExchangeRates(forceRefresh = false): Promise<ExchangeRates> {
  if (forceRefresh) {
    // Si se fuerza la actualización, omitir la caché completamente
    return fetchExchangeRates(true)
  }

  // Si no se fuerza la actualización, usar la caché
  return cachedGetExchangeRates()
}

// Cached version for normal use
const cachedGetExchangeRates = unstable_cache(
  async () => {
    return fetchExchangeRates(false)
  },
  ["exchange-rates"],
  { revalidate: 86400 }, // 24 hours in seconds
)

// Function to force refresh exchange rates
export async function refreshExchangeRates(): Promise<ExchangeRates> {
  // Forzar la actualización y omitir la caché
  return getExchangeRates(true)
}
