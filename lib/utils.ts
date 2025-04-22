import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Actualizar la función formatNumber para manejar mejor los números en árabe
export function formatNumber(value: number, language = "ar", forPDF = false): string {
  // Para PDF siempre usar números occidentales para compatibilidad
  if (forPDF) {
    return value.toFixed(2)
  }

  // Usar Intl.NumberFormat para formatear correctamente según el idioma
  const formatted = new Intl.NumberFormat(
    language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(value)

  return formatted
}

// Añadir función para convertir números arábigos a occidentales para PDF
export function toWesternNumbers(text: string): string {
  return text.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (d) => String("0123456789".charAt("٠١٢٣٤٥٦٧٨٩".indexOf(d))))
}
