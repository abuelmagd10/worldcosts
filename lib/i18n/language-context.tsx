"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type LanguageCode, type Translation } from "./translations"

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
  // Get initial language from localStorage or default to Arabic
  const [language, setLanguageState] = useState<LanguageCode>("ar")
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem("language") as LanguageCode
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Function to change language
  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    if (isClient) {
      localStorage.setItem("language", lang)
    }
  }

  // Get direction based on language
  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr"

  // Get translations for current language
  const t = translations[language]

  // Provide language context to children
  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}
