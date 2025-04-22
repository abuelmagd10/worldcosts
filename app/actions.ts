"use server"

import { unstable_cache } from "next/cache"

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

// Actualizar las tasas de cambio predeterminadas
const FALLBACK_RATES: ExchangeRates = {
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
  // Nuevas divisas añadidas
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

// Actualizar la función fetchExchangeRates para incluir las nuevas divisas
async function fetchExchangeRates(forceRefresh = false): Promise<ExchangeRates> {
  try {
    // Usar ExchangeRate-API con un parámetro para evitar caché
    const cacheBuster = forceRefresh ? `?_=${Date.now()}` : ""
    const response = await fetch(`https://open.er-api.com/v6/latest/USD${cacheBuster}`, {
      next: { revalidate: forceRefresh ? 0 : 86400 }, // Revalidar inmediatamente si se fuerza, de lo contrario una vez al día
      cache: forceRefresh ? "no-store" : "default",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()

    // Crear una nueva fecha actual para la última actualización
    const now = new Date()

    return {
      USD: 1,
      EGP: data.rates.EGP || FALLBACK_RATES.EGP,
      AED: data.rates.AED || FALLBACK_RATES.AED,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates.GBP || FALLBACK_RATES.GBP,
      SAR: data.rates.SAR || FALLBACK_RATES.SAR,
      JPY: data.rates.JPY || FALLBACK_RATES.JPY,
      CNY: data.rates.CNY || FALLBACK_RATES.CNY,
      CAD: data.rates.CAD || FALLBACK_RATES.CAD,
      AUD: data.rates.AUD || FALLBACK_RATES.AUD,
      CHF: data.rates.CHF || FALLBACK_RATES.CHF,
      INR: data.rates.INR || FALLBACK_RATES.INR,
      RUB: data.rates.RUB || FALLBACK_RATES.RUB,
      TRY: data.rates.TRY || FALLBACK_RATES.TRY,
      BRL: data.rates.BRL || FALLBACK_RATES.BRL,
      KWD: data.rates.KWD || FALLBACK_RATES.KWD,
      QAR: data.rates.QAR || FALLBACK_RATES.QAR,
      MYR: data.rates.MYR || FALLBACK_RATES.MYR,
      // Nuevas divisas añadidas
      ILS: data.rates.ILS || FALLBACK_RATES.ILS,
      JOD: data.rates.JOD || FALLBACK_RATES.JOD,
      LBP: data.rates.LBP || FALLBACK_RATES.LBP,
      MAD: data.rates.MAD || FALLBACK_RATES.MAD,
      OMR: data.rates.OMR || FALLBACK_RATES.OMR,
      BHD: data.rates.BHD || FALLBACK_RATES.BHD,
      DZD: data.rates.DZD || FALLBACK_RATES.DZD,
      TND: data.rates.TND || FALLBACK_RATES.TND,
      lastUpdated: now.toISOString(),
    }
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    // Asegurarse de que incluso en caso de error, la fecha de última actualización sea la actual
    return {
      ...FALLBACK_RATES,
      lastUpdated: new Date().toISOString(),
    }
  }
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
