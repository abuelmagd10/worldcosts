export type Currency =
  | "USD"
  | "EGP"
  | "AED"
  | "EUR"
  | "GBP"
  | "SAR"
  | "JPY"
  | "CNY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "INR"
  | "RUB"
  | "TRY"
  | "BRL"
  | "KWD"
  | "QAR"
  | "MYR"
  | "SGD"
  | "ZAR"
  | "SEK"
  | "NOK"
  | "DKK"
  | "ILS"
  | "JOD"
  | "BHD"
  | "OMR"
  | "MAD"
  | "TND"

export interface ExchangeRates {
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
  SGD: number
  ZAR: number
  SEK: number
  NOK: number
  DKK: number
  ILS: number
  JOD: number
  BHD: number
  OMR: number
  MAD: number
  TND: number
  lastUpdated: string
}

const BASE_URL = "https://api.exchangerate-api.com/v4/latest/USD"

export async function getExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch(BASE_URL, { next: { revalidate: 3600 } })

    if (!res.ok) {
      console.error("Failed to fetch exchange rates:", res.status, res.statusText)
      throw new Error(`Failed to fetch exchange rates: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()

    if (!data || !data.rates) {
      console.error("Invalid exchange rates data:", data)
      throw new Error("Invalid exchange rates data")
    }

    const rates: ExchangeRates = {
      USD: 1,
      EGP: data.rates.EGP,
      AED: data.rates.AED,
      EUR: data.rates.EUR,
      GBP: data.rates.GBP,
      SAR: data.rates.SAR,
      JPY: data.rates.JPY,
      CNY: data.rates.CNY,
      CAD: data.rates.CAD,
      AUD: data.rates.AUD,
      CHF: data.rates.CHF,
      INR: data.rates.INR,
      RUB: data.rates.RUB,
      TRY: data.rates.TRY,
      BRL: data.rates.BRL,
      KWD: data.rates.KWD,
      QAR: data.rates.QAR,
      MYR: data.rates.MYR,
      SGD: data.rates.SGD,
      ZAR: data.rates.ZAR,
      SEK: data.rates.SEK,
      NOK: data.rates.NOK,
      DKK: data.rates.DKK,
      ILS: data.rates.ILS,
      JOD: data.rates.JOD,
      BHD: data.rates.BHD,
      OMR: data.rates.OMR,
      MAD: data.rates.MAD,
      TND: data.rates.TND,
      lastUpdated: new Date().toISOString(),
    }

    return rates
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    // Provide default rates in case of an error
    return {
      USD: 1,
      EGP: 30.9,
      AED: 3.67,
      EUR: 0.92,
      GBP: 0.79,
      SAR: 3.75,
      JPY: 143.57,
      CNY: 7.24,
      CAD: 1.34,
      AUD: 1.53,
      CHF: 0.89,
      INR: 82.67,
      RUB: 92.23,
      TRY: 29.5,
      BRL: 4.92,
      KWD: 0.31,
      QAR: 3.64,
      MYR: 4.69,
      SGD: 1.35,
      ZAR: 18.5,
      SEK: 10.5,
      NOK: 10.7,
      DKK: 6.9,
      ILS: 3.7,
      JOD: 0.71,
      BHD: 0.38,
      OMR: 0.38,
      MAD: 10.0,
      TND: 3.1,
      lastUpdated: new Date().toISOString(),
    }
  }
}

export async function refreshExchangeRates(): Promise<ExchangeRates> {
  return getExchangeRates()
}

export async function addNote(formData: FormData) {
  const title = String(formData.get("title"))

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/notes`, {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ title }),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("Failed to add note:", error)
      return { error: "Failed to add note" }
    }

    return { data: null }
  } catch (error) {
    console.error("Error adding note:", error)
    return { error: "Failed to add note" }
  }
}

export async function deleteNote(id: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
    })

    if (!res.ok) {
      const error = await res.json()
      console.error("Failed to delete note:", error)
      return { success: false, error: "Failed to delete note" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    return { success: false, error: "Failed to delete note" }
  }
}
