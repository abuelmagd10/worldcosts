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

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <TeslaButton variant="circle" size="icon" className="rounded-full bg-tesla-blue text-white">
        <div className="h-5 w-5" />
      </TeslaButton>
    )
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <TeslaButton
      variant="circle"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full bg-tesla-blue text-white"
      title={t.toggleTheme}
    >
      {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">{t.toggleTheme}</span>
    </TeslaButton>
  )
}
