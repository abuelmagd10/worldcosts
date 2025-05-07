"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [isActive, setIsActive] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <TeslaButton
        variant="circle"
        size="icon"
        className="rounded-full bg-tesla-blue text-white h-8 w-8 sm:h-10 sm:w-10 min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px]"
      >
        <div className="h-4 w-4 sm:h-5 sm:w-5" />
      </TeslaButton>
    )
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setIsActive(true)
    setTimeout(() => setIsActive(false), 200) // تأثير بصري للنقر
  }

  return (
    <TeslaButton
      variant="circle"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full bg-tesla-blue text-white h-8 w-8 sm:h-10 sm:w-10 min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px] ${isActive ? "scale-95" : ""}`}
      title={t.toggleTheme}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
      onTouchCancel={() => setIsActive(false)}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
      <span className="sr-only">{t.toggleTheme}</span>
    </TeslaButton>
  )
}
