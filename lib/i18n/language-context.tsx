"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type LanguageCode } from "./translations"
import type { Translation } from "./translations"

type LanguageContextType = {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: Translation
  dir: "rtl" | "ltr"
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  t: translations.ar,
  dir: "rtl",
})

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext)

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with a default language to avoid hydration mismatch
  const [language, setLanguageState] = useState<LanguageCode>("ar")
  const [mounted, setMounted] = useState(false)

  // Set mounted to true when component mounts
  useEffect(() => {
    setMounted(true)

    // Only access localStorage after component is mounted
    try {
      const savedLanguage = localStorage.getItem("language") as LanguageCode
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage)
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e)
    }
  }, [])

  // Function to change language
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    if (mounted) {
      try {
        localStorage.setItem("language", lang)
      } catch (e) {
        console.error("Error saving to localStorage:", e)
      }
    }
  }

  // Get direction based on language
  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr"

  // Get translations for current language
  const t = translations[language]

  // Provide language context to children
  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}
