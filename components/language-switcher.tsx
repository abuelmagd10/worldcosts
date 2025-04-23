"use client"
import { Check, Globe } from "lucide-react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/language-context"
import { languages, type LanguageCode } from "@/lib/i18n/translations"
import { useState } from "react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <TeslaButton
          variant="circle"
          size="icon"
          className="rounded-full bg-tesla-blue text-white min-h-[44px] min-w-[44px]"
          aria-label="تغيير اللغة"
          aria-expanded={isOpen}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">تغيير اللغة</span>
        </TeslaButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border text-foreground" sideOffset={8}>
        <DropdownMenuGroup>
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as LanguageCode)}
              className="flex items-center justify-between hover:bg-secondary cursor-pointer py-3 px-4 min-h-[44px]"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleLanguageChange(lang.code as LanguageCode)
                }
              }}
            >
              <span>{lang.name}</span>
              {language === lang.code && <Check className="h-4 w-4 ml-2 text-tesla-blue" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
