import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// تنسيق الأرقام بناءً على اللغة
export function formatNumber(value: number, language = "ar"): string {
  // استخدام الأرقام الإنجليزية دائمًا للـ PDF
  if (language === "en") {
    return value.toFixed(2)
  }

  // تنسيق الرقم بناءً على اللغة
  const formatted = new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return formatted
}
